require("dotenv").config();

const path = require("path");
const fs = require("fs");
const express = require("express");
const cors = require("cors");

const profileRouter = require("./routes/profile");
const opportunitiesRouter = require("./routes/opportunities");
const recommendationsRouter = require("./routes/recommendations");
const bookmarksRouter = require("./routes/bookmarks");

const app = express();
const PORT = process.env.PORT || 8080;
const publicDir = path.join(__dirname, "public");

const allowedOrigin = process.env.FRONTEND_ORIGIN || "http://localhost:5173";
app.use(
  cors({
    origin: [allowedOrigin, "http://localhost:5173", "http://127.0.0.1:5173"],
  })
);
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/profile", profileRouter);
app.use("/api/opportunities", opportunitiesRouter);
app.use("/api/recommendations", recommendationsRouter);
app.use("/api/bookmarks", bookmarksRouter);

app.use(express.static(publicDir));

app.use((req, res) => {
  if (req.path.startsWith("/api")) {
    return res.status(404).json({ error: "Not found" });
  }
  const indexPath = path.join(publicDir, "index.html");
  if (!fs.existsSync(indexPath)) {
    return res.status(404).send("Frontend not built");
  }
  return res.sendFile(indexPath);
});

app.listen(PORT, () => {
  console.log(`StudentLaunch listening on port ${PORT}`);
});
