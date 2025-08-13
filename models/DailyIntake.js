const mongoose = require('mongoose');

const NutritionSchema = new mongoose.Schema({
  calories: { type: Number, default: 0 },
  sugar: { type: Number, default: 0 },
  protein: { type: Number, default: 0 },
  fat: { type: Number, default: 0 },
  carbs: { type: Number, default: 0 },
  fiber: { type: Number, default: 0 },
  sodium: { type: Number, default: 0 },
}, { _id: false });

const DailyIntakeSchema = new mongoose.Schema({
  email: { type: String, required: true },
  foodName: { type: String, required: true },
  nutrition: { type: NutritionSchema, required: true },
  source: { type: String, enum: ['barcode', 'manual'], default: 'manual' },
}, {
  timestamps: true  // adds createdAt and updatedAt
});

module.exports = mongoose.model('DailyIntake', DailyIntakeSchema);
