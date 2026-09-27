const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

function lazyRouter(path) {
  let router;
  return (req, res, next) => {
    try {
      router ||= require(path);
      return router(req, res, next);
    } catch (err) {
      return next(err);
    }
  };
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/profile", lazyRouter("./routes/profile"));
app.use("/api/opportunities", lazyRouter("./routes/opportunities"));
app.use("/api/recommendations", lazyRouter("./routes/recommendations"));
app.use("/api/bookmarks", lazyRouter("./routes/bookmarks"));

module.exports = app;
