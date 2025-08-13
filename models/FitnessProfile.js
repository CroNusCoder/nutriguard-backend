const mongoose = require('mongoose');

const fitnessProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: String,
  age: String,
  gender: String,
  height: String,
  currentWeight: String,
  targetWeight: String,
  targetDate: Date,
  goal: String,
  activityLevel: String,
  allergies: String,
  medicalConditions: String,
  diagnosis: String,
}, { timestamps: true });

module.exports = mongoose.model('FitnessProfile', fitnessProfileSchema);
