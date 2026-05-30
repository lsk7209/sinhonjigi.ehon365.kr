import type {
  ConditionalFlags,
  Subsidy,
  NewlywedStat,
  WeddingHall,
} from "@/types";

interface FlagContext {
  subsidies: Subsidy[];
  newlywed_stats: NewlywedStat | null;
  wedding_halls: WeddingHall[];
  prev_hall_count?: number;
  population: number | null;
  tier: number;
  national_avg_benefit?: number;
  upcoming_fair?: boolean;
  nearby_fair?: boolean;
}

const NATIONAL_AVG_BENEFIT = 5_000_000; // 500만원 기준
const SMALL_POPULATION_THRESHOLD = 100_000;
const MANY_HALLS_THRESHOLD = 10;
const LOW_HOMEOWNER_RATIO = 0.3;
const HIGH_DUAL_INCOME_RATIO = 0.6;
const URGENT_DAYS = 30;

function totalBenefit(subsidies: Subsidy[]): number {
  return subsidies.reduce((sum, s) => sum + (s.amount_won ?? 0), 0);
}

function hasUrgentDeadline(subsidies: Subsidy[]): boolean {
  const now = new Date();
  const threshold = new Date(now.getTime() + URGENT_DAYS * 24 * 60 * 60 * 1000);
  return subsidies.some(
    (s) =>
      s.effective_to !== null &&
      s.effective_to <= threshold &&
      s.effective_to >= now,
  );
}

function isRecentlyUpdated(subsidies: Subsidy[]): boolean {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  return subsidies.some(
    (s) => s.last_verified_at !== null && s.last_verified_at >= thirtyDaysAgo,
  );
}

export function computeConditionalFlags(ctx: FlagContext): ConditionalFlags {
  const benefit = totalBenefit(ctx.subsidies);
  const avgBenefit = ctx.national_avg_benefit ?? NATIONAL_AVG_BENEFIT;

  return {
    benefitsAboveAverage: benefit > avgBenefit && ctx.subsidies.length > 0,
    benefitsBelowAverage: benefit < avgBenefit && ctx.subsidies.length > 0,
    urgentDeadline: hasUrgentDeadline(ctx.subsidies),
    recentlyUpdated: isRecentlyUpdated(ctx.subsidies),
    lowHomeownerRatio:
      ctx.newlywed_stats?.homeowner_ratio !== null &&
      ctx.newlywed_stats?.homeowner_ratio !== undefined &&
      ctx.newlywed_stats.homeowner_ratio < LOW_HOMEOWNER_RATIO,
    highDualIncome:
      ctx.newlywed_stats?.dual_income_ratio !== null &&
      ctx.newlywed_stats?.dual_income_ratio !== undefined &&
      ctx.newlywed_stats.dual_income_ratio > HIGH_DUAL_INCOME_RATIO,
    manyHalls: ctx.wedding_halls.length >= MANY_HALLS_THRESHOLD,
    decliningHalls:
      ctx.prev_hall_count !== undefined &&
      ctx.wedding_halls.length < ctx.prev_hall_count,
    t1WithUpcomingFair: ctx.tier === 1 && (ctx.upcoming_fair ?? false),
    t2NeedNearbyFair: ctx.tier === 2 && !(ctx.upcoming_fair ?? false),
    noLocalFair: !(ctx.upcoming_fair ?? false) && !(ctx.nearby_fair ?? false),
    smallPopulation:
      ctx.population !== null &&
      ctx.population !== undefined &&
      ctx.population < SMALL_POPULATION_THRESHOLD,
    noStatsData: ctx.newlywed_stats === null,
  };
}
