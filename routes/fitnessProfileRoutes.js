const express = require('express');
const router = express.Router();
const User = require('../models/User');
const FitnessProfile = require('../models/FitnessProfile');

router.post('/', async (req, res) => {
  const { email, formData } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const existingProfile = await FitnessProfile.findOne({ user: user._id });

    if (existingProfile) {
      await FitnessProfile.findOneAndUpdate({ user: user._id }, formData);
      return res.status(200).json({ message: 'Profile updated successfully' });
    }

    const newProfile = new FitnessProfile({
      user: user._id,
      ...formData,
    });

    await newProfile.save();
    res.status(200).json({ message: 'Profile saved successfully', profile: newProfile });

  } catch (err) {
    console.error("Fitness profile error:", err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
