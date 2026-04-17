# RoC MCP Server

Creator commerce intelligence for TikTok Shop brands — powered by [Return on Creators](https://returnoncreators.com).

Built on the [Model Context Protocol](https://modelcontextprotocol.io), this server gives AI assistants real benchmark data from 100+ TikTok Shop brands and $20M+ GMV processed.

## Tools

| Tool | Description |
|------|-------------|
| `roc_get_category_benchmarks` | Median + top-quartile GMV, AOV, creator activation rates, and top content formats by category |
| `roc_calculate_projected_roc` | Calculate projected Return on Creators multiple with vertical-specific coefficients |
| `roc_get_creator_profile` | Ideal creator tier, engagement benchmarks, match scoring rubric, and recruitment targets |
| `roc_get_content_formats` | Highest-converting TikTok content formats ranked by GMV contribution |
| `roc_get_commission_guidance` | Market-rate commission guidance with tiered structure and sample strategy |
| `roc_analyze_brand_fit` | Full brand fit analysis — fit score, blockers, expected GMV range |
| `roc_get_tiktok_shop_readiness` | Readiness score with prioritized action plan for TikTok Shop launch |
| `roc_get_amplifier_fit` | Creator program gap analysis — constraints, projections, weekly priority actions |

## Categories Supported

`beauty` · `cpg` · `fashion` · `wellness` · `home` · `supplements`

## Running the Server

### HTTP (default)
```bash
npm install
npm start
# Server runs at http://localhost:3000/mcp
```

### stdio
```bash
TRANSPORT=stdio npm start
```

### Custom port
```bash
PORT=8080 npm start
```

## Connecting to Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "roc": {
      "command": "node",
      "args": ["/absolute/path/to/roc-mcp-server/src/index.js"],
      "env": { "TRANSPORT": "stdio" }
    }
  }
}
```

## Connecting via HTTP

Use any MCP client that supports Streamable HTTP transport:

```
http://localhost:3000/mcp
```

## Response Envelope

Every tool response includes:

```json
{
  "result": { ... },
  "confidence": "high",
  "dataSource": "RoC platform data — 100+ brands, $20M+ GMV processed",
  "dataAsOf": "2026-Q1",
  "disclaimer": "Estimates based on RoC platform benchmarks. Actual results vary by brand, execution quality, and market conditions."
}
```

## Data Sources

Benchmarks sourced from:
- RoC platform data (100+ brands, $20M+ GMV)
- syncly.app TikTok Affiliate Playbook 2026
- 360om.agency commission benchmark analysis
- accio.com TikTok Shop US Top Categories 2025
- redstagfulfillment.com AOV data 2025
- marketingltb.com TikTok Shop Stats 2025

Data as of: **2026-Q1**

## License

MIT
