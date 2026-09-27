require("dotenv").config();

const { initializeApp, getApps, cert } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const { getFirestore } = require("firebase-admin/firestore");

if (!getApps().length) {
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

  initializeApp({
    credential: cert(serviceAccount),
  });
}

const admin = {
  auth: () => getAuth(),
  firestore: () => getFirestore(),
};

const db = getFirestore();

module.exports = { admin, db };
