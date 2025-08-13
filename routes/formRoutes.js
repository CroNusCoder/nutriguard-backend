const express = require('express');
const router = express.Router();

router.post('/submit', async (req, res) => {
  const formData = req.body;
  console.log("Received form data:", formData);

  try {
    // Save to DB or process
    res.status(200).json({ message: 'Form submitted successfully!' });
  } catch (err) {
    console.error('Form error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
