const express = require("express");
const { getDb } = require("../firebaseAdmin");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

function normalizeList(value) {
  if (!Array.isArray(value)) return [];
  return value.map((item) => String(item).trim()).filter(Boolean);
}

router.post("/", requireAuth, async (req, res) => {
  try {
    const uid = req.user.uid;
    const payload = {
      education: req.body.education ? String(req.body.education).trim() : "",
      skills: normalizeList(req.body.skills),
      interests: normalizeList(req.body.interests),
      preferredCategories: normalizeList(req.body.preferredCategories),
      updatedAt: new Date().toISOString(),
    };

    await getDb().collection("profiles").doc(uid).set(payload, { merge: true });
    const snap = await getDb().collection("profiles").doc(uid).get();
    return res.json({ id: uid, ...snap.data() });
  } catch (err) {
    console.error("POST /api/profile", err);
    return res.status(500).json({ error: "Failed to save profile" });
  }
});

router.get("/", requireAuth, async (req, res) => {
  try {
    const uid = req.user.uid;
    const snap = await getDb().collection("profiles").doc(uid).get();
    if (!snap.exists) {
      return res.status(404).json({ error: "Profile not found" });
    }
    return res.json({ id: snap.id, ...snap.data() });
  } catch (err) {
    console.error("GET /api/profile", err);
    return res.status(500).json({ error: "Failed to load profile" });
  }
});

module.exports = router;
