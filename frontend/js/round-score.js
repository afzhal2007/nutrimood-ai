// Round score page scripts
// ================= NUTRIMOOD AI - ROUND SCORE JS =================

document.addEventListener("DOMContentLoaded", () => {
  const latestMood = JSON.parse(localStorage.getItem("nutrimoodLatestMood")) || {
    mood: "Happy",
    icon: "😊",
    confidence: 86
  };

  const savedScore = JSON.parse(localStorage.getItem("nutrimoodRoundScore")) || {};

  const roundScore = savedScore.roundScore || latestMood.confidence || 86;
  const moodAccuracy = savedScore.moodAccuracy || roundScore;
  const nutritionMatch = savedScore.nutritionMatch || Math.max(roundScore - 4, 70);
  const aiGuidance = savedScore.aiGuidance || Math.min(roundScore + 3, 99);

  setText("roundScoreText", `${roundScore}%`);
  setText("scoreNumber", roundScore);
  setText("moodAccuracy", `${moodAccuracy}%`);
  setText("nutritionMatch", `${nutritionMatch}%`);
  setText("aiGuidance", `${aiGuidance}%`);
  setText("latestMood", latestMood.mood);
  setText("latestMoodConfidence", `Confidence: ${latestMood.confidence || roundScore}%`);

  const latestMoodIcon = document.getElementById("latestMoodIcon");
  if (latestMoodIcon) latestMoodIcon.textContent = latestMood.icon || "😊";

  const scoreFeedback = document.getElementById("scoreFeedback");

  if (scoreFeedback) {
    if (roundScore >= 90) {
      scoreFeedback.textContent = "Excellent! Your mood result and food match are very strong.";
    } else if (roundScore >= 75) {
      scoreFeedback.textContent = "Great progress! Your mood check and food recommendation match looks balanced.";
    } else {
      scoreFeedback.textContent = "Good start! Try self-check with face/voice analysis for better accuracy.";
    }
  }

  const scoreData = {
    roundScore,
    moodAccuracy,
    nutritionMatch,
    aiGuidance,
    mood: latestMood.mood,
    icon: latestMood.icon
  };

  localStorage.setItem("nutrimoodRoundScore", JSON.stringify(scoreData));
});

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}