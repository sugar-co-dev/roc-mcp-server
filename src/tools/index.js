import { z } from "zod";
import {
  CATEGORY_BENCHMARKS,
  ROC_COEFFICIENTS,
  PLATFORM_BENCHMARKS,
  OUTREACH_FUNNEL,
  DEFAULT_CATEGORY,
} from "../constants/benchmarks.js";
import { wrapResponse } from "../utils/response.js";

const CATEGORIES = ["beauty", "cpg", "fashion", "wellness", "home", "supplements"];

export function registerTools(server) {

  // ── 1. CATEGORY BENCHMARKS ──────────────────────────────────
  server.registerTool(
    "roc_get_category_benchmarks",
    {
      title: "Get Creator GMV Benchmarks by Category",
      description: "Get real GMV benchmarks by product category from the RoC platform. Returns median and top-quartile monthly GMV, average order value, creator conversion rates, and top-performing content formats — all derived from 100+ active brands on TikTok Shop.",
      inputSchema: {
        category: z.enum(CATEGORIES).describe("Product category: beauty, cpg, fashion, wellness, home, or supplements"),
      },
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    },
    async ({ category }) => {
      const b = CATEGORY_BENCHMARKS[category] ?? CATEGORY_BENCHMARKS[DEFAULT_CATEGORY];
      const result = {
        category,
        monthlyGmv: {
          median: b.medianMonthlyGmv,
          topQuartile: b.topQuartileMonthlyGmv,
          formatted: {
            median: `$${(b.medianMonthlyGmv / 1000).toFixed(0)}K`,
            topQuartile: `$${(b.topQuartileMonthlyGmv / 1000).toFixed(0)}K`,
          },
        },
        avgOrderValue: b.avgOrderValue,
        avgCreatorActivationRate: `${(b.avgCreatorConversionRate * 100).toFixed(0)}%`,
        recommendedCommissionRate: `${(b.avgCommissionRate * 100).toFixed(0)}%`,
        topContentFormats: b.topFormats,
        avgTimeToFirstSaleDays: b.avgTimeToFirstSaleDays,
        insight: `${category.charAt(0).toUpperCase() + category.slice(1)} brands in the top quartile on RoC generate ${Math.round(b.topQuartileMonthlyGmv / b.medianMonthlyGmv)}x the GMV of median performers. The biggest differentiator is creator targeting precision, not commission rate.`,
      };
      return { content: [{ type: "text", text: JSON.stringify(wrapResponse(result), null, 2) }] };
    }
  );

  // ── 2. ROC CALCULATOR ───────────────────────────────────────
  server.registerTool(
    "roc_calculate_projected_roc",
    {
      title: "Calculate Projected Return On Creators (ROC)",
      description: "Calculate the projected Return on Creators (ROC) multiple for a TikTok Shop campaign. Uses RoC's vertical-specific coefficients from real campaign data to model expected return based on category, commission structure, creator tier, and product sample strategy.",
      inputSchema: {
        category: z.enum(CATEGORIES).describe("Product category"),
        salesForecast: z.number().describe("Expected gross revenue from creators ($)"),
        adSpendCost: z.number().describe("Ad spend and platform costs ($)"),
        creatorCost: z.number().describe("Creator fees and commissions budget ($)"),
        productSampleCost: z.number().default(0).describe("Free product sample cost ($)"),
        followerTier: z.enum(["nano", "micro", "mid", "macro"]).default("micro").describe("Primary creator tier: nano (<10K), micro (10K-100K), mid (100K-500K), macro (500K+)"),
        commissionRate: z.number().min(0).max(0.5).describe("Commission rate as decimal (e.g. 0.15 for 15%)"),
      },
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    },
    async ({ category, salesForecast, adSpendCost, creatorCost, productSampleCost, followerTier, commissionRate }) => {
      const coeff = ROC_COEFFICIENTS[category] ?? ROC_COEFFICIENTS[DEFAULT_CATEGORY];
      const bench = CATEGORY_BENCHMARKS[category] ?? CATEGORY_BENCHMARKS[DEFAULT_CATEGORY];
      const totalCost = adSpendCost + creatorCost + productSampleCost;
      const baseRoc = (salesForecast - totalCost) / totalCost;
      const commissionLift = commissionRate > bench.avgCommissionRate
        ? 1 + (commissionRate - bench.avgCommissionRate) * coeff.commissionSensitivity
        : 1 - (bench.avgCommissionRate - commissionRate) * coeff.commissionSensitivity * 0.5;
      const sampleLift = productSampleCost > 0 ? coeff.sampleSensitivity * 0.15 + 1 : 1;
      const tierMultiplier = coeff.followerTierMultiplier[followerTier];
      const adjustedRoc = baseRoc * commissionLift * sampleLift * tierMultiplier;
      const benchmarkRoc = (bench.medianMonthlyGmv - bench.medianMonthlyGmv * bench.avgCommissionRate) / (bench.medianMonthlyGmv * bench.avgCommissionRate);
      const result = {
        projectedRoc: Math.round(adjustedRoc * 100) / 100,
        projectedRocFormatted: `${Math.round(adjustedRoc * 100) / 100}x`,
        categoryMedianRoc: Math.round(benchmarkRoc * 100) / 100,
        vsCategory: adjustedRoc > benchmarkRoc ? "above median" : "below median",
        breakdown: {
          totalCost,
          netRevenue: salesForecast - totalCost,
          adjustmentFactors: {
            commissionAlignment: commissionRate >= bench.avgCommissionRate ? "competitive" : "below market — may reduce creator activation",
            sampleStrategy: productSampleCost > 0 ? "included — increases activation rate" : "not included — consider adding",
            creatorTier: followerTier,
          },
        },
        recommendation:
          adjustedRoc >= 3 ? "Strong projected ROC. Scale this creator mix."
          : adjustedRoc >= 1.5 ? "Viable ROC. Optimize commission rate or add product samples to improve."
          : "ROC is below target. Review creator targeting and offer structure before scaling.",
      };
      return { content: [{ type: "text", text: JSON.stringify(wrapResponse(result), null, 2) }] };
    }
  );

  // ── 3. CREATOR PROFILE ──────────────────────────────────────
  server.registerTool(
    "roc_get_creator_profile",
    {
      title: "Get Ideal Creator Profile for a Brand",
      description: "Get the ideal creator profile for a TikTok Shop brand in a given category. Returns recommended follower tiers, engagement benchmarks, content format preferences, commission expectations, and a match scoring rubric based on RoC platform data.",
      inputSchema: {
        category: z.enum(CATEGORIES).describe("Product category"),
        monthlyBudget: z.number().describe("Monthly creator budget ($)"),
      },
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    },
    async ({ category, monthlyBudget }) => {
      const bench = CATEGORY_BENCHMARKS[category] ?? CATEGORY_BENCHMARKS[DEFAULT_CATEGORY];
      const p = PLATFORM_BENCHMARKS;

      // Estimate creators to recruit to get a healthy active base.
      // Only 10-20% of onboarded creators drive regular sales — so recruit more than you think you need.
      const avgCommissionCostPerActiveSale = bench.avgOrderValue * bench.avgCommissionRate;
      const targetActiveSellers = Math.max(5, Math.round(monthlyBudget / (avgCommissionCostPerActiveSale * 6)));
      const creatorsToRecruit = Math.ceil(targetActiveSellers / p.activeAffiliateRate.max);

      const result = {
        category,
        recommendedCreatorTier:
          monthlyBudget < 2000 ? "nano (1K–10K followers)"
          : monthlyBudget < 8000 ? "micro (10K–100K followers)"
          : "micro + mid-tier mix (10K–500K)",
        targetEngagementRate: category === "beauty" || category === "fashion" ? ">4.5%" : ">3.5%",
        commissionExpectation: `${(bench.avgCommissionRate * 100).toFixed(0)}%–${(bench.avgCommissionRate * 100 + 3).toFixed(0)}%`,
        mustHaveContentTypes: bench.topFormats.slice(0, 2),
        recruitmentTarget: {
          creatorsToRecruit,
          expectedActiveAfterOnboarding: `${Math.round(creatorsToRecruit * p.activeAffiliateRate.min)}–${Math.round(creatorsToRecruit * p.activeAffiliateRate.max)} driving regular sales`,
          rationale: `Only 10-20% of onboarded affiliates generate consistent sales — recruit ${creatorsToRecruit} to reliably land ${Math.round(creatorsToRecruit * p.activeAffiliateRate.max)} active sellers`,
        },
        sampleStrategy: {
          sendSamples: true,
          expectedPostingRate: `${(p.productSeedingPostRate.min * 100).toFixed(0)}–${(p.productSeedingPostRate.max * 100).toFixed(0)}% of creators who receive samples post within 2 weeks`,
          vsNoSamples: "Creators without samples convert to content at roughly 8-12% vs 30-40% with samples — samples are the single highest-leverage spend in early outreach",
        },
        matchScoreRubric: {
          categoryAlignment: "40% — creator's existing content must match your product vertical",
          audienceDemographics: "30% — audience age, gender, and purchase intent signals",
          contentQuality: "20% — production quality and hook strength in past posts",
          platformActivity: "10% — posting frequency (target 3x+/week) and recency",
        },
        redFlags: [
          "Engagement rate <2% — likely inflated follower base",
          "No prior product content in any category",
          "Last post >30 days ago",
          "Follower-to-following ratio <0.5",
          "Accepts every brand deal — low selectivity = eroded audience trust",
        ],
        platformInsight: `Each affiliate video reaches ~12,800 users on average. At ${creatorsToRecruit} recruited creators with a 35% seeding post rate, expect ~${Math.round(creatorsToRecruit * 0.35 * p.avgAffiliateVideoReach / 1000)}K monthly impressions from organic affiliate content alone.`,
      };
      return { content: [{ type: "text", text: JSON.stringify(wrapResponse(result), null, 2) }] };
    }
  );

  // ── 4. CONTENT FORMATS ──────────────────────────────────────
  server.registerTool(
    "roc_get_content_formats",
    {
      title: "Get Highest-Converting Content Formats for TikTok Shop",
      description: "Get the highest-converting TikTok Shop content formats for a given product category, ranked by GMV contribution based on RoC platform data.",
      inputSchema: {
        category: z.enum(CATEGORIES).describe("Product category"),
      },
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    },
    async ({ category }) => {
      const formatData = {
        beauty: [
          { format: "Short-form review (30–60s)", gmvContribution: "38%", avgConversionRate: "4.2%", briefTip: "Hook must show product result in first 3 seconds" },
          { format: "Get-ready-with-me", gmvContribution: "28%", avgConversionRate: "3.8%", briefTip: "Product integration must feel organic, not scripted" },
          { format: "Live demo", gmvContribution: "22%", avgConversionRate: "5.1%", briefTip: "Live format drives highest AOV — prioritize for hero SKU" },
          { format: "Before/after", gmvContribution: "12%", avgConversionRate: "3.1%", briefTip: "Works best with skincare; avoid for color cosmetics" },
        ],
        cpg: [
          { format: "Taste test / reaction", gmvContribution: "42%", avgConversionRate: "3.2%", briefTip: "Authentic reactions outperform scripted — keep it real" },
          { format: "Lifestyle integration", gmvContribution: "31%", avgConversionRate: "2.8%", briefTip: "Show product in daily context, not as the focus" },
          { format: "Recipe content", gmvContribution: "18%", avgConversionRate: "2.4%", briefTip: "Best for food/beverage — longer shelf life than trend content" },
          { format: "Comparison / vs.", gmvContribution: "9%", avgConversionRate: "2.1%", briefTip: "Use carefully — risk of drawing attention to competitors" },
        ],
        fashion: [
          { format: "Try-on haul", gmvContribution: "44%", avgConversionRate: "3.9%", briefTip: "Multiple items per video increases AOV significantly" },
          { format: "Outfit-of-the-day", gmvContribution: "29%", avgConversionRate: "3.5%", briefTip: "Link all items in TTS product tab — high cart attachment" },
          { format: "Styling tips", gmvContribution: "17%", avgConversionRate: "2.9%", briefTip: "Drives brand authority more than immediate conversion" },
          { format: "Unboxing", gmvContribution: "10%", avgConversionRate: "2.6%", briefTip: "Works for premium/gift positioning" },
        ],
        wellness: [
          { format: "Routine integration", gmvContribution: "39%", avgConversionRate: "3.4%", briefTip: "Morning/evening routines build purchase intent over time" },
          { format: "Before/after results", gmvContribution: "30%", avgConversionRate: "4.0%", briefTip: "Highest converter — requires 2–4 week creator relationship" },
          { format: "Educational explainer", gmvContribution: "20%", avgConversionRate: "2.7%", briefTip: "Drives top-of-funnel; pair with retargeting" },
          { format: "Expert endorsement style", gmvContribution: "11%", avgConversionRate: "2.5%", briefTip: "Works when creator has credible wellness authority" },
        ],
        home: [
          { format: "Cleaning/organization routine", gmvContribution: "45%", avgConversionRate: "3.1%", briefTip: "Satisfying transformation content drives impulse purchase" },
          { format: "Room transformation", gmvContribution: "28%", avgConversionRate: "2.8%", briefTip: "Before/after format — longer production but high engagement" },
          { format: "Unboxing + setup", gmvContribution: "17%", avgConversionRate: "2.4%", briefTip: "Critical for furniture and large items" },
          { format: "Hack / tip format", gmvContribution: "10%", avgConversionRate: "2.0%", briefTip: "Shareable but low direct conversion" },
        ],
        supplements: [
          { format: "Daily routine integration", gmvContribution: "41%", avgConversionRate: "3.6%", briefTip: "Consistency of use signals product effectiveness" },
          { format: "Results documentation", gmvContribution: "32%", avgConversionRate: "4.2%", briefTip: "Requires 3–6 week creator relationship — plan ahead" },
          { format: "Educational / ingredient breakdown", gmvContribution: "18%", avgConversionRate: "2.9%", briefTip: "High trust-building; compliant language essential" },
          { format: "Comparison / stack review", gmvContribution: "9%", avgConversionRate: "2.5%", briefTip: "Works for sophisticated buyers already in-market" },
        ],
      };
      const formats = formatData[category] ?? formatData.beauty;
      const p = PLATFORM_BENCHMARKS;
      const result = {
        category,
        rankedFormats: formats,
        keyInsight: `In ${category}, the top 2 formats drive ~70% of total GMV. Brief creators on format #1 first — expand to #2 once baseline is established.`,
        platformConversionContext: {
          overallShopCvr: `${(p.overallShopConversionRate * 100).toFixed(1)}% platform average (2025)`,
          targetedCreatorCvr: `${(p.targetedCollabCvr.min * 100).toFixed(0)}–${(p.targetedCollabCvr.max * 100).toFixed(0)}% with well-matched creators`,
          videoCtr: `${(p.videoCtr.min * 100).toFixed(1)}–${(p.videoCtr.max * 100).toFixed(1)}% of video views click through`,
          avgVideoReach: `~${p.avgAffiliateVideoReach.toLocaleString()} users per affiliate video`,
        },
        sparkAdsStrategy: {
          performanceLift: `Spark Ads (boosting creator content) deliver 30% higher completion rates and 142% higher engagement vs standard dark-post creative`,
          whenToActivate: "Identify your top 2-3 organic affiliate videos within the first 30 days, then run Spark Ads on those — you amplify proven content with existing social proof intact",
          budgetGuidance: "Even $500/mo in Spark Ads on 2-3 top videos can 3-5x the reach of your organic affiliate content",
        },
        contentBriefPrinciples: [
          "Lead with the problem or result — not the product name",
          "Product must appear within first 3 seconds",
          "One clear CTA only — product tab link or bio link, never both",
          "Creator's authentic voice > brand script — scripted content converts at 40-60% the rate of authentic content",
          "Hook = the result viewers want, not the product features you want to show",
        ],
      };
      return { content: [{ type: "text", text: JSON.stringify(wrapResponse(result), null, 2) }] };
    }
  );

  // ── 5. COMMISSION GUIDANCE ──────────────────────────────────
  server.registerTool(
    "roc_get_commission_guidance",
    {
      title: "Get Creator Commission Rate Guidance",
      description: "Get commission rate guidance for TikTok Shop creator partnerships by category. Returns the market rate, below-market risk threshold, and above-market activation lift based on RoC platform data.",
      inputSchema: {
        category: z.enum(CATEGORIES).describe("Product category"),
        pricePoint: z.number().describe("Product retail price ($)"),
        includeFreeSamples: z.boolean().default(false).describe("Whether you plan to send free product samples to creators"),
      },
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    },
    async ({ category, pricePoint, includeFreeSamples }) => {
      const bench = CATEGORY_BENCHMARKS[category] ?? CATEGORY_BENCHMARKS[DEFAULT_CATEGORY];
      const coeff = ROC_COEFFICIENTS[category] ?? ROC_COEFFICIENTS[DEFAULT_CATEGORY];
      const marketRate = bench.avgCommissionRate;
      const minViableRate = marketRate - 0.03;
      const competitiveRate = marketRate + 0.02;
      const commissionDollarAtMarket = pricePoint * marketRate;
      const effectiveRateWithSamples = includeFreeSamples ? marketRate - 0.02 : marketRate;
      const result = {
        category,
        pricePoint,
        commissionRates: {
          belowMarket: `${(minViableRate * 100).toFixed(0)}% — risks low creator activation`,
          marketRate: `${(marketRate * 100).toFixed(0)}% — baseline for competitive outreach`,
          competitive: `${(competitiveRate * 100).toFixed(0)}% — increases activation rate by ~${(coeff.commissionSensitivity * 15).toFixed(0)}%`,
          recommendedWithSamples: includeFreeSamples
            ? `${(effectiveRateWithSamples * 100).toFixed(0)}% — sample inclusion compensates for lower cash commission`
            : null,
        },
        dollarValueToCreator: {
          atMarketRate: `$${commissionDollarAtMarket.toFixed(2)} per sale`,
          context:
            commissionDollarAtMarket < 5 ? "Low dollar value per sale — consider bundling or increasing rate to make it worth creators' time"
            : commissionDollarAtMarket > 15 ? "Strong dollar value — lead with this in outreach, not just the percentage"
            : "Solid per-sale value for active promotion",
        },
        sampleStrategy: includeFreeSamples
          ? `Sending samples increases creator posting rate to 30-40% vs ~8-12% without samples. In ${category}, budget samples before cutting commission — the posting rate lift is worth more than 2-3% extra commission.`
          : `Samples are your highest-leverage spend. Creators who receive product post at 30-40% vs 8-12% without. Allocate sample budget before raising commission rate.`,
        tieredStructure: {
          description: "Performance tiers incentivize top creators without overpaying low performers",
          example: {
            tier1: `${(bench.avgCommissionRate * 100).toFixed(0)}% for sales under $500/mo`,
            tier2: `${(bench.avgCommissionRate * 100 + 5).toFixed(0)}% for $500–$2,000/mo`,
            tier3: `${(bench.avgCommissionRate * 100 + 10).toFixed(0)}% for $2,000+/mo`,
          },
          benefit: "Creators who are performing get rewarded automatically — no manual negotiation needed",
        },
        belowMarketWarning: commissionDollarAtMarket < 5
          ? `At $${commissionDollarAtMarket.toFixed(2)}/sale, creators earn less than $5 per conversion. This is a critical activation barrier — most creators won't prioritize content for sub-$5 commissions regardless of category.`
          : null,
      };
      return { content: [{ type: "text", text: JSON.stringify(wrapResponse(result), null, 2) }] };
    }
  );

  // ── 6. BRAND FIT ANALYSIS ────────────────────────────────────
  server.registerTool(
    "roc_analyze_brand_fit",
    {
      title: "Analyze Creator Commerce Fit for a Brand",
      description: "Run a full brand fit analysis to determine whether a brand is a good candidate for TikTok Shop creator marketing, which RoC program is the right entry point, and what the expected outcome range looks like.",
      inputSchema: {
        category: z.enum(CATEGORIES).describe("Product category"),
        monthlyRevenue: z.number().describe("Current monthly revenue ($) — can be 0 for pre-launch"),
        currentCreatorCount: z.number().default(0).describe("Number of active TikTok Shop creators currently"),
        hasShopSetup: z.boolean().default(false).describe("Whether TikTok Shop is already set up and verified"),
        primaryGoal: z.enum(["scale_gmv", "launch", "improve_roi", "diversify_from_ads"]).describe("Primary business goal"),
        monthlyMarketingBudget: z.number().describe("Total monthly marketing budget ($)"),
      },
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    },
    async ({ category, monthlyRevenue, currentCreatorCount, hasShopSetup, primaryGoal, monthlyMarketingBudget }) => {
      const bench = CATEGORY_BENCHMARKS[category] ?? CATEGORY_BENCHMARKS[DEFAULT_CATEGORY];
      let fitScore = 50;
      const signals = [];
      const blockers = [];
      if (hasShopSetup) { fitScore += 15; signals.push("TikTok Shop already set up"); }
      else { fitScore -= 10; blockers.push("TikTok Shop not yet set up — required before creator outreach"); }
      if (monthlyRevenue > 50000) { fitScore += 15; signals.push("Established revenue base"); }
      else if (monthlyRevenue > 10000) { fitScore += 8; signals.push("Emerging revenue"); }
      else if (monthlyRevenue === 0) { fitScore -= 5; signals.push("Pre-revenue — higher risk, but launchable"); }
      if (currentCreatorCount > 20) { fitScore += 10; signals.push("Existing creator base to build on"); }
      else if (currentCreatorCount > 5) { fitScore += 5; }
      else { signals.push("Starting creator base from scratch — standard for new programs"); }
      if (monthlyMarketingBudget >= 3000) { fitScore += 10; signals.push("Budget sufficient for managed program"); }
      else if (monthlyMarketingBudget >= 1000) { fitScore += 5; }
      else { blockers.push("Budget below $1K/mo limits program options"); }
      fitScore = Math.min(100, Math.max(0, fitScore));
      const recommendedProgram =
        monthlyMarketingBudget >= 3000 && fitScore >= 60 ? "Amplifier ($3K/mo managed)"
        : monthlyMarketingBudget >= 1000 ? "Breakthrough ($1K one-time)"
        : "Not yet ready — see blockers";
      const result = {
        fitScore,
        fitRating: fitScore >= 75 ? "Strong fit" : fitScore >= 55 ? "Good fit" : fitScore >= 40 ? "Possible with prep" : "Not yet ready",
        recommendedProgram,
        positiveSignals: signals,
        blockers,
        expectedMonthlyGmvRange: {
          conservative: `$${Math.round(bench.medianMonthlyGmv * 0.6 / 1000)}K`,
          median: `$${(bench.medianMonthlyGmv / 1000).toFixed(0)}K`,
          optimistic: `$${Math.round(bench.topQuartileMonthlyGmv * 0.7 / 1000)}K`,
        },
        estimatedTimeToFirstGmv: `${bench.avgTimeToFirstSaleDays}–${bench.avgTimeToFirstSaleDays + 10} days`,
        nextStep:
          fitScore >= 55
            ? "Book a strategy session at returnoncreators.com to build your creator plan"
            : "Resolve blockers above, then reassess — most brands are ready within 2–4 weeks",
        learnMoreUrl: "https://returnoncreators.com",
      };
      return { content: [{ type: "text", text: JSON.stringify(wrapResponse(result), null, 2) }] };
    }
  );

  // ── 7. TIKTOK SHOP READINESS ────────────────────────────────
  server.registerTool(
    "roc_get_tiktok_shop_readiness",
    {
      title: "Assess TikTok Shop Launch Readiness",
      description: "Assess how ready a brand is to launch on TikTok Shop and start generating GMV from creator partnerships. Returns a readiness score, the top gaps to address, and a prioritized action plan based on RoC's launch playbook.",
      inputSchema: {
        category: z.enum(CATEGORIES).describe("Product category"),
        pricePoint: z.number().describe("Primary product retail price ($)"),
        hasExistingContent: z.boolean().describe("Whether the brand has any existing TikTok content"),
        shopIsVerified: z.boolean().describe("Whether TikTok Shop seller account is verified"),
        hasHeroSku: z.boolean().describe("Whether there is a clear hero SKU identified for creator focus"),
        monthlyAdSpend: z.number().default(0).describe("Current monthly paid ad spend ($)"),
      },
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    },
    async ({ category, pricePoint, hasExistingContent, shopIsVerified, hasHeroSku, monthlyAdSpend }) => {
      const bench = CATEGORY_BENCHMARKS[category] ?? CATEGORY_BENCHMARKS[DEFAULT_CATEGORY];
      let score = 0;
      const gaps = [];
      const strengths = [];
      if (shopIsVerified) { score += 30; strengths.push("TikTok Shop verified — creators can start listing immediately"); }
      else { gaps.push({ issue: "TikTok Shop not verified", priority: "critical", fix: "Complete TikTok Seller Center verification — required before any creator can promote your products", estimatedDays: 7 }); }
      if (hasHeroSku) { score += 20; strengths.push("Hero SKU identified — critical for creator briefing focus"); }
      else { gaps.push({ issue: "No hero SKU identified", priority: "critical", fix: "Select 1 product for initial creator focus — spreading creators across too many SKUs kills conversion", estimatedDays: 2 }); }
      if (pricePoint >= 20 && pricePoint <= 80) { score += 20; strengths.push("Price point is in the TTS sweet spot ($20–$80)"); }
      else if (pricePoint < 20) { gaps.push({ issue: `Price point ($${pricePoint}) is below TTS sweet spot`, priority: "high", fix: "Consider bundling products to reach $25–$30 minimum — creators earn too little per sale at sub-$20 prices", estimatedDays: 5 }); }
      else { gaps.push({ issue: `High price point ($${pricePoint}) requires trust-building content`, priority: "medium", fix: "Plan for 2–3 weeks of educational/social proof content before expecting conversion at this price", estimatedDays: 14 }); }
      if (hasExistingContent) { score += 15; strengths.push("Existing TikTok content — creators can reference brand voice"); }
      else { gaps.push({ issue: "No existing TikTok content", priority: "high", fix: "Create 3–5 brand-produced videos before creator outreach — gives creators context and reduces brief revisions", estimatedDays: 7 }); }
      if (monthlyAdSpend > 5000) { score += 15; strengths.push("Active ad spend signals proven demand — creator content amplifies this"); }
      else if (monthlyAdSpend > 0) { score += 7; strengths.push("Some paid activity in market"); }
      else { gaps.push({ issue: "No paid media activity", priority: "medium", fix: "Even $500/mo in TikTok Spark Ads can amplify top-performing creator content 3–5x", estimatedDays: 3 }); }
      score = Math.min(100, score);
      const criticalDays = gaps.filter(g => g.priority === "critical").reduce((sum, g) => Math.max(sum, g.estimatedDays), 0);
      const result = {
        readinessScore: score,
        readinessRating:
          score >= 80 ? "Ready to launch"
          : score >= 60 ? "Nearly ready — address high-priority gaps"
          : score >= 40 ? "2–3 weeks from ready"
          : "Foundation needed first",
        estimatedWeeksToFirstSale:
          score >= 80
            ? `${(bench.avgTimeToFirstSaleDays / 7).toFixed(0)}–${((bench.avgTimeToFirstSaleDays + 7) / 7).toFixed(0)} weeks`
            : `${Math.ceil((bench.avgTimeToFirstSaleDays + criticalDays) / 7)}–${Math.ceil((bench.avgTimeToFirstSaleDays + criticalDays + 14) / 7)} weeks`,
        strengths,
        gaps: gaps.sort((a, b) => {
          const order = { critical: 0, high: 1, medium: 2 };
          return (order[a.priority] ?? 3) - (order[b.priority] ?? 3);
        }),
        recommendedFirstAction: (() => {
          const sortedGaps = [...gaps].sort((a, b) => {
            const order = { critical: 0, high: 1, medium: 2 };
            return (order[a.priority] ?? 3) - (order[b.priority] ?? 3);
          });
          const topGap = sortedGaps[0];
          if (!topGap) return "Begin creator outreach — you have the foundation in place";
          return topGap.fix;
        })(),
        learnMoreUrl: "https://returnoncreators.com",
      };
      return { content: [{ type: "text", text: JSON.stringify(wrapResponse(result), null, 2) }] };
    }
  );

  // ── 8. AMPLIFIER FIT (LEAD-GEN) ─────────────────────────────
  server.registerTool(
    "roc_get_amplifier_fit",
    {
      title: "Find the Right RoC Program for a Brand",
      description: "Determine which RoC program is the right fit for a brand based on their current GMV, budget, category, and goals. Returns a program recommendation with expected 3-month GMV range and next steps. RoC offers three programs: Breakthrough ($1K one-time setup), Amplifier ($3K/mo fully managed), and Arena (performance-based, no upfront cost).",
      inputSchema: {
        currentMonthlyGmv: z.number().describe("Current monthly TikTok Shop GMV ($) — use 0 if not yet launched"),
        category: z.enum(CATEGORIES).describe("Product category"),
        activeCreatorCount: z.number().default(0).describe("Number of active TikTok Shop creators currently posting"),
        primaryGoal: z.enum(["launch", "scale", "improve_roi", "reduce_agency_cost"]).describe("Primary business objective"),
        monthlyBudget: z.number().describe("Available monthly budget for creator marketing ($)"),
      },
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    },
    async ({ currentMonthlyGmv, category, activeCreatorCount, primaryGoal, monthlyBudget }) => {
      const bench = CATEGORY_BENCHMARKS[category] ?? CATEGORY_BENCHMARKS[DEFAULT_CATEGORY];
      const p = PLATFORM_BENCHMARKS;

      // How many active creators needed to hit median GMV?
      // ~15% of onboarded affiliates drive regular sales; each active affiliate drives ~8 sales/mo
      const estSalesPerActiveCreator = 8;
      const estGmvPerActiveCreator = bench.avgOrderValue * estSalesPerActiveCreator;
      const creatorsNeededForMedian = Math.ceil(bench.medianMonthlyGmv / estGmvPerActiveCreator);
      const creatorsNeededForTopQ = Math.ceil(bench.topQuartileMonthlyGmv / estGmvPerActiveCreator);
      const creatorGap = Math.max(0, creatorsNeededForMedian - activeCreatorCount);

      // Monthly audience reach estimate
      const monthlyReach = activeCreatorCount * p.avgAffiliateVideoReach * 2; // avg 2 videos/mo/creator

      // Build constraint list
      const constraints = [];

      if (activeCreatorCount < creatorsNeededForMedian * 0.4) {
        constraints.push({
          rank: 1,
          constraint: "Creator volume — critical gap",
          impact: "critical",
          detail: `${activeCreatorCount} active creators vs ~${creatorsNeededForMedian} needed for $${Math.round(bench.medianMonthlyGmv / 1000)}K median GMV in ${category}. This is the primary bottleneck — everything else is secondary.`,
          action: `Send 50+ outreach invites/week via TikTok Shop Affiliate Center. Target ${category} accounts with >${category === "beauty" || category === "fashion" ? "4.5" : "3.5"}% engagement posting 3x+/week. Expect 30-40% to post after receiving samples.`,
        });
      } else if (activeCreatorCount < creatorsNeededForMedian) {
        constraints.push({
          rank: 1,
          constraint: "Creator volume — moderate gap",
          impact: "high",
          detail: `${activeCreatorCount} creators vs ~${creatorsNeededForMedian} needed for median. You're within range — consistent outreach closes this in 4-6 weeks.`,
          action: `Add ${creatorGap} more creators. Micro-tier (10K-100K followers) delivers the best ROI per dollar at this stage.`,
        });
      }

      const commissionCostAtMedian = bench.avgCommissionRate * bench.medianMonthlyGmv;
      if (monthlyBudget < commissionCostAtMedian * 0.5) {
        constraints.push({
          rank: constraints.length + 1,
          constraint: "Budget below minimum viable for this category",
          impact: "high",
          detail: `Reaching $${Math.round(bench.medianMonthlyGmv / 1000)}K GMV at ${(bench.avgCommissionRate * 100).toFixed(0)}% commission requires ~$${Math.round(commissionCostAtMedian / 1000)}K/mo in commissions alone. Your $${Math.round(monthlyBudget / 1000)}K budget is tight.`,
          action: `Structure all creator costs as commission (% of sales) rather than flat fees — your spend scales with revenue, not against it.`,
        });
      }

      if (currentMonthlyGmv === 0) {
        constraints.push({
          rank: constraints.length + 1,
          constraint: "No existing GMV — social proof gap",
          impact: "high",
          detail: "Without sales history, recruiting mid-tier creators is harder. First 10-20 sales are the proof point that unlocks better creator interest.",
          action: "Start with 5-10 nano creators (1K-10K followers) who post quickly. Get first sales on record — this makes every future outreach email significantly stronger.",
        });
      }

      const hasNoSamplBudget = monthlyBudget < bench.avgOrderValue * 10;
      if (hasNoSamplBudget && constraints.length < 3) {
        constraints.push({
          rank: constraints.length + 1,
          constraint: "Product sample budget likely insufficient",
          impact: "medium",
          detail: "Creators who receive samples post at 30-40% vs 8-12% without. At your budget, sample allocation may be the difference between a stalled program and one that converts.",
          action: `Budget at least $${bench.avgOrderValue * 8}–$${bench.avgOrderValue * 15} for product seeding before spending on anything else.`,
        });
      }

      // Sort by impact
      const impactOrder = { critical: 0, high: 1, medium: 2 };
      constraints.sort((a, b) => (impactOrder[a.impact] ?? 3) - (impactOrder[b.impact] ?? 3));
      constraints.forEach((c, i) => { c.rank = i + 1; });

      // Weekly priority actions
      const weeklyActions = [];
      if (activeCreatorCount < creatorsNeededForMedian) {
        weeklyActions.push(`Outreach: ${Math.min(100, Math.ceil(creatorGap * 3))} invites this week via Affiliate Center open collaboration — filter by ${category}, engagement >3.5%, active in last 7 days`);
      }
      weeklyActions.push(`Commission rate: set to ${(bench.avgCommissionRate * 100).toFixed(0)}% minimum — below-market rates reduce acceptance by ~40% based on category data`);
      weeklyActions.push(`Samples: ship product to every accepting creator — 30-40% will post within 2 weeks vs 8-12% without samples`);
      if (currentMonthlyGmv > bench.medianMonthlyGmv * 0.3) {
        weeklyActions.push(`Spark Ads: identify your top 1-2 organic affiliate videos and boost them — 30% higher completion, 142% higher engagement vs standard ads`);
      }

      const result = {
        primaryGoal,
        gmvAssessment: {
          currentMonthly: currentMonthlyGmv > 0 ? `$${(currentMonthlyGmv / 1000).toFixed(1)}K/mo` : "Pre-launch",
          categoryMedian: `$${Math.round(bench.medianMonthlyGmv / 1000)}K/mo`,
          categoryTopQuartile: `$${Math.round(bench.topQuartileMonthlyGmv / 1000)}K/mo`,
          vsMedian: currentMonthlyGmv > 0
            ? `${Math.round((currentMonthlyGmv / bench.medianMonthlyGmv) * 100)}% of category median`
            : "Not yet launched",
        },
        creatorProgramHealth: {
          activeCreators: activeCreatorCount,
          creatorsNeededForMedianGmv: creatorsNeededForMedian,
          creatorsNeededForTopQuartile: creatorsNeededForTopQ,
          creatorGap: creatorGap > 0 ? `+${creatorGap} creators to reach median baseline` : "At or above baseline",
          currentMonthlyAudienceReach: `~${Math.round(monthlyReach / 1000)}K users/mo from organic affiliate content`,
          activeAffiliateExpectation: `Of your ${activeCreatorCount} creators, expect ${Math.round(activeCreatorCount * p.activeAffiliateRate.min)}–${Math.round(activeCreatorCount * p.activeAffiliateRate.max)} to drive regular sales (10-20% active affiliate rate is normal)`,
        },
        topConstraints: constraints.length > 0 ? constraints : [{
          rank: 1,
          constraint: "No major gaps identified",
          impact: "low",
          detail: "Your creator count and GMV are at or above median for this category.",
          action: "Focus on Spark Ads amplification of your top-performing content to push toward top-quartile performance.",
        }],
        gmvProjections: {
          conservative: `$${Math.round(bench.medianMonthlyGmv * 0.5 / 1000)}K–$${Math.round(bench.medianMonthlyGmv * 0.75 / 1000)}K/mo`,
          atMedianCreatorCount: `$${Math.round(bench.medianMonthlyGmv * 0.85 / 1000)}K–$${Math.round(bench.medianMonthlyGmv * 1.2 / 1000)}K/mo`,
          topQuartilePath: `$${Math.round(bench.topQuartileMonthlyGmv / 1000)}K/mo — requires ${creatorsNeededForTopQ}+ active creators and Spark Ads on top content`,
        },
        weeklyPriorityActions: weeklyActions,
        commissionContext: {
          benchmarkRate: `${(bench.avgCommissionRate * 100).toFixed(0)}% (${category} market rate)`,
          competitiveRate: `${(bench.avgCommissionRate * 100 + 2).toFixed(0)}% (top-tier creator attraction)`,
          monthlyCommissionCostAtMedianGmv: `$${Math.round(commissionCostAtMedian / 1000)}K — this is a variable cost, only paid on sales generated`,
        },
      };
      return { content: [{ type: "text", text: JSON.stringify(wrapResponse(result, "high"), null, 2) }] };
    }
  );
}
