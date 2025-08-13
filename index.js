require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const fitnessRoutes = require('./routes/fitnessRoutes');
const dailyIntakeRoutes = require('./routes/dailyIntakeRoutes');
const groqRoutes = require('./routes/groq'); // 💥 New route added

const app = express();
app.use(cors());
app.use(express.json());

// 💡 Register routes
app.use('/api/auth', authRoutes);
app.use('/api/fitness', fitnessRoutes);
app.use('/api/intake', dailyIntakeRoutes);
app.use('/api/groq', groqRoutes); // 🔥 Groq route for describe + decision

// ✅ Connect to DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB Error:", err));

// ✅ Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
