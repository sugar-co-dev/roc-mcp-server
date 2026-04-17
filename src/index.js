import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import express from "express";
import { registerTools } from "./tools/index.js";

const server = new McpServer({
  name: "roc-mcp-server",
  version: "1.0.0"
});

registerTools(server);

// ─────────────────────────────────────────────────────────────
// TRANSPORT
// ─────────────────────────────────────────────────────────────
// (tools registered via registerTools above)

async function runStdio() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("RoC MCP Server running via stdio");
}

async function runHTTP() {
  const app = express();
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({ status: "ok", server: "roc-mcp-server", version: "1.0.0" });
  });

  app.get("/.well-known/oauth-authorization-server", (_req, res) => {
    res.status(404).json({ error: "not_supported" });
  });

  app.get("/.well-known/mcp-server", (_req, res) => {
    res.json({ mcp_server: true, auth_required: false });
  });

  app.post("/mcp", async (req, res) => {
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
      enableJsonResponse: true
    });
    res.on("close", () => transport.close());
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  });

  const port = parseInt(process.env.PORT || "3000");
  app.listen(port, () => {
    console.error(`RoC MCP Server running on http://localhost:${port}/mcp`);
  });
}

const transport = process.env.TRANSPORT || "http";
if (transport === "http") {
  runHTTP().catch(err => { console.error(err); process.exit(1); });
} else {
  runStdio().catch(err => { console.error(err); process.exit(1); });
}
