import { DATA_AS_OF, PLATFORM_STATS } from "../constants/benchmarks.js";

export function wrapResponse(result, confidence = "high") {
  return {
    result,
    confidence,
    dataSource: `RoC platform data — ${PLATFORM_STATS.brandsProcessed}+ brands, ${PLATFORM_STATS.gmvProcessed} GMV processed`,
    dataAsOf: DATA_AS_OF,
    disclaimer:
      "Estimates based on RoC platform benchmarks. Actual results vary by brand, execution quality, and market conditions.",
  };
}
