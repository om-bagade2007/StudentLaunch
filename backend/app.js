const express = require("express");
const cors = require("cors");
const profileRoutes = require("./routes/profile");
const opportunitiesRoutes = require("./routes/opportunities");
const recommendationsRoutes = require("./routes/recommendations");
const bookmarksRoutes = require("./routes/bookmarks");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/profile", profileRoutes);
app.use("/api/opportunities", opportunitiesRoutes);
app.use("/api/recommendations", recommendationsRoutes);
app.use("/api/bookmarks", bookmarksRoutes);

module.exports = app;
