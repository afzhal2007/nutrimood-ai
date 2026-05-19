// Settings page scripts
// ================= NUTRIMOOD AI - SETTINGS JS =================

document.addEventListener("DOMContentLoaded", () => {
  const settingsThemeBtn = document.getElementById("settingsThemeBtn");
  const clearDataBtn = document.getElementById("clearDataBtn");
  const settingsLogoutBtn = document.getElementById("settingsLogoutBtn");

  if (settingsThemeBtn) {
    settingsThemeBtn.addEventListener("click", () => {
      const currentTheme = document.documentElement.getAttribute("data-theme");
      const newTheme = currentTheme === "dark" ? "light" : "dark";

      document.documentElement.setAttribute("data-theme", newTheme);
      localStorage.setItem("nutrimoodTheme", newTheme);
    });
  }

  if (clearDataBtn) {
    clearDataBtn.addEventListener("click", () => {
      const confirmClear = confirm("Clear mood, chat, scan, and history data?");

      if (!confirmClear) return;

      localStorage.removeItem("nutrimoodHistory");
      localStorage.removeItem("nutrimoodChats");
      localStorage.removeItem("nutrimoodLatestMood");
      localStorage.removeItem("nutrimoodLatestRecommendation");
      localStorage.removeItem("nutrimoodRoundScore");

      alert("NutriMood AI history data cleared.");
    });
  }

  if (settingsLogoutBtn) {
    settingsLogoutBtn.addEventListener("click", () => {
      const user = JSON.parse(localStorage.getItem("nutrimoodUser")) || null;

      if (user) {
        localStorage.setItem(
          "nutrimoodUser",
          JSON.stringify({
            ...user,
            loggedIn: false
          })
        );
      }

      window.location.href = "index.html";
    });
  }
});