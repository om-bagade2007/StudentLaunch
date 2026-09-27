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
    const firstName = req.body.firstName ? String(req.body.firstName).trim() : "";
    const lastName = req.body.lastName ? String(req.body.lastName).trim() : "";
    const mobile = req.body.mobile ? String(req.body.mobile).trim() : "";
    const education = req.body.education ? String(req.body.education).trim() : "";
    const skills = normalizeList(req.body.skills);
    const interests = normalizeList(req.body.interests);
    const preferredCategories = normalizeList(req.body.preferredCategories);
    const payload = {
      firstName,
      lastName,
      mobile,
      education,
      skills,
      interests,
      preferredCategories,
      profileComplete: Boolean(
        firstName &&
          lastName &&
          mobile &&
          education &&
          skills.length &&
          interests.length &&
          preferredCategories.length
      ),
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
