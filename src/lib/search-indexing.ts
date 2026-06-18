import { createSign } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { getIndexNowKey } from "@/lib/indexnow";
import { absoluteUrl, siteUrl } from "@/lib/site";

type IndexingResult = {
  service: string;
  ok: boolean;
  skipped?: boolean;
  status?: number;
  message?: string;
};

type ServiceAccount = {
  client_email?: string;
  private_key?: string;
};

let cachedGoogleToken: { accessToken: string; expiresAt: number } | null = null;

const googleTokenUrl = "https://oauth2.googleapis.com/token";
const googleWebmastersScope = "https://www.googleapis.com/auth/webmasters";

export async function notifySearchEngines(input: {
  changedUrls?: string[];
  sitemapUrl?: string;
}) {
  const sitemapUrl = input.sitemapUrl ?? absoluteUrl("/sitemap.xml");
  const changedUrls = normalizeChangedUrls(input.changedUrls);
  const results = await Promise.allSettled([
    submitGscSitemap(sitemapUrl),
    submitIndexNow(changedUrls),
  ]);

  return results.map((result): IndexingResult => {
    if (result.status === "fulfilled") return result.value;
    return {
      service: "search-indexing",
      ok: false,
      message: result.reason instanceof Error ? result.reason.message : "Unknown indexing error",
    };
  });
}

function normalizeChangedUrls(urls: string[] | undefined) {
  const siteHost = new URL(siteUrl).host;
  const normalized = (urls?.length ? urls : [siteUrl])
    .map((url) => {
      try {
        return new URL(url.startsWith("/") ? absoluteUrl(url) : url).toString();
      } catch {
        return null;
      }
    })
    .filter((url): url is string => Boolean(url))
    .filter((url) => new URL(url).host === siteHost);

  return [...new Set(normalized)];
}

async function submitIndexNow(urlList: string[]): Promise<IndexingResult> {
  const key = getIndexNowKey();

  const endpoints = (process.env.INDEXNOW_ENDPOINTS ?? "https://api.indexnow.org/indexnow")
    .split(",")
    .map((endpoint) => endpoint.trim())
    .filter(Boolean);

  const keyLocation = process.env.INDEXNOW_KEY_LOCATION ?? absoluteUrl("/indexnow-key.txt");
  const host = new URL(siteUrl).host;
  const body = JSON.stringify({ host, key, keyLocation, urlList });

  const responses = await Promise.all(
    endpoints.map(async (endpoint) => {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body,
      });
      return { endpoint, status: response.status, text: await response.text().catch(() => "") };
    }),
  );

  const failed = responses.filter((response) => ![200, 202].includes(response.status));
  if (failed.length) {
    return {
      service: "indexnow",
      ok: false,
      status: failed[0].status,
      message: failed.map((response) => `${response.endpoint}: ${response.status}`).join(", "),
    };
  }

  return {
    service: "indexnow",
    ok: true,
    status: responses[0]?.status,
    message: `${urlList.length} URL(s) submitted`,
  };
}

async function submitGscSitemap(sitemapUrl: string): Promise<IndexingResult> {
  const siteProperty = process.env.GSC_SITE_URL ?? `${siteUrl}/`;
  const accessToken = await getGoogleAccessToken();
  if (!accessToken) {
    return {
      service: "gsc-sitemap",
      ok: true,
      skipped: true,
      message: "Google service account credentials are not set",
    };
  }

  const endpoint =
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteProperty)}` +
    `/sitemaps/${encodeURIComponent(sitemapUrl)}`;

  const response = await fetch(endpoint, {
    method: "PUT",
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    return {
      service: "gsc-sitemap",
      ok: false,
      status: response.status,
      message: await response.text().catch(() => response.statusText),
    };
  }

  return { service: "gsc-sitemap", ok: true, status: response.status, message: sitemapUrl };
}

async function getGoogleAccessToken() {
  if (cachedGoogleToken && cachedGoogleToken.expiresAt > Date.now() + 60_000) {
    return cachedGoogleToken.accessToken;
  }

  const serviceAccount = getServiceAccount();
  if (!serviceAccount?.client_email || !serviceAccount.private_key) return null;

  const now = Math.floor(Date.now() / 1000);
  const assertion = signJwt(
    { alg: "RS256", typ: "JWT" },
    {
      iss: serviceAccount.client_email,
      scope: googleWebmastersScope,
      aud: googleTokenUrl,
      exp: now + 3600,
      iat: now,
    },
    serviceAccount.private_key.replace(/\\n/g, "\n"),
  );

  const response = await fetch(googleTokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });

  if (!response.ok) {
    throw new Error(`Google OAuth token request failed: ${response.status}`);
  }

  const token = (await response.json()) as { access_token: string; expires_in: number };
  cachedGoogleToken = {
    accessToken: token.access_token,
    expiresAt: Date.now() + token.expires_in * 1000,
  };
  return cachedGoogleToken.accessToken;
}

function getServiceAccount(): ServiceAccount | null {
  const filePath = process.env.GOOGLE_SERVICE_ACCOUNT_FILE;
  if (filePath && existsSync(filePath)) {
    return JSON.parse(readFileSync(filePath, "utf-8")) as ServiceAccount;
  }

  if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON_BASE64) {
    return JSON.parse(
      Buffer.from(process.env.GOOGLE_SERVICE_ACCOUNT_JSON_BASE64, "base64").toString("utf8"),
    ) as ServiceAccount;
  }

  if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    return JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON) as ServiceAccount;
  }

  if (process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
    return {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY,
    };
  }

  return null;
}

function signJwt(header: object, payload: object, privateKey: string) {
  const unsigned = `${base64UrlJson(header)}.${base64UrlJson(payload)}`;
  const signature = createSign("RSA-SHA256").update(unsigned).sign(privateKey).toString("base64url");
  return `${unsigned}.${signature}`;
}

function base64UrlJson(value: object) {
  return Buffer.from(JSON.stringify(value)).toString("base64url");
}
