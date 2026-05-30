// 공통 타입 정의

export interface Region {
  id: string;
  sido: string;
  sigungu: string | null;
  name: string;
  tier: number;
  population: number | null;
  lat: number | null;
  lng: number | null;
  created_at: Date | null;
}

export interface Subsidy {
  id: string;
  region_id: string | null;
  category: "marriage" | "newlywed" | "housing";
  name: string;
  amount_won: number | null;
  amount_text: string | null;
  eligibility: string | null;
  application: string | null;
  source_url: string | null;
  source_name: string | null;
  effective_from: Date | null;
  effective_to: Date | null;
  status: string;
  last_verified_at: Date | null;
}

export interface MarriageStat {
  id: string;
  region_id: string | null;
  year: number;
  total_marriages: number | null;
  avg_age_male: number | null;
  avg_age_female: number | null;
}

export interface NewlywedStat {
  id: string;
  region_id: string | null;
  year: number;
  avg_income_won: number | null;
  homeowner_ratio: number | null;
  dual_income_ratio: number | null;
}

export interface WeddingHall {
  id: string;
  region_id: string | null;
  name: string;
  address: string | null;
  status: string | null;
  permit_date: Date | null;
}

export interface CpaOffer {
  id: string;
  vertical: "fair" | "sdm" | "hall" | "agency" | "gift" | "honeymoon";
  advertiser: string;
  brand: string | null;
  region_id: string | null;
  region_inferred: boolean | null;
  payout_won: number | null;
  landing_url: string;
  sub_id_param: string | null;
  status: string;
  start_date: Date | null;
  end_date: Date | null;
  priority: number;
  notes: string | null;
}

export interface CpaClick {
  id: string;
  offer_id: string | null;
  page_slug: string | null;
  region_id: string | null;
  sub_id: string | null;
  ua: string | null;
  ref: string | null;
  clicked_at: Date | null;
}

export interface Page {
  slug: string;
  type: "jiwon" | "wedding" | "sinhon" | "guide";
  region_id: string | null;
  title: string;
  status: "draft" | "enriched" | "quality_passed" | "published" | "noindex";
  quality_score: number | null;
  ai_commentary: string | null;
  faq_json: string | null;
  last_published_at: Date | null;
  last_audited_at: Date | null;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ConditionalFlags {
  benefitsAboveAverage: boolean;
  benefitsBelowAverage: boolean;
  urgentDeadline: boolean;
  recentlyUpdated: boolean;
  lowHomeownerRatio: boolean;
  highDualIncome: boolean;
  manyHalls: boolean;
  decliningHalls: boolean;
  t1WithUpcomingFair: boolean;
  t2NeedNearbyFair: boolean;
  noLocalFair: boolean;
  smallPopulation: boolean;
  noStatsData: boolean;
}
