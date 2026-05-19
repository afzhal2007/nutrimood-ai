// Dashboard page scripts
// ================= NUTRIMOOD AI - DASHBOARD JS =================

document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("nutrimoodUser")) || {};
  const latestMood = JSON.parse(localStorage.getItem("nutrimoodLatestMood")) || null;
  const chats = JSON.parse(localStorage.getItem("nutrimoodChats")) || [];
  const history = JSON.parse(localStorage.getItem("nutrimoodHistory")) || [];

  const userNameEl = document.getElementById("dashboardUserName");
  const profileNameEl = document.getElementById("profileName");
  const profileEmailEl = document.getElementById("profileEmail");
  const profileAvatarLarge = document.getElementById("profileAvatarLarge");
  const currentMoodEl = document.getElementById("currentMood");
  const todayMoodText = document.getElementById("todayMoodText");
  const aiChatsCount = document.getElementById("aiChatsCount");
  const moodStreak = document.getElementById("moodStreak");
  const nutritionScore = document.getElementById("nutritionScore");
  const todayFoods = document.getElementById("todayFoods");

  const name = user.name || "User";
  const email = user.email || "demo@gmail.com";

  if (userNameEl) userNameEl.textContent = `${name} 👋`;
  if (profileNameEl) profileNameEl.textContent = name;
  if (profileEmailEl) profileEmailEl.textContent = email;
  if (profileAvatarLarge) profileAvatarLarge.textContent = name.charAt(0).toUpperCase();

  if (latestMood) {
    if (currentMoodEl) currentMoodEl.textContent = latestMood.mood;
    if (todayMoodText) todayMoodText.textContent = latestMood.mood;
  }

  if (aiChatsCount) aiChatsCount.textContent = chats.length;
  if (moodStreak) moodStreak.textContent = `${Math.min(history.length || 1, 7)} Days`;

  const score = JSON.parse(localStorage.getItem("nutrimoodRoundScore")) || { roundScore: 82 };
  if (nutritionScore) nutritionScore.textContent = `${score.roundScore || 82}%`;

  const foodsByMood = {
    Happy: [
      ["🥑", "Avocado", "Healthy fats and focus"],
      ["🍫", "Dark Chocolate", "Feel-good mood support"],
      ["🫐", "Blueberries", "Brain health support"]
    ],
    Sad: [
      ["🍌", "Banana", "Natural mood support"],
      ["🥛", "Milk", "Comfort and nutrients"],
      ["🌰", "Walnuts", "Brain healthy fats"]
    ],
    Stress: [
      ["🍵", "Green Tea", "Calm and refresh"],
      ["🥜", "Almonds", "Magnesium support"],
      ["🥣", "Oats", "Steady energy"]
    ],
    Tired: [
      ["🍌", "Banana", "Quick energy support"],
      ["🌴", "Dates", "Natural energy"],
      ["💧", "Water", "Hydration support"]
    ],
    Angry: [
      ["🥒", "Cucumber", "Cooling and light"],
      ["🍵", "Herbal Tea", "Calm support"],
      ["🥛", "Curd", "Cooling food"]
    ],
    Neutral: [
      ["🍎", "Apple", "Light healthy snack"],
      ["🥗", "Salad", "Balanced nutrition"],
      ["🥣", "Oats", "Daily energy"]
    ]
  };

  const mood = latestMood?.mood || "Neutral";
  const foods = foodsByMood[mood] || foodsByMood.Neutral;

  if (todayFoods) {
    todayFoods.innerHTML = foods
      .map(
        (food) => `
        <div class="today-food-card">
          <span>${food[0]}</span>
          <div>
            <h3>${food[1]}</h3>
            <p>${food[2]}</p>
          </div>
        </div>
      `
      )
      .join("");
  }
});