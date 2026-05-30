// TODO: 보조금24 API 필드맵 수령 후 구현
// 필요 파일: src/data/field-maps/bojo24.json
export async function GET(req: Request) {
  const secret = req.headers.get("x-cron-secret");
  if (secret !== process.env.CRON_SECRET) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  return Response.json({ ok: true, message: "TODO: 보조금24 수집 미구현" });
}
