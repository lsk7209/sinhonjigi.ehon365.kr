import { revalidatePath } from "next/cache";
import { notifySearchEngines } from "@/lib/search-indexing";

export async function POST(req: Request) {
  const secret = req.headers.get("x-revalidate-secret")?.trim();
  const expectedSecret = (process.env.REVALIDATE_SECRET ?? process.env.CRON_SECRET)?.trim();
  if (!expectedSecret || secret !== expectedSecret) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { path, urls } = (await req.json().catch(() => ({ path: "/" }))) as {
    path?: string;
    urls?: string[];
  };
  const revalidatedPath = path ?? "/";
  revalidatePath(revalidatedPath);

  const indexing = await notifySearchEngines({
    changedUrls: urls?.length ? urls : [revalidatedPath],
  });

  return Response.json({ revalidated: true, path: revalidatedPath, indexing });
}
