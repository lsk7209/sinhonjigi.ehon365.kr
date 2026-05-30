import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const regions = sqliteTable("regions", {
  id: text("id").primaryKey(),
  sido: text("sido").notNull(),
  sigungu: text("sigungu"),
  name: text("name").notNull(),
  tier: integer("tier").notNull(),
  population: integer("population"),
  lat: real("lat"),
  lng: real("lng"),
  created_at: integer("created_at", { mode: "timestamp" }),
});

export const subsidies = sqliteTable("subsidies", {
  id: text("id").primaryKey(),
  region_id: text("region_id").references(() => regions.id),
  category: text("category").notNull(), // 'marriage' | 'newlywed' | 'housing'
  name: text("name").notNull(),
  amount_won: integer("amount_won"),
  amount_text: text("amount_text"),
  eligibility: text("eligibility"),
  application: text("application"),
  source_url: text("source_url"),
  source_name: text("source_name"),
  effective_from: integer("effective_from", { mode: "timestamp" }),
  effective_to: integer("effective_to", { mode: "timestamp" }),
  status: text("status").notNull().default("active"),
  last_verified_at: integer("last_verified_at", { mode: "timestamp" }),
});

export const marriage_stats = sqliteTable("marriage_stats", {
  id: text("id").primaryKey(),
  region_id: text("region_id").references(() => regions.id),
  year: integer("year").notNull(),
  total_marriages: integer("total_marriages"),
  avg_age_male: real("avg_age_male"),
  avg_age_female: real("avg_age_female"),
});

export const newlywed_stats = sqliteTable("newlywed_stats", {
  id: text("id").primaryKey(),
  region_id: text("region_id").references(() => regions.id),
  year: integer("year").notNull(),
  avg_income_won: integer("avg_income_won"),
  homeowner_ratio: real("homeowner_ratio"),
  dual_income_ratio: real("dual_income_ratio"),
});

export const wedding_halls = sqliteTable("wedding_halls", {
  id: text("id").primaryKey(),
  region_id: text("region_id").references(() => regions.id),
  name: text("name").notNull(),
  address: text("address"),
  status: text("status"),
  permit_date: integer("permit_date", { mode: "timestamp" }),
});

export const cpa_offers = sqliteTable("cpa_offers", {
  id: text("id").primaryKey(),
  vertical: text("vertical").notNull(), // 'fair' | 'sdm' | 'hall' | 'agency' | 'gift' | 'honeymoon'
  advertiser: text("advertiser").notNull(),
  brand: text("brand"),
  region_id: text("region_id").references(() => regions.id),
  region_inferred: integer("region_inferred", { mode: "boolean" }).default(
    false,
  ),
  payout_won: integer("payout_won"),
  landing_url: text("landing_url").notNull(),
  sub_id_param: text("sub_id_param"),
  status: text("status").notNull().default("active"), // 'active' | 'paused' | 'expired'
  start_date: integer("start_date", { mode: "timestamp" }),
  end_date: integer("end_date", { mode: "timestamp" }),
  priority: integer("priority").notNull().default(5),
  notes: text("notes"),
});

export const cpa_clicks = sqliteTable("cpa_clicks", {
  id: text("id").primaryKey(),
  offer_id: text("offer_id").references(() => cpa_offers.id),
  page_slug: text("page_slug"),
  region_id: text("region_id"),
  sub_id: text("sub_id"),
  ua: text("ua"),
  ref: text("ref"),
  clicked_at: integer("clicked_at", { mode: "timestamp" }),
});

export const pages = sqliteTable("pages", {
  slug: text("slug").primaryKey(),
  type: text("type").notNull(), // 'jiwon' | 'wedding' | 'sinhon' | 'guide'
  region_id: text("region_id").references(() => regions.id),
  title: text("title").notNull(),
  status: text("status").notNull().default("draft"), // 'draft' | 'enriched' | 'quality_passed' | 'published' | 'noindex'
  quality_score: integer("quality_score"),
  ai_commentary: text("ai_commentary"),
  faq_json: text("faq_json"),
  last_published_at: integer("last_published_at", { mode: "timestamp" }),
  last_audited_at: integer("last_audited_at", { mode: "timestamp" }),
});

export const forbidden_words_log = sqliteTable("forbidden_words_log", {
  id: text("id").primaryKey(),
  page_slug: text("page_slug"),
  word: text("word"),
  context: text("context"),
  detected_at: integer("detected_at", { mode: "timestamp" }),
});
