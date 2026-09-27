require("dotenv").config();

const admin = require("firebase-admin");

if (!admin.apps.length) {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) {
    throw new Error(
      "FIREBASE_SERVICE_ACCOUNT is required (JSON string of a Firebase service account)"
    );
  }

  let serviceAccount;
  try {
    serviceAccount = typeof raw === "string" ? JSON.parse(raw) : raw;
  } catch {
    throw new Error("FIREBASE_SERVICE_ACCOUNT must be valid JSON");
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

module.exports = { admin, db };
