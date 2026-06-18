import { createHash } from "node:crypto";
import { wedding_halls } from "@/db/schema";
import type { Db } from "@/lib/db";
import regionsData from "@/data/seed/regions.json";

type RegionSeed = {
  id: string;
  sido: string;
  sigungu: string | null;
};

type RawLocaldataRow = Record<string, unknown>;

export type LocaldataIngestResult = {
  fetched: number;
  matched: number;
  inserted: number;
  skipped: number;
  errors: string[];
};

const regions = regionsData as RegionSeed[];
const publicWeddingHallApiUrl =
  "https://api.data.go.kr/openapi/tn_pubr_public_wedding_and_ceremony_hall_api";

export async function fetchLocaldataWeddingRows(input?: {
  authKey?: string;
  apiTypeCode?: string;
  from?: string;
  to?: string;
}) {
  const endpoint =
    process.env.PUBLIC_DATA_WEDDING_HALL_API_URL ??
    process.env.WEDDING_HALL_API_URL ??
    publicWeddingHallApiUrl;
  if (process.env.PUBLIC_DATA_SERVICE_KEY || endpoint !== publicWeddingHallApiUrl) {
    return fetchConfiguredPublicDataRows(endpoint);
  }

  const authKey =
    input?.authKey ?? process.env.PUBLIC_DATA_SERVICE_KEY ?? process.env.LOCALDATA_AUTH_KEY;
  const apiTypeCode = input?.apiTypeCode ?? process.env.LOCALDATA_API_TYPE_CODE;
  if (!authKey || !apiTypeCode) {
    throw new Error(
      "Set PUBLIC_DATA_WEDDING_HALL_API_URL, or legacy LOCALDATA_AUTH_KEY and LOCALDATA_API_TYPE_CODE",
    );
  }

  const today = new Date();
  const defaultTo = formatYmd(today);
  const defaultFrom = formatYmd(new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000));
  const url = new URL(
    `https://www.localdata.go.kr/platform/rest/${encodeURIComponent(apiTypeCode)}/openDataApi`,
  );
  url.searchParams.set("authKey", authKey);
  url.searchParams.set("lastModTsBgn", input?.from ?? defaultFrom);
  url.searchParams.set("lastModTsEnd", input?.to ?? defaultTo);

  const response = await fetch(url);
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`LOCALDATA request failed: ${response.status} ${text.slice(0, 200)}`);
  }

  return parseLocaldataResponse(text);
}

async function fetchConfiguredPublicDataRows(endpoint: string) {
  const url = new URL(endpoint);
  const serviceKey = process.env.PUBLIC_DATA_SERVICE_KEY;
  if (serviceKey && !url.searchParams.has("serviceKey")) {
    url.searchParams.set("serviceKey", serviceKey);
  }
  if (!url.searchParams.has("pageNo")) url.searchParams.set("pageNo", "1");
  if (!url.searchParams.has("numOfRows")) url.searchParams.set("numOfRows", "1000");
  if (!url.searchParams.has("type")) url.searchParams.set("type", "json");

  const response = await fetch(url);
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`Public data request failed: ${response.status} ${text.slice(0, 200)}`);
  }

  return parseLocaldataResponse(text);
}

export async function ingestWeddingHallRows(
  db: Db,
  rawRows: RawLocaldataRow[],
): Promise<LocaldataIngestResult> {
  const result: LocaldataIngestResult = {
    fetched: rawRows.length,
    matched: 0,
    inserted: 0,
    skipped: 0,
    errors: [],
  };

  for (const raw of rawRows) {
    const normalized = normalizeWeddingHall(raw);
    if (!normalized.name) {
      result.skipped += 1;
      continue;
    }

    const regionId = matchRegionId(raw, normalized.address);
    if (!regionId) {
      result.skipped += 1;
      continue;
    }

    result.matched += 1;
    const values = {
      id: buildWeddingHallId(regionId, normalized.name, normalized.address),
      region_id: regionId,
      name: normalized.name,
      address: normalized.address,
      status: normalized.status,
      permit_date: normalized.permitDate,
    };

    try {
      await db
        .insert(wedding_halls)
        .values(values)
        .onConflictDoUpdate({
          target: wedding_halls.id,
          set: {
            region_id: values.region_id,
            name: values.name,
            address: values.address,
            status: values.status,
            permit_date: values.permit_date,
          },
        });
      result.inserted += 1;
    } catch (error) {
      result.errors.push(error instanceof Error ? error.message : "Unknown insert error");
    }
  }

  return result;
}

export function normalizeWeddingHall(row: RawLocaldataRow) {
  const name = firstString(row, ["bplcNm", "BPLCNM", "name", "사업장명"]);
  const standardName = firstString(row, ["BPLC_NM"]);
  const address =
    firstString(row, ["LCTN_ROAD_NM_ADDR", "rdnWhlAddr", "RDNWHLADDR", "address", "도로명전체주소", "소재지도로명주소"]) ??
    firstString(row, [
      "LCTN_LOTNO_ADDR",
      "siteWhlAddr",
      "SITEWHLADDR",
      "sitewhlAddr",
      "address_old",
      "소재지전체주소",
      "소재지지번주소",
    ]);
  const status = normalizeStatus(
    firstString(row, ["OPER_YN", "bsnStateNm", "BSNSTATENM", "status", "영업상태명", "운영여부"]),
  );
  const permitDate = parseYmdDate(
    firstString(row, ["apvPermYmd", "APVPERMYMD", "permit_date", "인허가일자"]),
  );

  return {
    name: (standardName ?? name)?.trim() ?? null,
    address: address?.trim() ?? null,
    status,
    permitDate,
  };
}

function parseLocaldataResponse(text: string): RawLocaldataRow[] {
  const trimmed = text.trim();
  if (!trimmed) return [];

  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    const parsed = JSON.parse(trimmed) as unknown;
    return findObjectRows(parsed);
  }

  return parseXmlRows(trimmed);
}

function findObjectRows(value: unknown): RawLocaldataRow[] {
  if (Array.isArray(value)) {
    return value.flatMap((item) => findObjectRows(item));
  }

  if (!isRecord(value)) return [];

  const directItems = ["row", "rows", "item", "items", "data", "list"]
    .map((key) => value[key])
    .find((entry) => Array.isArray(entry));
  if (Array.isArray(directItems)) {
    return directItems.filter(isRecord);
  }

  const looksLikeRow = Boolean(
    firstString(value, ["bplcNm", "BPLCNM", "name", "사업장명"]) &&
      (firstString(value, ["rdnWhlAddr", "RDNWHLADDR", "address", "도로명전체주소"]) ||
        firstString(value, ["siteWhlAddr", "SITEWHLADDR", "sitewhlAddr", "소재지전체주소"])),
  );
  const looksLikeStandardRow = Boolean(
    firstString(value, ["BPLC_NM"]) &&
      (firstString(value, ["LCTN_ROAD_NM_ADDR"]) || firstString(value, ["LCTN_LOTNO_ADDR"])),
  );
  if (looksLikeRow || looksLikeStandardRow) return [value];

  return Object.values(value).flatMap((entry) => findObjectRows(entry));
}

function parseXmlRows(xml: string): RawLocaldataRow[] {
  const rowMatches = [...xml.matchAll(/<(row|item)>([\s\S]*?)<\/\1>/gi)];
  return rowMatches.map((match) => {
    const row: RawLocaldataRow = {};
    const fields = [...match[2].matchAll(/<([A-Za-z0-9_]+)>([\s\S]*?)<\/\1>/g)];
    for (const [, key, value] of fields) {
      row[key] = decodeXml(value.trim());
    }
    return row;
  });
}

function matchRegionId(row: RawLocaldataRow, address: string | null) {
  const sido = firstString(row, ["CTPV_NM", "시도명"]);
  const sigungu = firstString(row, ["SGG_NM", "시군구명"]);
  if (sido || sigungu) {
    const byFields = regions.find(
      (region) =>
        (!sido || compact(region.sido) === compact(sido)) &&
        (!sigungu || compact(region.sigungu ?? "") === compact(sigungu)),
    );
    if (byFields) return byFields.id;
  }

  if (!address) return null;
  const compactAddress = compact(address);

  const exact = regions.find(
    (region) =>
      compactAddress.includes(compact(region.sido)) &&
      (!region.sigungu || compactAddress.includes(compact(region.sigungu))),
  );
  if (exact) return exact.id;

  const bySigungu = regions.find(
    (region) => region.sigungu && compactAddress.includes(compact(region.sigungu)),
  );
  return bySigungu?.id ?? null;
}

function buildWeddingHallId(regionId: string, name: string, address: string | null) {
  const hash = createHash("sha1")
    .update(`${regionId}|${compact(name)}|${compact(address ?? "")}`)
    .digest("hex")
    .slice(0, 16);
  return `localdata-${hash}`;
}

function firstString(row: RawLocaldataRow, keys: string[]) {
  for (const key of keys) {
    const value = row[key];
    if (typeof value === "string" && value.trim()) return value;
    if (typeof value === "number") return String(value);
  }
  return null;
}

function normalizeStatus(value: string | null) {
  if (!value) return null;
  if (value === "Y") return "영업/정상";
  if (value === "N") return "미운영";
  if (value.includes("폐업")) return "폐업";
  if (value.includes("휴업")) return "휴업";
  if (value.includes("취소") || value.includes("말소") || value.includes("만료")) {
    return "취소/말소/만료";
  }
  if (value.includes("영업") || value.includes("정상")) return "영업/정상";
  return value;
}

function parseYmdDate(value: string | null) {
  if (!value) return null;
  const digits = value.replace(/\D/g, "");
  if (digits.length < 8) return null;
  const year = Number(digits.slice(0, 4));
  const month = Number(digits.slice(4, 6)) - 1;
  const day = Number(digits.slice(6, 8));
  return new Date(Date.UTC(year, month, day));
}

function formatYmd(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
}

function compact(value: string) {
  return value.replace(/\s/g, "").toLowerCase();
}

function isRecord(value: unknown): value is RawLocaldataRow {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function decodeXml(value: string) {
  return value
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&apos;", "'")
    .replaceAll("&amp;", "&");
}
