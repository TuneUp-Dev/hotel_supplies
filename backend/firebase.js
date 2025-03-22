const admin = require("firebase-admin");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

// Initialize Firebase
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  }),
});

const db = admin.firestore();

async function testFetch() {
  try {
    const snapshot = await db.collection("Categories").get();
    if (snapshot.empty) {
      console.log("No categories found.");
    } else {
      console.log(
        "Categories Found:",
        snapshot.docs.map((doc) => doc.id)
      );
    }
  } catch (err) {
    console.error("❌ Error fetching categories:", err);
  }
}

testFetch();

module.exports = db;
