import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  const secret = req.headers.get("x-revalidate-secret");
  if (secret !== process.env.CRON_SECRET) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { path } = await req.json().catch(() => ({ path: "/" }));
  revalidatePath(path ?? "/");

  return Response.json({ revalidated: true, path });
}
