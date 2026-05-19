// Food recommendations page scripts
// ================= NUTRIMOOD AI - RECOMMENDATIONS JS =================

const recommendationData = {
  Happy: {
    icon: "★",
    foods: [
      ["•", "Avocado", "Healthy fats for energy and brain focus."],
      ["•", "Dark Chocolate", "Supports feel-good mood."],
      ["•", "Blueberries", "Antioxidants for brain health."],
      ["•", "Nuts", "Steady energy and healthy fats."]
    ],
    benefits: [
      "Maintains positive mood",
      "Supports brain focus",
      "Gives steady energy",
      "Good for balanced lifestyle"
    ],
    tip: "Happy mood-la light healthy snacks continue pannunga."
  },
  Sad: {
    icon: "★",
    foods: [
      ["•", "Banana", "Natural mood-friendly fruit."],
      ["•", "Milk", "Comfort drink with nutrients."],
      ["•", "Dark Chocolate", "Can support feel-good mood."],
      ["•", "Walnuts", "Healthy fats for brain support."]
    ],
    benefits: [
      "Supports emotional balance",
      "Gives gentle energy",
      "Comfort food options",
      "Brain-friendly nutrients"
    ],
    tip: "Sad mood long time irundha trusted person kitta pesunga."
  },
  Stress: {
    icon: "★",
    foods: [
      ["•", "Green Tea", "Calming and refreshing."],
      ["•", "Almonds", "Magnesium and healthy fats."],
      ["•", "Oats", "Steady energy release."],
      ["•", "Banana", "Simple mood support."]
    ],
    benefits: [
      "Helps calm feeling",
      "Steady energy",
      "Supports focus",
      "Light and healthy choices"
    ],
    tip: "Stress irundha water kudichu 10 minutes walk pannunga."
  },
  Tired: {
    icon: "★",
    foods: [
      ["•", "Banana", "Quick energy boost."],
      ["•", "Dates", "Natural sugar and energy."],
      ["•", "Egg", "Protein support."],
      ["•", "Water", "Hydration support."]
    ],
    benefits: [
      "Improves energy",
      "Supports hydration",
      "Protein support",
      "Good for tiredness"
    ],
    tip: "Tired ah irundha sleep schedule and hydration check pannunga."
  },
  Angry: {
    icon: "★",
    foods: [
      ["•", "Cucumber", "Cooling and hydrating."],
      ["•", "Herbal Tea", "Calm support."],
      ["•", "Curd", "Cooling food option."],
      ["•", "Watermelon", "Hydrating and light."]
    ],
    benefits: [
      "Cooling food options",
      "Hydration support",
      "Calm feeling",
      "Light digestion"
    ],
    tip: "Angry mood-la deep breathing and light food better."
  },
  Neutral: {
    icon: "★",
    foods: [
      ["•", "Apple", "Light healthy snack."],
      ["•", "Salad", "Balanced nutrition."],
      ["•", "Oats", "Good daily energy."],
      ["•", "Nuts", "Healthy fats."]
    ],
    benefits: [
      "Maintains balance",
      "Daily nutrition support",
      "Steady energy",
      "Simple healthy routine"
    ],
    tip: "Neutral mood-la balanced meal continue pannunga."
  },
  Anxious: {
    icon: "★",
    foods: [
      ["•", "Chamomile Tea", "Calming and relaxing."],
      ["•", "Almonds", "Healthy fats for brain support."],
      ["•", "Banana", "Natural mood support."],
      ["•", "Oats", "Comforting easy breakfast."]
    ],
    benefits: [
      "Helps calm anxiety",
      "Supports gentle energy",
      "Easy to digest",
      "Good for regular routine"
    ],
    tip: "Anxious mood-la light food and slow breathing try pannunga."
  },
  "Low Focus": {
    icon: "★",
    foods: [
      ["•", "Walnuts", "Brain-friendly healthy fats."],
      ["•", "Green Tea", "Calm, light focus support."],
      ["•", "Oats", "Slow energy release."],
      ["•", "Banana", "Quick energy without heaviness."]
    ],
    benefits: [
      "Supports focus",
      "Steady energy",
      "Healthy brain fuel",
      "Light and nourishing"
    ],
    tip: "Focus the first step; light food and water help."
  }
};

const fallbackRecommendation = {
  icon: "★",
  foods: [
    ["•", "Fresh Fruit", "Use a simple snack to support your mood."],
    ["•", "Whole Grains", "Provides steady energy throughout the day."],
    ["•", "Nuts", "Good fats for brain and mood support."],
    ["•", "Water", "Hydration is always helpful for mood and focus."]
  ],
  benefits: [
    "Simple nutrition helps stabilize mood",
    "Hydration supports energy and clarity",
    "Light food keeps digestion easy",
    "Balanced choices support wellbeing"
  ],
  tip: "Try a light, balanced meal and stay hydrated."
};

function normalizeMood(value) {
  if (!value || typeof value !== "string") return "Neutral";
  value = value.toLowerCase();
  if (value.includes("happy")) return "Happy";
  if (value.includes("sad")) return "Sad";
  if (value.includes("stress")) return "Stress";
  if (value.includes("tired")) return "Tired";
  if (value.includes("angry")) return "Angry";
  if (value.includes("anxious")) return "Anxious";
  if (value.includes("focus")) return "Low Focus";
  if (value.includes("neutral")) return "Neutral";
  return "Neutral";
}

document.addEventListener("DOMContentLoaded", () => {
  const latestMood = JSON.parse(localStorage.getItem("nutrimoodLatestMood")) || {
    mood: "Neutral",
    icon: "★"
  };

  const moodCards = document.querySelectorAll(".mood-card");
  const recommendMood = document.getElementById("recommendMood");
  const foodList = document.getElementById("foodList");
  const benefitList = document.getElementById("benefitList");
  const dailyTip = document.getElementById("dailyTip");
  const savePlanBtn = document.getElementById("savePlanBtn");

  let currentMood = latestMood.mood || "Neutral";

  function renderRecommendation(mood) {
    const moodKey = normalizeMood(mood);
    const data = recommendationData[moodKey] || fallbackRecommendation;
    const foods = Array.isArray(data.foods) && data.foods.length ? data.foods : fallbackRecommendation.foods;
    const benefits = Array.isArray(data.benefits) && data.benefits.length ? data.benefits : fallbackRecommendation.benefits;
    const tip = data.tip || fallbackRecommendation.tip;

    if (recommendMood) recommendMood.textContent = moodKey;

    if (foodList) {
      foodList.innerHTML = foods
        .map(
          (food) => `
          <div class="food-card">
            <div class="food-emoji">${food[0]}</div>
            <h3>${food[1]}</h3>
            <p>${food[2]}</p>
          </div>
        `
        )
        .join("");
    }

    if (benefitList) {
      benefitList.innerHTML = benefits
        .map((benefit) => `<li><span>•</span>${benefit}</li>`)
        .join("");
    }

    if (dailyTip) dailyTip.textContent = tip;
  }

  moodCards.forEach((card) => {
    if (card.dataset.mood === currentMood) {
      card.classList.add("active");
    } else {
      card.classList.remove("active");
    }

    card.addEventListener("click", () => {
      moodCards.forEach((c) => c.classList.remove("active"));
      card.classList.add("active");

      currentMood = card.dataset.mood;
      renderRecommendation(currentMood);
    });
  });

  if (savePlanBtn) {
    savePlanBtn.addEventListener("click", () => {
      const moodKey = normalizeMood(currentMood);
      const data = recommendationData[moodKey] || fallbackRecommendation;
      const foods = Array.isArray(data.foods) && data.foods.length ? data.foods : fallbackRecommendation.foods;

      localStorage.setItem(
        "nutrimoodLatestRecommendation",
        JSON.stringify({
          mood: moodKey,
          foods,
          date: new Date().toLocaleString()
        })
      );

      const history = JSON.parse(localStorage.getItem("nutrimoodHistory")) || [];
      history.unshift({
        type: "food",
        title: `Food Plan Saved: ${moodKey}`,
        date: new Date().toLocaleString(),
        details: foods.map((f) => f[1]).join(", ")
      });
      localStorage.setItem("nutrimoodHistory", JSON.stringify(history));

      savePlanBtn.innerHTML = "Saved Successfully";
      setTimeout(() => {
        savePlanBtn.innerHTML = "Save Plan";
      }, 1600);
    });
  }

  renderRecommendation(currentMood);
});
