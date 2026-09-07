import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import quoteHandler from "./api/quote.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes FIRST
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Gemini AI spreuk-van-de-dag route
  // Ondersteunt zowel GET als POST
  app.get("/api/quote", (req, res) => quoteHandler(req, res));
  app.post("/api/quote", (req, res) => quoteHandler(req, res));

  // Vite middleware voor development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server draait op http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Fout bij opstarten server:", err);
});
