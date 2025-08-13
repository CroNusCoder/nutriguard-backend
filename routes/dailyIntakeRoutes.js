const express = require("express");
const router = express.Router();
const DailyIntake = require("../models/DailyIntake");

// 📅 Helper to get today’s date range
const getTodayDateRange = () => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  return { start, end };
};

// ✅ GET today's intake
router.get("/today", async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    const { start, end } = getTodayDateRange();

    const records = await DailyIntake.find({
      email,
      createdAt: { $gte: start, $lte: end },
    });

    const total = {
      calories: 0, sugar: 0, protein: 0, fat: 0,
      carbs: 0, fiber: 0, sodium: 0,
    };

    records.forEach(record => {
      const n = record.nutrition || {};
      total.calories += n.calories || 0;
      total.sugar += n.sugar || 0;
      total.protein += n.protein || 0;
      total.fat += n.fat || 0;
      total.carbs += n.carbs || 0;
      total.fiber += n.fiber || 0;
      total.sodium += n.sodium || 0;
    });

    res.json(total);
  } catch (error) {
    console.error("Error in /today:", error);
    res.status(500).json({ message: "Failed to fetch today's intake" });
  }
});

// ✅ POST intake entry
router.post('/add', async (req, res) => {
  const { email, foodName, nutrition, source } = req.body;

  if (!email || !foodName || !nutrition) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const newEntry = new DailyIntake({
      email,
      foodName,
      nutrition,
      source,
    });

    await newEntry.save();
    res.status(200).json({ message: 'Food intake saved successfully' });
  } catch (err) {
    console.error('Error saving food intake:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
