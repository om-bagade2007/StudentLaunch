const express = require("express");
const { getDb } = require("../firebaseAdmin");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

router.post("/", requireAuth, async (req, res) => {
  try {
    const uid = req.user.uid;
    const opportunityId = req.body.opportunityId ? String(req.body.opportunityId).trim() : "";
    if (!opportunityId) {
      return res.status(400).json({ error: "opportunityId is required" });
    }

    const oppSnap = await getDb().collection("opportunities").doc(opportunityId).get();
    if (!oppSnap.exists) {
      return res.status(404).json({ error: "Opportunity not found" });
    }

    const docId = `${uid}_${opportunityId}`;
    const payload = {
      uid,
      opportunityId,
      createdAt: new Date().toISOString(),
    };
    await getDb().collection("bookmarks").doc(docId).set(payload);

    return res.status(201).json({ id: docId, ...payload, opportunity: { id: oppSnap.id, ...oppSnap.data() } });
  } catch (err) {
    console.error("POST /api/bookmarks", err);
    return res.status(500).json({ error: "Failed to save bookmark" });
  }
});

router.delete("/:opportunityId", requireAuth, async (req, res) => {
  try {
    const uid = req.user.uid;
    const opportunityId = req.params.opportunityId;
    const docId = `${uid}_${opportunityId}`;
    await getDb().collection("bookmarks").doc(docId).delete();
    return res.json({ ok: true });
  } catch (err) {
    console.error("DELETE /api/bookmarks/:opportunityId", err);
    return res.status(500).json({ error: "Failed to delete bookmark" });
  }
});

router.get("/", requireAuth, async (req, res) => {
  try {
    const uid = req.user.uid;
    const snap = await getDb().collection("bookmarks").where("uid", "==", uid).get();

    const items = await Promise.all(
      snap.docs.map(async (doc) => {
        const bookmark = { id: doc.id, ...doc.data() };
        const oppSnap = await getDb().collection("opportunities").doc(bookmark.opportunityId).get();
        return {
          ...bookmark,
          opportunity: oppSnap.exists ? { id: oppSnap.id, ...oppSnap.data() } : null,
        };
      })
    );

    return res.json(items);
  } catch (err) {
    console.error("GET /api/bookmarks", err);
    return res.status(500).json({ error: "Failed to load bookmarks" });
  }
});

module.exports = router;
