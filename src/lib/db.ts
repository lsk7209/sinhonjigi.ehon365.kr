import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "@/db/schema";

// lazy init — 환경변수 없어도 빌드 성공
let _db: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function getDb() {
  if (_db) return _db;

  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url) return null;

  const client = createClient({
    url,
    authToken: authToken ?? undefined,
  });

  _db = drizzle(client, { schema });
  return _db;
}

export type Db = NonNullable<ReturnType<typeof getDb>>;
