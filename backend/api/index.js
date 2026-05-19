const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("../config/db");
const authRoutes = require("../routes/authRoutes");
const moodRoutes = require("../routes/moodRoutes");
const chatRoutes = require("../routes/chatRoutes");
const recommendationRoutes = require("../routes/recommendationRoutes");
const scanRoutes = require("../routes/scanRoutes");

const app = express();

app.use(
  cors({
    origin: "*"
  })
);

app.use(express.json());

// Connect to MongoDB
connectDB();

app.get("/", (req, res) => {
  res.json({
    ok: true,
    message: "NutriMood AI backend is running on Vercel"
  });
});

app.post("/api/chat", async (req, res) => {
  try {
    const { message, userProfile, latestMood } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        ok: false,
        error: "Message is required"
      });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({
        ok: false,
        error: "Missing GROQ_API_KEY in backend environment"
      });
    }

    const systemPrompt = `
You are Lucky AI inside NutriMood AI, developed by Afzhal.

You are a helpful mood-based nutrition assistant.

You understand Indian, Tamil, and South Indian foods like idli, dosa, sambar, curd rice, lemon rice, tomato rice, pongal, vada, biryani, parotta, rasam, upma, chapati, rice, dal, fruits and nuts.

Your job:
- Understand user's mood and food question.
- Suggest suitable foods based on mood, food preference, health goal, and allergies.
- If user asks about Tamil food, explain clearly.
- If user uses Tanglish, reply in clear Tanglish.
- If user uses English, reply in simple English.
- Give practical food suggestions available in India/Tamil Nadu.

Safety:
- Do not diagnose disease.
- Do not promise cure.
- Do not give extreme diet advice.
- For serious symptoms, suggest consulting a doctor/dietitian.
- Avoid foods listed in allergies.

Answer format:
1. Short mood/food understanding.
2. 4 to 6 food suggestions.
3. Why each helps.
4. One small lifestyle tip.
5. Short safety note if needed.

Keep answer useful and not too long.
`;

    const profileContext = `
User Profile:
Name: ${userProfile?.name || "User"}
Food Preference: ${userProfile?.foodPreference || "Not provided"}
Health Goal: ${userProfile?.healthGoal || "Not provided"}
Common Mood: ${userProfile?.commonMood || "Not provided"}
Allergies/Foods to Avoid: ${userProfile?.allergies || "None"}
Latest Mood: ${latestMood?.mood || "Not detected"}
`;

    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: `${profileContext}\n\nUser Question: ${message}`
          }
        ],
        temperature: 0.4,
        max_tokens: 700
      })
    });

    const data = await groqResponse.json();

    if (!groqResponse.ok) {
      return res.status(groqResponse.status).json({
        ok: false,
        error: data.error?.message || "Groq API error"
      });
    }

    const answer = data.choices?.[0]?.message?.content || "No response from Lucky AI.";

    res.json({
      ok: true,
      answer
    });
  } catch (error) {
    console.error("Lucky AI backend error:", error);
    res.status(500).json({
      ok: false,
      error: "Server error. Please try again."
    });
  }
});

const foodDatabase = [
  {
    keywords: ["idli", "idly"],
    name: "Idli",
    category: "Tamil / South Indian",
    calories: "58 kcal per piece",
    protein: "2g",
    carbs: "12g",
    fat: "0.4g",
    moodBenefit: "Light food, good for neutral or tired mood.",
    suggestion: "Best with sambar for protein and vegetables."
  },
  {
    keywords: ["dosa", "dosai"],
    name: "Dosa",
    category: "Tamil / South Indian",
    calories: "130 kcal per dosa",
    protein: "3g",
    carbs: "25g",
    fat: "3g",
    moodBenefit: "Gives energy because it has carbs.",
    suggestion: "Use less oil and add sambar for better nutrition."
  },
  {
    keywords: ["sambar", "sambhar"],
    name: "Sambar",
    category: "Tamil / South Indian",
    calories: "120 kcal per bowl",
    protein: "5g",
    carbs: "18g",
    fat: "3g",
    moodBenefit: "Dal and vegetables support energy and fullness.",
    suggestion: "Good with idli, dosa, or rice."
  },
  {
    keywords: ["curd rice", "thayir sadam", "yogurt rice"],
    name: "Curd Rice",
    category: "Tamil Food",
    calories: "220 kcal per bowl",
    protein: "6g",
    carbs: "35g",
    fat: "6g",
    moodBenefit: "Cooling food, useful for angry or stressed mood.",
    suggestion: "Add cucumber or carrot for better nutrition."
  },
  {
    keywords: ["lemon rice", "elumichai sadam"],
    name: "Lemon Rice",
    category: "Tamil Food",
    calories: "250 kcal per bowl",
    protein: "5g",
    carbs: "42g",
    fat: "7g",
    moodBenefit: "Quick energy food.",
    suggestion: "Add groundnuts for protein and healthy fats."
  },
  {
    keywords: ["tomato rice", "thakkali sadam"],
    name: "Tomato Rice",
    category: "Tamil Food",
    calories: "260 kcal per bowl",
    protein: "5g",
    carbs: "45g",
    fat: "7g",
    moodBenefit: "Good comfort food for neutral mood.",
    suggestion: "Use less oil and add curd for balance."
  },
  {
    keywords: ["pongal", "ven pongal"],
    name: "Ven Pongal",
    category: "Tamil Food",
    calories: "300 kcal per bowl",
    protein: "8g",
    carbs: "45g",
    fat: "10g",
    moodBenefit: "Comfort food, useful when tired.",
    suggestion: "Good with sambar; avoid too much ghee."
  },
  {
    keywords: ["vada", "medu vada"],
    name: "Medu Vada",
    category: "Tamil / South Indian",
    calories: "150 kcal per piece",
    protein: "5g",
    carbs: "15g",
    fat: "8g",
    moodBenefit: "Protein from urad dal but fried food.",
    suggestion: "Eat moderately, better with sambar."
  },
  {
    keywords: ["biryani", "chicken biryani"],
    name: "Chicken Biryani",
    category: "Indian Food",
    calories: "500 kcal per plate",
    protein: "25g",
    carbs: "60g",
    fat: "18g",
    moodBenefit: "High energy meal.",
    suggestion: "Eat with curd/onion raita and avoid overeating."
  },
  {
    keywords: ["parotta", "paratha"],
    name: "Parotta",
    category: "Tamil Food",
    calories: "300 kcal per piece",
    protein: "6g",
    carbs: "40g",
    fat: "12g",
    moodBenefit: "Heavy food, gives energy but may feel sleepy.",
    suggestion: "Eat occasionally, pair with protein curry."
  },
  {
    keywords: ["banana", "vazhai pazham"],
    name: "Banana",
    category: "Fruit",
    calories: "105 kcal",
    protein: "1.3g",
    carbs: "27g",
    fat: "0.3g",
    moodBenefit: "Good for tired mood and quick energy.",
    suggestion: "Good pre-workout or evening snack."
  },
  {
    keywords: ["apple"],
    name: "Apple",
    category: "Fruit",
    calories: "95 kcal",
    protein: "0.5g",
    carbs: "25g",
    fat: "0.3g",
    moodBenefit: "Light snack for neutral mood.",
    suggestion: "Good with nuts for better fullness."
  }
];

const fallbackFood = {
  name: "Unknown Food",
  category: "General Food",
  calories: "Not sure",
  protein: "Not sure",
  carbs: "Not sure",
  fat: "Not sure",
  moodBenefit: "Unable to identify accurately in frontend demo mode.",
  suggestion: "Try typing the food name or connect AI vision backend for accurate scanning."
};

function findBackendFood(foodName) {
  if (!foodName) return null;
  const search = foodName.toLowerCase().trim();
  return foodDatabase.find((food) =>
    food.keywords.some((keyword) => keyword.toLowerCase() === search)
  );
}

app.post("/api/scan-food", (req, res) => {
  const { foodName } = req.body || {};
  const result = findBackendFood(foodName) || fallbackFood;

  res.json({
    ok: true,
    result
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/moods", moodRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/scans", scanRoutes);

module.exports = app;
