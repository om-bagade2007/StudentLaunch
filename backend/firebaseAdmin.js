require("dotenv").config();

const { initializeApp, getApps, cert } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const { getFirestore } = require("firebase-admin/firestore");

const admin = {
  get apps() {
    return getApps();
  },
  auth: () => getAuth(getAdminApp()),
  firestore: () => getFirestore(getAdminApp()),
};

let appInstance;
let firestoreInstance;

function getAdminApp() {
  if (appInstance) {
    return appInstance;
  }

  const existingApps = admin.apps;
  if (existingApps.length) {
    appInstance = existingApps[0];
    return appInstance;
  }

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

  appInstance = initializeApp({
    credential: cert(serviceAccount),
  });
  return appInstance;
}

function getDb() {
  if (!firestoreInstance) {
    firestoreInstance = admin.firestore();
  }
  return firestoreInstance;
}

module.exports = { admin, getDb };
