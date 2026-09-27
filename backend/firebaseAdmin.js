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

function getAdminApp() {
  const existingApps = admin.apps;
  if (existingApps.length) {
    return existingApps[0];
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

  return initializeApp({
    credential: cert(serviceAccount),
  });
}

const db = new Proxy(
  {},
  {
    get(_target, property) {
      const firestore = admin.firestore();
      const value = Reflect.get(firestore, property, firestore);
      return typeof value === "function" ? value.bind(firestore) : value;
    },
  }
);

module.exports = { admin, db };
