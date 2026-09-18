// ================= NUTRIMOOD AI - RECOMMENDATIONS JS =================

const recommendationData = {
  Happy: {
    icon: "😊",
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
    icon: "😔",
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
    icon: "😣",
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
    icon: "😴",
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
    icon: "😡",
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
    icon: "🙂",
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
    icon: "😟",
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
    icon: "🧠",
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

const fallbackRecommendation = recommendationData.Neutral;


/* =========================
   NORMALIZE MOOD
========================= */

function normalizeMood(value) {

  if (!value) return "Neutral";

  if (typeof value === "object") {
    value =
      value.mood ||
      value.detectedMood ||
      value.detected_mood ||
      value.emotion ||
      value.label ||
      "Neutral";
  }

  const mood = String(value)
    .trim()
    .toLowerCase();

  if (mood.includes("happy")) return "Happy";
  if (mood.includes("sad")) return "Sad";
  if (mood.includes("stress")) return "Stress";
  if (mood.includes("tired")) return "Tired";
  if (mood.includes("angry")) return "Angry";
  if (mood.includes("anxious")) return "Anxious";

  if (
    mood.includes("low focus") ||
    mood.includes("low_focus") ||
    mood.includes("focus")
  ) {
    return "Low Focus";
  }

  if (mood.includes("neutral")) return "Neutral";

  return "Neutral";
}


/* =========================
   GET LATEST MOOD
========================= */

function getLatestMood() {

  try {

    const saved =
      localStorage.getItem(
        "nutrimoodLatestMood"
      );

    if (!saved) {
      return "Neutral";
    }

    const parsed =
      JSON.parse(saved);

    console.log(
      "NutriMood latest mood:",
      parsed
    );

    return normalizeMood(parsed);

  } catch (error) {

    console.error(
      "Mood reading error:",
      error
    );

    return "Neutral";
  }
}


/* =========================
   PAGE LOAD
========================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    const moodCards =
      document.querySelectorAll(
        ".mood-card"
      );

    const recommendMood =
      document.getElementById(
        "recommendMood"
      );

    const foodList =
      document.getElementById(
        "foodList"
      );

    const benefitList =
      document.getElementById(
        "benefitList"
      );

    const dailyTip =
      document.getElementById(
        "dailyTip"
      );

    const savePlanBtn =
      document.getElementById(
        "savePlanBtn"
      );


    /* =========================
       CURRENT MOOD
    ========================= */

    let currentMood =
      getLatestMood();


    /* =========================
       RENDER RECOMMENDATION
    ========================= */

    function renderRecommendation(
      mood
    ) {

      const moodKey =
        normalizeMood(mood);

      const data =
        recommendationData[moodKey] ||
        fallbackRecommendation;

      console.log(
        "Rendering food recommendation for:",
        moodKey
      );


      /* MOOD TITLE */

      if (recommendMood) {

        recommendMood.textContent =
          moodKey;
      }


      /* FOOD LIST */

      if (foodList) {

        foodList.innerHTML =
          data.foods
            .map(
              (food) => `
                <div class="food-card">

                  <div class="food-emoji">
                    ${food[0]}
                  </div>

                  <h3>
                    ${food[1]}
                  </h3>

                  <p>
                    ${food[2]}
                  </p>

                </div>
              `
            )
            .join("");
      }


      /* BENEFITS */

      if (benefitList) {

        benefitList.innerHTML =
          data.benefits
            .map(
              (benefit) =>
                `<li>
                  <span>•</span>
                  ${benefit}
                </li>`
            )
            .join("");
      }


      /* DAILY TIP */

      if (dailyTip) {

        dailyTip.textContent =
          data.tip;
      }


      /* ACTIVE MOOD CARD */

      moodCards.forEach(
        (card) => {

          const cardMood =
            normalizeMood(
              card.dataset.mood
            );

          card.classList.toggle(
            "active",
            cardMood === moodKey
          );
        }
      );


      currentMood = moodKey;
    }


    /* =========================
       MOOD CARD CLICK
    ========================= */

    moodCards.forEach(
      (card) => {

        card.addEventListener(
          "click",
          () => {

            const selectedMood =
              normalizeMood(
                card.dataset.mood
              );

            currentMood =
              selectedMood;

            renderRecommendation(
              selectedMood
            );

            /*
              Save selected mood so
              refresh also keeps it.
            */

            localStorage.setItem(
              "nutrimoodLatestMood",
              JSON.stringify({
                mood: selectedMood,
                icon:
                  recommendationData[
                    selectedMood
                  ]?.icon || "★",
                source:
                  "recommendation",
                updatedAt:
                  new Date().toISOString()
              })
            );
          }
        );
      }
    );


    /* =========================
       SAVE PLAN
    ========================= */

    if (savePlanBtn) {

      savePlanBtn.addEventListener(
        "click",
        () => {

          const moodKey =
            normalizeMood(
              currentMood
            );

          const data =
            recommendationData[
              moodKey
            ] ||
            fallbackRecommendation;

          const foods =
            data.foods;


          localStorage.setItem(
            "nutrimoodLatestRecommendation",
            JSON.stringify({
              mood: moodKey,
              foods: foods,
              benefits:
                data.benefits,
              tip:
                data.tip,
              date:
                new Date().toLocaleString()
            })
          );


          const history =
            JSON.parse(
              localStorage.getItem(
                "nutrimoodHistory"
              )
            ) || [];


          history.unshift({

            type: "food",

            title:
              `Food Plan Saved: ${moodKey}`,

            date:
              new Date().toLocaleString(),

            details:
              foods
                .map(
                  (food) =>
                    food[1]
                )
                .join(", ")
          });


          localStorage.setItem(
            "nutrimoodHistory",
            JSON.stringify(
              history
            )
          );


          savePlanBtn.textContent =
            "Saved Successfully";


          setTimeout(
            () => {

              savePlanBtn.textContent =
                "Save Plan";

            },
            1600
          );
        }
      );
    }


    /* =========================
       INITIAL RENDER
    ========================= */

    renderRecommendation(
      currentMood
    );

  }
);
