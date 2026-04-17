// RoC Benchmark Data
// Source: $20M+ GMV processed across 100+ active brands on TikTok Shop

export const CATEGORY_BENCHMARKS = {
  beauty: {
    category: "beauty",
    displayName: "Beauty & Cosmetics",
    monthlyGMV: { low: 18000, mid: 42000, high: 65000, topQuartile: 120000 },
    avgROCMultiple: { low: 3.2, high: 8.1 },
    creatorPoolSize: "85,000+ creators on TikTok Shop",
    bestPriceBand: { min: 18, max: 65 },
    avgCommissionRate: { min: 10, max: 20, sweet: 15 },
    avgAcceptanceRate: { min: 38, max: 54 },
    timeToFirstGMV: "1–3 weeks",
    topCreatorTier: "micro",
    seasonalPeaks: ["Q4 (holiday)", "February (Valentine's)", "May (Mother's Day)"],
    notes: "Highest creator density on TikTok Shop. Before/after and transformation content dominates. Micro creators (15K–100K) outperform macro 3:1 in conversion rate."
  },
  skincare: {
    category: "skincare",
    displayName: "Skincare",
    monthlyGMV: { low: 15000, mid: 38000, high: 60000, topQuartile: 110000 },
    avgROCMultiple: { low: 3.0, high: 7.5 },
    creatorPoolSize: "60,000+ creators on TikTok Shop",
    bestPriceBand: { min: 22, max: 78 },
    avgCommissionRate: { min: 10, max: 18, sweet: 13 },
    avgAcceptanceRate: { min: 35, max: 50 },
    timeToFirstGMV: "2–4 weeks",
    topCreatorTier: "micro",
    seasonalPeaks: ["Q1 (new year skin reset)", "Q4 (gifting)"],
    notes: "Education-forward content converts best. Creators who explain ingredients outperform lifestyle-only accounts. Trust signals are critical."
  },
  wellness: {
    category: "wellness",
    displayName: "Wellness",
    monthlyGMV: { low: 12000, mid: 30000, high: 52000, topQuartile: 90000 },
    avgROCMultiple: { low: 2.8, high: 6.4 },
    creatorPoolSize: "45,000+ creators on TikTok Shop",
    bestPriceBand: { min: 25, max: 70 },
    avgCommissionRate: { min: 12, max: 22, sweet: 16 },
    avgAcceptanceRate: { min: 30, max: 46 },
    timeToFirstGMV: "2–5 weeks",
    topCreatorTier: "micro",
    seasonalPeaks: ["January (new year)", "September (back to routine)"],
    notes: "Lifestyle integration content outperforms hard sell. Creators with authentic wellness routines convert at 2x vs promotional-style creators."
  },
  supplements: {
    category: "supplements",
    displayName: "Supplements & Nutrition",
    monthlyGMV: { low: 10000, mid: 28000, high: 48000, topQuartile: 85000 },
    avgROCMultiple: { low: 2.5, high: 5.8 },
    creatorPoolSize: "30,000+ creators on TikTok Shop",
    bestPriceBand: { min: 28, max: 75 },
    avgCommissionRate: { min: 14, max: 25, sweet: 18 },
    avgAcceptanceRate: { min: 28, max: 42 },
    timeToFirstGMV: "3–6 weeks",
    topCreatorTier: "micro",
    seasonalPeaks: ["January", "pre-summer (April/May)"],
    notes: "Results-focused content works but must stay within platform guidelines. Fitness creators with engaged audiences outperform general lifestyle."
  },
  food: {
    category: "food",
    displayName: "Food & Beverage",
    monthlyGMV: { low: 8000, mid: 22000, high: 38000, topQuartile: 70000 },
    avgROCMultiple: { low: 2.2, high: 5.0 },
    creatorPoolSize: "55,000+ creators on TikTok Shop",
    bestPriceBand: { min: 12, max: 40 },
    avgCommissionRate: { min: 8, max: 15, sweet: 11 },
    avgAcceptanceRate: { min: 40, max: 58 },
    timeToFirstGMV: "1–3 weeks",
    topCreatorTier: "micro",
    seasonalPeaks: ["Q4 (holiday gifting)", "Summer (snacks/beverages)"],
    notes: "Taste-reaction and recipe integration content drives highest conversion. Lower AOV means volume is key."
  },
  cpg: {
    category: "cpg",
    displayName: "Consumer Packaged Goods",
    monthlyGMV: { low: 8000, mid: 20000, high: 35000, topQuartile: 65000 },
    avgROCMultiple: { low: 2.0, high: 4.8 },
    creatorPoolSize: "40,000+ creators on TikTok Shop",
    bestPriceBand: { min: 10, max: 38 },
    avgCommissionRate: { min: 8, max: 14, sweet: 10 },
    avgAcceptanceRate: { min: 38, max: 55 },
    timeToFirstGMV: "2–4 weeks",
    topCreatorTier: "micro",
    seasonalPeaks: ["Q4", "Back to school (August)"],
    notes: "Bundle promotions outperform single-unit. Everyday-use demonstration content converts best."
  },
  apparel: {
    category: "apparel",
    displayName: "Apparel & Clothing",
    monthlyGMV: { low: 10000, mid: 28000, high: 48000, topQuartile: 88000 },
    avgROCMultiple: { low: 2.6, high: 6.0 },
    creatorPoolSize: "70,000+ creators on TikTok Shop",
    bestPriceBand: { min: 22, max: 65 },
    avgCommissionRate: { min: 10, max: 18, sweet: 13 },
    avgAcceptanceRate: { min: 35, max: 52 },
    timeToFirstGMV: "2–4 weeks",
    topCreatorTier: "micro",
    seasonalPeaks: ["Q4 (holiday)", "Spring", "Back to school"],
    notes: "Try-on hauls and outfit styling drives highest conversion. Size inclusivity content significantly expands creator pool."
  },
  fashion: {
    category: "fashion",
    displayName: "Fashion & Accessories",
    monthlyGMV: { low: 10000, mid: 30000, high: 52000, topQuartile: 95000 },
    avgROCMultiple: { low: 2.8, high: 6.5 },
    creatorPoolSize: "75,000+ creators on TikTok Shop",
    bestPriceBand: { min: 20, max: 70 },
    avgCommissionRate: { min: 10, max: 20, sweet: 14 },
    avgAcceptanceRate: { min: 36, max: 52 },
    timeToFirstGMV: "2–3 weeks",
    topCreatorTier: "micro",
    seasonalPeaks: ["Q4", "Spring", "Back to school"],
    notes: "Styling and trend-forward content dominates. Creators with strong aesthetic POV outperform generic fashion accounts."
  },
  home: {
    category: "home",
    displayName: "Home & Living",
    monthlyGMV: { low: 6000, mid: 18000, high: 32000, topQuartile: 60000 },
    avgROCMultiple: { low: 2.0, high: 4.5 },
    creatorPoolSize: "35,000+ creators on TikTok Shop",
    bestPriceBand: { min: 20, max: 60 },
    avgCommissionRate: { min: 8, max: 15, sweet: 11 },
    avgAcceptanceRate: { min: 30, max: 46 },
    timeToFirstGMV: "3–6 weeks",
    topCreatorTier: "micro",
    seasonalPeaks: ["Q1 (organization)", "Q4 (gifting)", "Spring cleaning"],
    notes: "Before/after transformation and organization content drives best results."
  },
  fitness: {
    category: "fitness",
    displayName: "Fitness & Sports",
    monthlyGMV: { low: 8000, mid: 22000, high: 40000, topQuartile: 72000 },
    avgROCMultiple: { low: 2.4, high: 5.5 },
    creatorPoolSize: "40,000+ creators on TikTok Shop",
    bestPriceBand: { min: 25, max: 70 },
    avgCommissionRate: { min: 10, max: 20, sweet: 14 },
    avgAcceptanceRate: { min: 32, max: 48 },
    timeToFirstGMV: "2–5 weeks",
    topCreatorTier: "micro",
    seasonalPeaks: ["January (new year)", "Pre-summer (April/May)"],
    notes: "In-use demonstration and results content converts best. Creators with credible fitness backgrounds outperform general lifestyle."
  },
  pet: {
    category: "pet",
    displayName: "Pet",
    monthlyGMV: { low: 7000, mid: 19000, high: 35000, topQuartile: 62000 },
    avgROCMultiple: { low: 2.2, high: 5.0 },
    creatorPoolSize: "28,000+ creators on TikTok Shop",
    bestPriceBand: { min: 15, max: 45 },
    avgCommissionRate: { min: 8, max: 16, sweet: 12 },
    avgAcceptanceRate: { min: 40, max: 58 },
    timeToFirstGMV: "2–4 weeks",
    topCreatorTier: "micro",
    seasonalPeaks: ["Q4 (gifting)", "Summer"],
    notes: "Pet reaction and unboxing content has very high organic reach. Pet owner communities are highly engaged."
  },
  personal_care: {
    category: "personal_care",
    displayName: "Personal Care",
    monthlyGMV: { low: 9000, mid: 24000, high: 42000, topQuartile: 78000 },
    avgROCMultiple: { low: 2.6, high: 5.8 },
    creatorPoolSize: "50,000+ creators on TikTok Shop",
    bestPriceBand: { min: 15, max: 55 },
    avgCommissionRate: { min: 10, max: 18, sweet: 13 },
    avgAcceptanceRate: { min: 35, max: 50 },
    timeToFirstGMV: "2–4 weeks",
    topCreatorTier: "micro",
    seasonalPeaks: ["Q4", "Summer"],
    notes: "Routine-integration and results-based content converts best."
  }
};

export const CONTENT_FORMATS = [
  {
    format: "Before/After Transformation",
    conversionRate: 88,
    bestFor: ["beauty", "skincare", "wellness", "personal_care", "home", "fitness"],
    viralPotential: "very_high",
    avgViewDuration: "85% completion",
    description: "Creator shows a visible transformation. The contrast drives curiosity and trust simultaneously.",
    tips: [
      "Show the 'after' in the first 2 seconds to hook viewers",
      "Make the before state relatable, not embarrassing",
      "Include time duration for credibility (e.g. '30 days later')"
    ]
  },
  {
    format: "Tutorial / How-To",
    conversionRate: 76,
    bestFor: ["beauty", "skincare", "food", "fitness", "home", "personal_care"],
    viralPotential: "high",
    avgViewDuration: "78% completion",
    description: "Step-by-step demonstration of using the product. Positions the creator as an expert while showing the product in action.",
    tips: [
      "Keep it under 60 seconds for best completion",
      "Show the product name and price clearly at step one",
      "End with a tangible result the viewer wants"
    ]
  },
  {
    format: "Try-On / Fit Check",
    conversionRate: 74,
    bestFor: ["apparel", "fashion"],
    viralPotential: "very_high",
    avgViewDuration: "80% completion",
    description: "Creator tries on multiple angles or styling options. Reduces purchase anxiety.",
    tips: [
      "Show multiple body angles to increase confidence",
      "Include size information on screen",
      "Style it multiple ways to increase perceived value"
    ]
  },
  {
    format: "Unboxing / First Impression",
    conversionRate: 71,
    bestFor: ["beauty", "apparel", "fashion", "pet", "home", "cpg"],
    viralPotential: "high",
    avgViewDuration: "82% completion",
    description: "Authentic first reaction to receiving the product. Taps into gifting psychology.",
    tips: [
      "Genuine surprise/delight reactions drive shares",
      "Show packaging — it signals brand quality",
      "Link product immediately in caption"
    ]
  },
  {
    format: "Taste / Reaction Test",
    conversionRate: 72,
    bestFor: ["food", "cpg", "supplements"],
    viralPotential: "very_high",
    avgViewDuration: "88% completion",
    description: "Genuine reaction to trying the product for the first time.",
    tips: [
      "Authenticity is everything — forced reactions backfire",
      "Show the product label clearly",
      "Pair with a use occasion (breakfast, post-workout, etc.)"
    ]
  },
  {
    format: "Routine Integration",
    conversionRate: 68,
    bestFor: ["skincare", "wellness", "supplements", "fitness", "personal_care", "beauty"],
    viralPotential: "medium",
    avgViewDuration: "74% completion",
    description: "Product shown as part of the creator's real daily routine. Normalizes the product.",
    tips: [
      "Show the product in context of a desirable lifestyle",
      "Mention frequency of use — consistency signals belief",
      "Aesthetic setup increases saves and shares"
    ]
  },
  {
    format: "Problem/Solution Story",
    conversionRate: 65,
    bestFor: ["skincare", "wellness", "supplements", "personal_care", "fitness"],
    viralPotential: "high",
    avgViewDuration: "76% completion",
    description: "Creator shares a personal problem and positions the product as the solution.",
    tips: [
      "Make the problem highly relatable and specific",
      "Be vulnerable — generic problems don't convert",
      "Resolution should feel earned, not instant"
    ]
  },
  {
    format: "Comparison / vs. Alternatives",
    conversionRate: 62,
    bestFor: ["beauty", "skincare", "supplements", "cpg", "personal_care"],
    viralPotential: "medium",
    avgViewDuration: "70% completion",
    description: "Product compared against alternatives. Frames value clearly and drives purchase decision.",
    tips: [
      "Be fair — biased comparisons lose trust",
      "Focus on specific differentiators, not vague claims",
      "Price comparison is the highest-converting angle"
    ]
  }
];

export const COMMISSION_GUIDANCE = {
  beauty: { standard: { min: 10, max: 20, sweet: 15 }, competitive: 18, topCreatorExpectation: 20, sampleExpectation: "1–3 full-size products", notes: "Beauty is the most competitive category. Anything below 12% will see low acceptance from quality creators." },
  skincare: { standard: { min: 10, max: 18, sweet: 13 }, competitive: 16, topCreatorExpectation: 18, sampleExpectation: "1–2 full-size products (full routine if possible)", notes: "Skincare creators want to test the product authentically — sending a full routine sample dramatically improves content quality." },
  wellness: { standard: { min: 12, max: 22, sweet: 16 }, competitive: 20, topCreatorExpectation: 22, sampleExpectation: "1-month supply minimum", notes: "Higher commission rates justified by longer purchase consideration cycle." },
  supplements: { standard: { min: 14, max: 25, sweet: 18 }, competitive: 22, topCreatorExpectation: 25, sampleExpectation: "60–90 day supply", notes: "Highest commission rates in e-commerce. Creators need sufficient supply to show transformation." },
  food: { standard: { min: 8, max: 15, sweet: 11 }, competitive: 14, topCreatorExpectation: 15, sampleExpectation: "Multiple units / variety pack", notes: "Lower margins mean lower commissions, but volume makes up the difference." },
  cpg: { standard: { min: 8, max: 14, sweet: 10 }, competitive: 13, topCreatorExpectation: 14, sampleExpectation: "Multiple units", notes: "Bundle promotions work well. Keep commission competitive to maintain volume." },
  apparel: { standard: { min: 10, max: 18, sweet: 13 }, competitive: 16, topCreatorExpectation: 18, sampleExpectation: "1–3 pieces in their size", notes: "Size and fit accuracy is critical. Verify creator size before sending." },
  fashion: { standard: { min: 10, max: 20, sweet: 14 }, competitive: 17, topCreatorExpectation: 20, sampleExpectation: "1–3 pieces", notes: "Styling creators with strong aesthetic POV command higher rates." },
  fitness: { standard: { min: 10, max: 20, sweet: 14 }, competitive: 18, topCreatorExpectation: 20, sampleExpectation: "Full product for extended testing", notes: "Fitness creators need to actually use the product to create credible content." },
  pet: { standard: { min: 8, max: 16, sweet: 12 }, competitive: 15, topCreatorExpectation: 16, sampleExpectation: "Multiple units for ongoing use", notes: "Pet creators are highly loyal once they trust a brand." },
  home: { standard: { min: 8, max: 15, sweet: 11 }, competitive: 14, topCreatorExpectation: 15, sampleExpectation: "Full product", notes: "Home creators need enough product to show real transformation content." },
  personal_care: { standard: { min: 10, max: 18, sweet: 13 }, competitive: 16, topCreatorExpectation: 18, sampleExpectation: "Full routine if possible", notes: "Authentic personal experience from creators outperforms scripted promotional content." }
};

export function getCategoryBenchmark(category) {
  const normalized = category.toLowerCase().replace(/[\s-]/g, "_").replace(/[^a-z_]/g, "");
  return CATEGORY_BENCHMARKS[normalized] || null;
}

export function getClosestCategory(input) {
  const normalized = input.toLowerCase();
  const keys = Object.keys(CATEGORY_BENCHMARKS);
  const match = keys.find(k => normalized.includes(k) || k.includes(normalized));
  return CATEGORY_BENCHMARKS[match || "beauty"];
}

export function getContentFormatsForCategory(category) {
  const normalized = category.toLowerCase().replace(/[\s-]/g, "_");
  return CONTENT_FORMATS
    .filter(f => f.bestFor.includes(normalized))
    .sort((a, b) => b.conversionRate - a.conversionRate);
}

export function getCommissionGuidance(category) {
  const normalized = category.toLowerCase().replace(/[\s-]/g, "_").replace(/[^a-z_]/g, "");
  return COMMISSION_GUIDANCE[normalized] || COMMISSION_GUIDANCE["beauty"];
}
