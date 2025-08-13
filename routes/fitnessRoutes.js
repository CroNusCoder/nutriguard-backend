const express = require('express');
const router = express.Router();
const User = require('../models/User');
const FitnessProfile = require('../models/FitnessProfile');

// Save/update fitness profile
router.post('/', async (req, res) => {
  const { email, formData } = req.body;

  if (!email || !formData) {
    return res.status(400).json({ error: 'Email and formData are required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const existing = await FitnessProfile.findOne({ user: user._id });

    if (existing) {
      await FitnessProfile.updateOne({ user: user._id }, formData);
      return res.status(200).json({ message: 'Profile updated' });
    }

    const newProfile = new FitnessProfile({
      user: user._id,
      ...formData,
    });

    await newProfile.save();
    res.status(200).json({ message: 'Profile created', profile: newProfile });
  } catch (err) {
    console.error("POST /api/fitness error:", err);
    res.status(500).json({ error: 'Server error' });
  }
});

// 🆕 GET user's goal and targetDate
router.get('/goal', async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const profile = await FitnessProfile.findOne({ user: user._id });
    if (!profile) return res.status(404).json({ message: "Fitness profile not found" });

    res.status(200).json({
      goal: profile.goal,
      targetDate: profile.targetDate
    });
  } catch (err) {
    console.error("GET /api/fitness/goal error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
