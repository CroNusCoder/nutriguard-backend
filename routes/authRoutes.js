//Dependencies
const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const User = require('../models/User');
const path = require('path');

//Initialize Firebase Admin once
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(
      require(path.resolve(__dirname, '../firebase/serviceAccountKey.json'))
    ),
  });
}

//Verify Firebase ID Token & Sync with MongoDB
router.post('/firebase', async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({ error: 'ID token is required' });
  }

  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    const { name, email, uid } = decoded;

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({ name, email, firebaseUid: uid });
      await user.save();
    }

    res.status(200).json({ message: 'Login successful', user });
  } catch (err) {
    console.error('Firebase token error:', err);
    res.status(401).json({ error: 'Invalid token', details: err.message });
  }
});

module.exports = router;
