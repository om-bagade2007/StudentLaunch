const express = require("express");
const { db } = require("../firebaseAdmin");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

function overlapCount(userValues, oppValues) {
  const userSet = new Set((userValues || []).map((v) => String(v).toLowerCase()));
  return (oppValues || []).filter((v) => userSet.has(String(v).toLowerCase())).length;
}

router.get("/", requireAuth, async (req, res) => {
  try {
    const uid = req.user.uid;
    const profileSnap = await db.collection("profiles").doc(uid).get();
    if (!profileSnap.exists) {
      return res.status(404).json({ error: "Profile not found" });
    }

    const profile = profileSnap.data();
    const oppSnap = await db.collection("opportunities").get();

    const ranked = oppSnap.docs
      .map((doc) => {
        const opportunity = { id: doc.id, ...doc.data() };
        const skillScore = overlapCount(profile.skills, opportunity.skills);
        const categoryScore = overlapCount(profile.preferredCategories, [
          opportunity.category,
          opportunity.type,
        ]);
        return {
          ...opportunity,
          score: skillScore + categoryScore,
        };
      })
      .sort((a, b) => b.score - a.score);

    return res.json(ranked);
  } catch (err) {
    console.error("GET /api/recommendations", err);
    return res.status(500).json({ error: "Failed to load recommendations" });
  }
});

module.exports = router;
