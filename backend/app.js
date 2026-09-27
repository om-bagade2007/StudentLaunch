const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

function lazyRouter(loader) {
  let router;
  return (req, res, next) => {
    try {
      router ||= loader();
      return router(req, res, next);
    } catch (err) {
      return next(err);
    }
  };
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/profile", lazyRouter(() => require("./routes/profile")));
app.use("/api/opportunities", lazyRouter(() => require("./routes/opportunities")));
app.use("/api/recommendations", lazyRouter(() => require("./routes/recommendations")));
app.use("/api/bookmarks", lazyRouter(() => require("./routes/bookmarks")));

module.exports = app;
