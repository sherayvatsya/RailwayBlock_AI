import express from "express";
import path from "path";
import fs from "fs";

async function startServer() {
  const app = express();
  const isProduction = process.env.NODE_ENV === "production" || !!process.env.PORT;
  const PORT = isProduction ? (Number(process.env.PORT) || 3000) : 3000;

  app.use(express.json());

  // API health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Vite middleware for development vs static asset serving in production
  if (!isProduction) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const candidateDist = path.join(process.cwd(), "dist");
    const distPath = fs.existsSync(path.join(candidateDist, "index.html"))
      ? candidateDist
      : path.resolve(__dirname, ".");

    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT} (mode: ${isProduction ? "production" : "development"})`);
  });

  process.on("SIGTERM", () => {
    server.close(() => {
      process.exit(0);
    });
  });
}

startServer();
