export const defaultIndexNowKey = "sinhonjigi-20260531-7f6c9b2d4a1e8c03";

export function getIndexNowKey() {
  return process.env.INDEXNOW_KEY ?? defaultIndexNowKey;
}
