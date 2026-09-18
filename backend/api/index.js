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

/* =========================
   CORS
========================= */

const allowedOrigins = [
  "https://nutrimood-ai.vercel.app",
  "https://nutrimood-ai.netlify.app",
  "http://127.0.0.1:5500",
  "http://localhost:5500"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests without an Origin header
      // such as Postman/server-to-server requests.
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("CORS: Origin not allowed"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization"
    ],
    credentials: true
  })
);

app.options("*", cors());

/* =========================
   BODY PARSER
========================= */

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

/* =========================
   DATABASE
========================= */

connectDB()
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error(
      "Initial MongoDB connection failed:",
      error.message
    );
  });

/* =========================
   ROOT TEST
========================= */

app.get("/", (req, res) => {
  res.status(200).json({
    ok: true,
    message: "NutriMood AI backend is running on Vercel",
    service: "NutriMood AI Backend",
    status: "online"
  });
});

/* =========================
   API HEALTH TEST
========================= */

app.get("/api/test", (req, res) => {
  res.status(200).json({
    ok: true,
    message: "NutriMood AI API is working",
    timestamp: new Date().toISOString()
  });
});

/* =========================
   LUCKY AI CHATBOT
========================= */

app.post("/api/chat", async (req, res) => {
  try {
    const {
      message,
      userProfile = {},
      latestMood = {}
    } = req.body || {};

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        ok: false,
        error: "Message is required"
      });
    }

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      console.error("GROQ_API_KEY is missing");

      return res.status(500).json({
        ok: false,
        error: "GROQ_API_KEY is missing in Vercel Environment Variables"
      });
    }

    const systemPrompt = `
You are Lucky AI inside NutriMood AI, developed by Afzhal.

You are a helpful mood-based nutrition assistant.

You understand Indian, Tamil, and South Indian foods such as:
- Idli
- Dosa
- Sambar
- Curd rice
- Lemon rice
- Tomato rice
- Pongal
- Vada
- Biryani
- Parotta
- Rasam
- Upma
- Chapati
- Rice
- Dal
- Fruits
- Nuts

Your responsibilities:

1. Understand the user's mood.
2. Understand the user's food question.
3. Suggest suitable foods based on:
   - Mood
   - Food preference
   - Health goal
   - Allergies
4. If the user asks about Tamil food, explain it clearly.
5. If the user uses Tanglish, reply in clear Tanglish.
6. If the user uses English, reply in simple English.
7. Suggest foods that are realistically available in India/Tamil Nadu.

Safety rules:
- Do not diagnose diseases.
- Do not claim that food can cure diseases.
- Do not give extreme diet advice.
- Do not recommend foods that are listed as allergies.
- For serious medical symptoms, suggest consulting a doctor or dietitian.

Answer style:
- Keep the answer practical.
- Keep the answer reasonably short.
- Give 4 to 6 food suggestions when appropriate.
- Explain briefly why each food is suitable.
- Give one simple lifestyle tip.
`;

    const profileContext = `
User Profile:
Name: ${userProfile.name || "User"}
Food Preference: ${userProfile.foodPreference || "Not provided"}
Health Goal: ${userProfile.healthGoal || "Not provided"}
Common Mood: ${userProfile.commonMood || "Not provided"}
Allergies/Foods to Avoid: ${userProfile.allergies || "None"}

Latest Detected Mood:
${latestMood.mood || "Not detected"}
`;

    const groqResponse = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",

        headers: {
          Authorization: `Bearer ${apiKey}`,
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
              content: `
${profileContext}

User Question:
${message.trim()}
`
            }
          ],

          temperature: 0.4,
          max_tokens: 700
        })
      }
    );

    const data = await groqResponse.json();

    if (!groqResponse.ok) {
      console.error("Groq API error:", data);

      return res.status(groqResponse.status).json({
        ok: false,
        error:
          data?.error?.message ||
          "Groq API request failed"
      });
    }

    const answer =
      data?.choices?.[0]?.message?.content?.trim();

    if (!answer) {
      return res.status(500).json({
        ok: false,
        error: "Lucky AI returned an empty response"
      });
    }

    return res.status(200).json({
      ok: true,
      answer
    });

  } catch (error) {
    console.error("Lucky AI backend error:", error);

    return res.status(500).json({
      ok: false,
      error: error.message || "Lucky AI server error"
    });
  }
});

/* =========================
   FOOD DATABASE
========================= */

const foodDatabase = [
  {
    keywords: ["idli", "idly"],
    name: "Idli",
    category: "Tamil / South Indian",
    calories: "58 kcal per piece",
    protein: "2g",
    carbs: "12g",
    fat: "0.4g",
    moodBenefit: "Light food, suitable when feeling tired or neutral.",
    suggestion: "Best with sambar for extra protein and vegetables."
  },

  {
    keywords: ["dosa", "dosai"],
    name: "Dosa",
    category: "Tamil / South Indian",
    calories: "130 kcal per dosa",
    protein: "3g",
    carbs: "25g",
    fat: "3g",
    moodBenefit: "Provides carbohydrates for energy.",
    suggestion: "Use less oil and have it with sambar."
  },

  {
    keywords: ["sambar", "sambhar"],
    name: "Sambar",
    category: "Tamil / South Indian",
    calories: "120 kcal per bowl",
    protein: "5g",
    carbs: "18g",
    fat: "3g",
    moodBenefit: "Dal and vegetables provide protein and nutrients.",
    suggestion: "Good with idli, dosa or rice."
  },

  {
    keywords: [
      "curd rice",
      "thayir sadam",
      "yogurt rice"
    ],
    name: "Curd Rice",
    category: "Tamil Food",
    calories: "220 kcal per bowl",
    protein: "6g",
    carbs: "35g",
    fat: "6g",
    moodBenefit: "Comforting and cooling food.",
    suggestion: "Add cucumber or carrot for extra nutrition."
  },

  {
    keywords: [
      "lemon rice",
      "elumichai sadam"
    ],
    name: "Lemon Rice",
    category: "Tamil Food",
    calories: "250 kcal per bowl",
    protein: "5g",
    carbs: "42g",
    fat: "7g",
    moodBenefit: "Provides quick energy.",
    suggestion: "Add groundnuts for protein and healthy fats."
  },

  {
    keywords: [
      "tomato rice",
      "thakkali sadam"
    ],
    name: "Tomato Rice",
    category: "Tamil Food",
    calories: "260 kcal per bowl",
    protein: "5g",
    carbs: "45g",
    fat: "7g",
    moodBenefit: "Comforting meal option.",
    suggestion: "Use less oil and add curd for balance."
  },

  {
    keywords: [
      "pongal",
      "ven pongal"
    ],
    name: "Ven Pongal",
    category: "Tamil Food",
    calories: "300 kcal per bowl",
    protein: "8g",
    carbs: "45g",
    fat: "10g",
    moodBenefit: "Comfort food that can be suitable when tired.",
    suggestion: "Have with sambar and avoid excessive ghee."
  },

  {
    keywords: [
      "vada",
      "medu vada"
    ],
    name: "Medu Vada",
    category: "Tamil / South Indian",
    calories: "150 kcal per piece",
    protein: "5g",
    carbs: "15g",
    fat: "8g",
    moodBenefit: "Contains protein from urad dal but is fried.",
    suggestion: "Eat moderately and pair with sambar."
  },

  {
    keywords: [
      "biryani",
      "chicken biryani"
    ],
    name: "Chicken Biryani",
    category: "Indian Food",
    calories: "500 kcal per plate",
    protein: "25g",
    carbs: "60g",
    fat: "18g",
    moodBenefit: "High-energy meal.",
    suggestion: "Pair with raita and avoid overeating."
  },

  {
    keywords: [
      "parotta",
      "paratha"
    ],
    name: "Parotta",
    category: "Tamil Food",
    calories: "300 kcal per piece",
    protein: "6g",
    carbs: "40g",
    fat: "12g",
    moodBenefit: "Heavy food that can provide energy.",
    suggestion: "Eat occasionally and pair with a protein-rich curry."
  },

  {
    keywords: [
      "banana",
      "vazhai pazham"
    ],
    name: "Banana",
    category: "Fruit",
    calories: "105 kcal",
    protein: "1.3g",
    carbs: "27g",
    fat: "0.3g",
    moodBenefit: "Convenient source of carbohydrates and energy.",
    suggestion: "Good as a snack or before exercise."
  },

  {
    keywords: ["apple"],
    name: "Apple",
    category: "Fruit",
    calories: "95 kcal",
    protein: "0.5g",
    carbs: "25g",
    fat: "0.3g",
    moodBenefit: "Light and convenient snack.",
    suggestion: "Pair with nuts for better fullness."
  }
];

/* =========================
   FOOD SEARCH
========================= */

const fallbackFood = {
  name: "Unknown Food",
  category: "General Food",
  calories: "Not available",
  protein: "Not available",
  carbs: "Not available",
  fat: "Not available",
  moodBenefit: "Food could not be identified accurately.",
  suggestion:
    "Type the food name manually or connect an AI vision model for image-based identification."
};

function findBackendFood(foodName) {
  if (!foodName || typeof foodName !== "string") {
    return null;
  }

  const search = foodName.toLowerCase().trim();

  return foodDatabase.find((food) =>
    food.keywords.some(
      (keyword) =>
        keyword.toLowerCase() === search
    )
  );
}

/* =========================
   FOOD SCAN
========================= */

app.post("/api/scan-food", (req, res) => {
  try {
    const { foodName } = req.body || {};

    const result =
      findBackendFood(foodName) ||
      fallbackFood;

    return res.status(200).json({
      ok: true,
      result
    });

  } catch (error) {
    console.error("Food scan error:", error);

    return res.status(500).json({
      ok: false,
      error: "Food scan failed"
    });
  }
});

/* =========================
   DATABASE TEST
========================= */

app.get("/api/db-test", async (req, res) => {
  try {
    const mongoose = require("mongoose");

    await connectDB();

    return res.status(200).json({
      ok: true,
      mongoUriExists: !!process.env.MONGO_URI,
      mongoState: mongoose.connection.readyState,
      message: "MongoDB connection test completed"
    });

  } catch (error) {
    console.error("DB test error:", error);

    return res.status(500).json({
      ok: false,
      mongoUriExists: !!process.env.MONGO_URI,
      error: error.message
    });
  }
});

/* =========================
   DATABASE MIDDLEWARE
========================= */

async function ensureDB(req, res, next) {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error(
      "Database middleware error:",
      error.message
    );

    return res.status(500).json({
      ok: false,
      error: "Database connection failed"
    });
  }
}

/* =========================
   ROUTES
========================= */

app.use(
  "/api/auth",
  ensureDB,
  authRoutes
);

app.use(
  "/api/moods",
  ensureDB,
  moodRoutes
);

app.use(
  "/api/chats",
  ensureDB,
  chatRoutes
);

app.use(
  "/api/recommendations",
  ensureDB,
  recommendationRoutes
);

app.use(
  "/api/scans",
  ensureDB,
  scanRoutes
);

/* =========================
   404 HANDLER
========================= */

app.use((req, res) => {
  return res.status(404).json({
    ok: false,
    error: `Route not found: ${req.method} ${req.originalUrl}`
  });
});

/* =========================
   ERROR HANDLER
========================= */

app.use((error, req, res, next) => {
  console.error("Express error:", error);

  return res.status(500).json({
    ok: false,
    error: error.message || "Internal server error"
  });
});

/* =========================
   EXPORT FOR VERCEL
========================= */

module.exports = app;
