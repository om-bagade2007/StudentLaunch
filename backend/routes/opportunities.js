const express = require("express");
const { getDb } = require("../firebaseAdmin");

const router = express.Router();

function toOpportunity(doc) {
  return { id: doc.id, ...doc.data() };
}

router.get("/", async (req, res) => {
  try {
    const category = req.query.category ? String(req.query.category).trim().toLowerCase() : "";
    const skill = req.query.skill ? String(req.query.skill).trim().toLowerCase() : "";

    const snap = await getDb().collection("opportunities").get();
    let items = snap.docs.map(toOpportunity);

    if (category) {
      items = items.filter((item) => String(item.category || "").toLowerCase() === category);
    }
    if (skill) {
      items = items.filter((item) =>
        (item.skills || []).some((s) => String(s).toLowerCase() === skill)
      );
    }

    return res.json(items);
  } catch (err) {
    console.error("GET /api/opportunities", err);
    return res.status(500).json({ error: "Failed to load opportunities" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const snap = await getDb().collection("opportunities").doc(req.params.id).get();
    if (!snap.exists) {
      return res.status(404).json({ error: "Opportunity not found" });
    }
    return res.json(toOpportunity(snap));
  } catch (err) {
    console.error("GET /api/opportunities/:id", err);
    return res.status(500).json({ error: "Failed to load opportunity" });
  }
});

module.exports = router;
