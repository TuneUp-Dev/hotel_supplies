const express = require("express");
const multer = require("multer");
const admin = require("firebase-admin");
const router = express.Router();

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });
}

const upload = multer({ storage: multer.memoryStorage() });

// ✅ Image upload
router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }

    const bucket = admin.storage().bucket();
    const file = bucket.file(`uploads/${Date.now()}_${req.file.originalname}`);
    const stream = file.createWriteStream({
      metadata: {
        contentType: req.file.mimetype,
      },
    });

    stream.on("error", (err) => {
      console.error("Error uploading file:", err);
      res.status(500).send("Error uploading file.");
    });

    stream.on("finish", async () => {
      const [url] = await file.getSignedUrl({
        action: "read",
        expires: "03-09-2491",
      });
      res.status(200).json({ imageUrl: url });
    });

    stream.end(req.file.buffer);
  } catch (err) {
    console.error("Error uploading file:", err);
    res.status(500).send("Server error.");
  }
});

module.exports = router;
