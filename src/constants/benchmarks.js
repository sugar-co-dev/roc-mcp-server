// Update DATA_AS_OF and review numbers quarterly.
// Commission rates, AOV, and category GMV shares sourced from:
//   - syncly.app TikTok Affiliate Playbook 2026
//   - 360om.agency commission benchmark analysis
//   - accio.com TikTok Shop US Top Categories 2025
//   - redstagfulfillment.com AOV data 2025
//   - marketingltb.com 93+ TikTok Shop Stats 2025
// Per-brand median GMV figures derived from RoC platform data (100+ brands, $20M+ GMV).
export const DATA_AS_OF = "2026-Q1";

export const PLATFORM_STATS = {
  brandsProcessed: 100,
  gmvProcessed: "$20M+",
  launchDate: "2025-10-01",
  daysToFirstMillionARR: 75,
};

// Real platform-wide benchmarks from public research (2025 data)
export const PLATFORM_BENCHMARKS = {
  overallShopConversionRate: 0.034,        // 3.4% platform avg (up from 2.7% in 2024)
  targetedCollabCvr: { min: 0.08, max: 0.12 }, // 8-12% with well-matched creators
  openCollabCvr: { min: 0.02, max: 0.04 },     // 2-4% open collaboration
  beautySweetSpotCvr: 0.082,              // 8.2% for beauty products in $15-35 range
  videoCtr: { min: 0.015, max: 0.03 },    // 1.5-3% CTR from video views
  videoToPurchaseCvr: { min: 0.01, max: 0.03 }, // 1-3% of clicks convert to purchase
  avgAffiliateVideoReach: 12762,          // avg users per affiliate video (2025)
  activeAffiliateRate: { min: 0.10, max: 0.20 }, // % of onboarded affiliates driving ≥1 sale/mo
  productSeedingPostRate: { min: 0.30, max: 0.40 }, // % of creators who post after receiving samples
  sparkAdsCompletionLift: 0.30,           // 30% higher completion vs standard ads
  sparkAdsEngagementLift: 1.42,           // 142% higher engagement vs standard ads
  usAvgAov: 59,                           // US avg $59/transaction (2024)
  bestConvertingPriceRange: { min: 15, max: 35 }, // sweet spot for impulse conversion
};

export const CATEGORY_BENCHMARKS = {
  beauty: {
    // Beauty = 22% of total TikTok Shop US GMV ($2.49B). AOV $35-45 for single products, $63 bundled.
    // Commission: 15-30% range; 18-20% is now competitive sweet spot (15% is below market).
    medianMonthlyGmv: 20000,
    topQuartileMonthlyGmv: 65000,
    avgCreatorConversionRate: 0.20,   // % of outreached creators who activate (seeding posting rate 30-40%, active affiliate 10-20%)
    avgOrderValue: 42,                // $35-45 individual products; $63 bundled
    avgCommissionRate: 0.18,          // 18% competitive sweet spot (syncly.app: "15-30%, sweet spot now 18-20%")
    topFormats: ["short-form review", "get-ready-with-me", "live demo"],
    avgTimeToFirstSaleDays: 12,
  },
  cpg: {
    // CPG/Food = ~7% of US GMV. Low margins → lower commissions. High acceptance rate (taste reaction content goes viral).
    medianMonthlyGmv: 9000,
    topQuartileMonthlyGmv: 32000,
    avgCreatorConversionRate: 0.15,   // Higher than average — taste reaction content has strong organic pull
    avgOrderValue: 24,
    avgCommissionRate: 0.10,          // Low margins constrain rates; 8-12% typical
    topFormats: ["taste test", "lifestyle integration", "recipe content"],
    avgTimeToFirstSaleDays: 18,
  },
  fashion: {
    // Fashion/Womenswear = 12.6% of US GMV ($1.39B). AOV $52-64 (higher with try-on hauls showing multiple items).
    // Commission: 10-15% range; seasonal spikes to 20% during launch pushes.
    medianMonthlyGmv: 15000,
    topQuartileMonthlyGmv: 50000,
    avgCreatorConversionRate: 0.18,   // Strong activation — try-on haul content is a natural fit
    avgOrderValue: 52,
    avgCommissionRate: 0.13,          // 10-15% typical; 13% sweet spot
    topFormats: ["outfit-of-the-day", "try-on haul", "styling tips"],
    avgTimeToFirstSaleDays: 14,
  },
  wellness: {
    // Health = 5.4% of US GMV. Typical orders $30-100. Longer purchase consideration cycle → higher commissions needed.
    medianMonthlyGmv: 12000,
    topQuartileMonthlyGmv: 40000,
    avgCreatorConversionRate: 0.14,
    avgOrderValue: 48,                // $30-100 range; $48 midpoint
    avgCommissionRate: 0.15,          // Health avg 14%; 15-16% competitive
    topFormats: ["routine integration", "before/after", "educational explainer"],
    avgTimeToFirstSaleDays: 20,
  },
  home: {
    // Home goods: strong with transformation content. Lower creator pool density. Longer funnel.
    medianMonthlyGmv: 8000,
    topQuartileMonthlyGmv: 28000,
    avgCreatorConversionRate: 0.12,
    avgOrderValue: 58,                // Under $100 sweet spot; $58 typical
    avgCommissionRate: 0.10,          // 8-12% range; low margins
    topFormats: ["unboxing", "room transformation", "cleaning routine"],
    avgTimeToFirstSaleDays: 22,
  },
  supplements: {
    // Supplements sit under health category. Highest commission rates justified by longer purchase cycle + results-based content.
    medianMonthlyGmv: 14000,
    topQuartileMonthlyGmv: 46000,
    avgCreatorConversionRate: 0.14,   // Results content takes 3-6 weeks to produce; lower initial activation
    avgOrderValue: 55,
    avgCommissionRate: 0.18,          // 15-25% range; 18% competitive (high LTV product)
    topFormats: ["daily routine", "results documentation", "educational"],
    avgTimeToFirstSaleDays: 16,
  },
};

export const DEFAULT_CATEGORY = "beauty";

export const ROC_COEFFICIENTS = {
  beauty:      { commissionSensitivity: 1.4, sampleSensitivity: 1.3,  followerTierMultiplier: { nano: 0.9,  micro: 1.0,  mid: 1.1,  macro: 0.85 } },
  cpg:         { commissionSensitivity: 1.2, sampleSensitivity: 1.5,  followerTierMultiplier: { nano: 1.1,  micro: 1.0,  mid: 0.95, macro: 0.8  } },
  fashion:     { commissionSensitivity: 1.3, sampleSensitivity: 1.2,  followerTierMultiplier: { nano: 0.85, micro: 1.0,  mid: 1.15, macro: 0.9  } },
  wellness:    { commissionSensitivity: 1.1, sampleSensitivity: 1.4,  followerTierMultiplier: { nano: 1.0,  micro: 1.05, mid: 1.0,  macro: 0.8  } },
  home:        { commissionSensitivity: 1.0, sampleSensitivity: 1.6,  followerTierMultiplier: { nano: 1.1,  micro: 1.0,  mid: 0.9,  macro: 0.75 } },
  supplements: { commissionSensitivity: 1.3, sampleSensitivity: 1.35, followerTierMultiplier: { nano: 0.95, micro: 1.05, mid: 1.0,  macro: 0.8  } },
};

export const OUTREACH_FUNNEL = {
  connectionRequestAcceptRate: 0.35,   // 35% cold outreach accept rate (targeted)
  productSeedingPostRate: 0.35,        // 35% of creators who receive samples post within 2 weeks
  activeAffiliateConversionRate: 0.15, // 15% of onboarded affiliates drive ≥1 sale/month
};
