// History page scripts
// ================= NUTRIMOOD AI - HISTORY JS =================

document.addEventListener("DOMContentLoaded", () => {
  const historyList = document.getElementById("historyList");
  const clearHistoryBtn = document.getElementById("clearHistoryBtn");

  const moodCount = document.getElementById("moodCount");
  const foodCount = document.getElementById("foodCount");
  const chatCount = document.getElementById("chatCount");
  const scanCount = document.getElementById("scanCount");

  function loadHistory() {
    const history = JSON.parse(localStorage.getItem("nutrimoodHistory")) || [];

    const counts = {
      mood: 0,
      food: 0,
      chat: 0,
      scan: 0
    };

    history.forEach((item) => {
      if (counts[item.type] !== undefined) {
        counts[item.type]++;
      }
    });

    if (moodCount) moodCount.textContent = counts.mood;
    if (foodCount) foodCount.textContent = counts.food;
    if (chatCount) chatCount.textContent = counts.chat;
    if (scanCount) scanCount.textContent = counts.scan;

    if (!historyList) return;

    if (history.length === 0) {
      historyList.innerHTML = `
        <div class="score-history-item">
          <span>No history yet</span>
          <strong>Start mood check</strong>
        </div>
      `;
      return;
    }

    historyList.innerHTML = history
      .map(
        (item) => `
        <div class="score-history-item">
          <span>
            <strong>${getIcon(item.type)} ${item.title}</strong><br>
            ${item.details || ""}
          </span>
          <strong>${item.date}</strong>
        </div>
      `
      )
      .join("");
  }

  function getIcon(type) {
    const icons = {
      mood: "🧠",
      food: "🥗",
      chat: "🤖",
      scan: "🍱",
      profile: "👤",
      account: "🔐",
      instructions: "📘"
    };

    return icons[type] || "✨";
  }

  if (clearHistoryBtn) {
    clearHistoryBtn.addEventListener("click", () => {
      const confirmClear = confirm("Are you sure you want to clear all history?");

      if (!confirmClear) return;

      localStorage.removeItem("nutrimoodHistory");
      loadHistory();
    });
  }

  loadHistory();
});