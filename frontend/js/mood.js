// Mood check page scripts
// ================= NUTRIMOOD AI - MOOD JS =================

let cameraStream = null;
let selectedMood = "Happy";
let selectedIcon = "😊";

const moodData = {
  Happy: { icon: "😊", confidence: 92 },
  Sad: { icon: "😔", confidence: 84 },
  Stress: { icon: "😣", confidence: 88 },
  Tired: { icon: "😴", confidence: 86 },
  Angry: { icon: "😡", confidence: 82 },
  Neutral: { icon: "🙂", confidence: 80 }
};

function updateMoodResult(mood, icon, face = 0, voice = 0, self = 92) {
  selectedMood = mood;
  selectedIcon = icon;

  const finalConfidence = Math.round((face + voice + self) / 3);

  document.getElementById("resultIcon").textContent = icon;
  document.getElementById("resultMood").textContent = mood;
  document.getElementById("resultConfidence").textContent =
    `Confidence: ${finalConfidence || self}%`;

  updateBar("faceConfidenceText", "faceConfidenceBar", face);
  updateBar("voiceConfidenceText", "voiceConfidenceBar", voice);
  updateBar("selfConfidenceText", "selfConfidenceBar", self);
}

function updateBar(textId, barId, value) {
  const text = document.getElementById(textId);
  const bar = document.getElementById(barId);

  if (text) text.textContent = `${value}%`;
  if (bar) bar.style.width = `${value}%`;
}

function analyzeTextMood(text) {
  const t = text.toLowerCase();

  if (t.includes("sad") || t.includes("low") || t.includes("cry") || t.includes("upset")) {
    return "Sad";
  }

  if (t.includes("stress") || t.includes("pressure") || t.includes("tense")) {
    return "Stress";
  }

  if (t.includes("tired") || t.includes("sleep") || t.includes("weak")) {
    return "Tired";
  }

  if (t.includes("angry") || t.includes("mad") || t.includes("irritated")) {
    return "Angry";
  }

  if (t.includes("happy") || t.includes("good") || t.includes("excited")) {
    return "Happy";
  }

  return "Neutral";
}

document.addEventListener("DOMContentLoaded", () => {
  const cameraVideo = document.getElementById("cameraVideo");
  const cameraPlaceholder = document.getElementById("cameraPlaceholder");
  const openCameraBtn = document.getElementById("openCameraBtn");
  const startCameraBtn = document.getElementById("startCameraBtn");
  const stopCameraBtn = document.getElementById("stopCameraBtn");
  const captureMoodBtn = document.getElementById("captureMoodBtn");
  const analyzeTextBtn = document.getElementById("analyzeTextBtn");
  const listenBtn = document.getElementById("listenBtn");
  const moodTextInput = document.getElementById("moodTextInput");
  const saveMoodBtn = document.getElementById("saveMoodBtn");
  const moodMessage = document.getElementById("moodMessage");

  const selfMoodCards = document.querySelectorAll(".self-mood-card");

  async function startCamera() {
    try {
      cameraStream = await navigator.mediaDevices.getUserMedia({ video: true });
      cameraVideo.srcObject = cameraStream;
      cameraVideo.style.display = "block";
      cameraPlaceholder.style.display = "none";
    } catch (error) {
      moodMessage.textContent = "Camera permission denied or not available.";
      moodMessage.style.color = "#ef4444";
    }
  }

  function stopCamera() {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      cameraStream = null;
    }

    cameraVideo.style.display = "none";
    cameraPlaceholder.style.display = "grid";
  }

  if (openCameraBtn) openCameraBtn.addEventListener("click", startCamera);
  if (startCameraBtn) startCameraBtn.addEventListener("click", startCamera);
  if (stopCameraBtn) stopCameraBtn.addEventListener("click", stopCamera);

  if (captureMoodBtn) {
    captureMoodBtn.addEventListener("click", () => {
      const moods = Object.keys(moodData);
      const randomMood = moods[Math.floor(Math.random() * moods.length)];
      const data = moodData[randomMood];

      updateMoodResult(randomMood, data.icon, data.confidence, 0, 90);

      moodMessage.textContent = `Face analysis demo result: ${randomMood}`;
      moodMessage.style.color = "#22c55e";
    });
  }

  selfMoodCards.forEach((card) => {
    card.addEventListener("click", () => {
      selfMoodCards.forEach((c) => c.classList.remove("active"));
      card.classList.add("active");

      const mood = card.dataset.mood;
      const icon = card.dataset.icon;
      const confidence = moodData[mood]?.confidence || 90;

      updateMoodResult(mood, icon, 0, 0, confidence);
    });
  });

  if (analyzeTextBtn) {
    analyzeTextBtn.addEventListener("click", () => {
      const text = moodTextInput.value.trim();

      if (!text) {
        moodMessage.textContent = "Please type how you feel.";
        moodMessage.style.color = "#ef4444";
        return;
      }

      const mood = analyzeTextMood(text);
      const data = moodData[mood];

      updateMoodResult(mood, data.icon, 0, data.confidence, 90);

      moodMessage.textContent = `Text analysis result: ${mood}`;
      moodMessage.style.color = "#22c55e";
    });
  }

  if (listenBtn) {
    listenBtn.addEventListener("click", () => {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

      if (!SpeechRecognition) {
        moodMessage.textContent = "Speech recognition not supported in this browser.";
        moodMessage.style.color = "#ef4444";
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.start();

      moodMessage.textContent = "Listening...";
      moodMessage.style.color = "#22c55e";

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        moodTextInput.value = transcript;

        const mood = analyzeTextMood(transcript);
        const data = moodData[mood];

        updateMoodResult(mood, data.icon, 0, data.confidence, 90);
      };
    });
  }

  if (saveMoodBtn) {
    saveMoodBtn.addEventListener("click", () => {
      const latestMood = {
        mood: selectedMood,
        icon: selectedIcon,
        confidence: moodData[selectedMood]?.confidence || 86,
        date: new Date().toLocaleString()
      };

      localStorage.setItem("nutrimoodLatestMood", JSON.stringify(latestMood));

      const history = JSON.parse(localStorage.getItem("nutrimoodHistory")) || [];
      history.unshift({
        type: "mood",
        title: `Mood Saved: ${selectedMood}`,
        date: new Date().toLocaleString(),
        details: `Confidence: ${latestMood.confidence}%`
      });
      localStorage.setItem("nutrimoodHistory", JSON.stringify(history));

      localStorage.setItem(
        "nutrimoodRoundScore",
        JSON.stringify({
          roundScore: latestMood.confidence,
          moodAccuracy: latestMood.confidence,
          nutritionMatch: latestMood.confidence - 4,
          aiGuidance: latestMood.confidence + 2,
          mood: selectedMood,
          icon: selectedIcon
        })
      );

      moodMessage.textContent = "Mood saved successfully!";
      moodMessage.style.color = "#22c55e";
    });
  }

  updateMoodResult("Happy", "😊", 0, 0, 92);
});