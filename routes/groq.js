const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");

const GROQ_API_KEY = process.env.GROQ_API_KEY || "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";
const MODEL = "llama3-70b-8192";

router.post("/analyze", async (req, res) => {
  const { type, foodDescription, foodMacros, dailyIntake, userGoal, targetDate } = req.body;

  let prompt = "";

  if (type === "describe") {
    if (!foodDescription) return res.status(400).json({ message: "Missing foodDescription" });

    prompt = `You are a nutritional analysis expert. 
Given the following food description, return only the estimated macro-nutrient breakdown in JSON format.

Only return this JSON (no extra notes or explanation):

{
  "calories": number,
  "sugar": number,
  "protein": number,
  "fat": number,
  "carbs": number,
  "fiber": number,
  "sodium": number
}

Description: "${foodDescription}"`;
  }

  else if (type === "decision") {
    if (!foodMacros || !dailyIntake || !userGoal || !targetDate) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const targetDays = Math.max(
      Math.ceil((new Date(targetDate) - new Date()) / (1000 * 60 * 60 * 24)),
      1
    );

    prompt = `You are a nutrition coach. Based on the user's goal, current intake and food, decide if user should consume this food.

Goal: ${userGoal} (target in ${targetDays} days)
Today's intake so far: ${JSON.stringify(dailyIntake)}
Food to be consumed: ${JSON.stringify(foodMacros)}

Only respond in this JSON format (no explanation outside JSON):

{
  "decision": "yes" or "no",
  "reason": "brief explanation"
}`;
  }

  else {
    return res.status(400).json({ message: "Invalid type" });
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const result = await response.json();
    const raw = result.choices?.[0]?.message?.content;

    let jsonString = raw;

    // Try to extract JSON if extra text is returned
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (jsonMatch) jsonString = jsonMatch[0];

    let parsed;
    try {
      parsed = JSON.parse(jsonString);
    } catch (e) {
      return res.status(500).json({ message: "AI response not parsable", raw });
    }

    res.status(200).json(parsed);
  } catch (error) {
    console.error("Groq API error:", error);
    res.status(500).json({ message: "Groq API error", error });
  }
});

module.exports = router;
