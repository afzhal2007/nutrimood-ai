// ================= NUTRIMOOD AI - AUTH JS =================

const AUTH_API = "https://nutrimood-ai.vercel.app/api/auth";

const protectedPages = [
  "dashboard.html",
  "mood-check.html",
  "recommendations.html",
  "food-scanner.html",
  "lucky-ai.html",
  "history.html",
  "round-score.html",
  "profile.html",
  "settings.html",
  "basic-details.html",
  "instructions.html"
];

function getCurrentPage() {
  const page = window.location.pathname.split("/").pop();
  return page || "index.html";
}

function getUser() {
  try {
    return JSON.parse(localStorage.getItem("nutrimoodUser")) || null;
  } catch {
    return null;
  }
}

function saveUser(user) {
  localStorage.setItem("nutrimoodUser", JSON.stringify(user));
}

function showMessage(elementId, message, type = "success") {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.textContent = message;
  el.style.color = type === "success" ? "#22c55e" : "#ef4444";
}

function addHistory(item) {
  const history = JSON.parse(localStorage.getItem("nutrimoodHistory")) || [];
  history.unshift({ ...item, date: new Date().toLocaleString() });
  localStorage.setItem("nutrimoodHistory", JSON.stringify(history));
}

function applyTheme() {
  const savedTheme = localStorage.getItem("nutrimoodTheme") || "dark";
  document.documentElement.setAttribute("data-theme", savedTheme);
}

function logoutUser() {
  console.log("Logout clicked");

  localStorage.removeItem("nutrimoodUser");
  localStorage.removeItem("nutrimoodToken");
  localStorage.removeItem("nutrimoodStarted");

  document.body.classList.remove("sidebar-open");

  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebarOverlay");

  if (sidebar) sidebar.classList.remove("active");
  if (overlay) overlay.classList.remove("active");

  window.location.replace("index.html");
}

window.logoutUser = logoutUser;

function ensureLogoutButton() {
  const sidebar = document.getElementById("sidebar");
  if (!sidebar) return;

  if (document.getElementById("logoutBtn")) return;

  let target = sidebar.querySelector(".sidebar-bottom");
  if (!target) {
    target = document.createElement("div");
    target.className = "sidebar-bottom";
    sidebar.appendChild(target);
  }

  const button = document.createElement("button");
  button.type = "button";
  button.id = "logoutBtn";
  button.className = "logout-btn";
  button.setAttribute("data-action", "logout");
  button.innerHTML = "<span>🚪</span> Logout";
  target.appendChild(button);
}

function checkProtectedPage() {
  const currentPage = getCurrentPage();
  if (!protectedPages.includes(currentPage)) return;

  const user = getUser();
  const token = localStorage.getItem("nutrimoodToken");

  if (!user || !user.loggedIn || !token) {
    localStorage.removeItem("nutrimoodUser");
    localStorage.removeItem("nutrimoodToken");
    window.location.replace("login.html");
  }
}

function redirectLoggedInUser() {
  const currentPage = getCurrentPage();
  const user = getUser();
  const token = localStorage.getItem("nutrimoodToken");

  if (currentPage === "login.html" && user && user.loggedIn && token) {
    window.location.replace("dashboard.html");
  }
}

function setupThemeToggle() {
  const toggles = document.querySelectorAll("#themeToggle, #settingsThemeBtn");
  toggles.forEach((btn) => {
    btn.addEventListener("click", () => {
      const currentTheme = document.documentElement.getAttribute("data-theme");
      const newTheme = currentTheme === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", newTheme);
      localStorage.setItem("nutrimoodTheme", newTheme);
    });
  });
}

function setupLoginSignup() {
  const loginTab = document.getElementById("loginTab");
  const signupTab = document.getElementById("signupTab");
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");
  const formTitle = document.getElementById("formTitle");
  const formSubtitle = document.getElementById("formSubtitle");
  const demoLoginBtn = document.getElementById("demoLoginBtn");

  if (!loginTab || !signupTab || !loginForm || !signupForm) return;

  loginTab.addEventListener("click", () => {
    loginTab.classList.add("active");
    signupTab.classList.remove("active");
    loginForm.classList.remove("hidden");
    signupForm.classList.add("hidden");
    if (formTitle) formTitle.textContent = "Login";
    if (formSubtitle) formSubtitle.textContent = "Enter your details to continue.";
  });

  signupTab.addEventListener("click", () => {
    signupTab.classList.add("active");
    loginTab.classList.remove("active");
    signupForm.classList.remove("hidden");
    loginForm.classList.add("hidden");
    if (formTitle) formTitle.textContent = "Create Account";
    if (formSubtitle) formSubtitle.textContent = "Signup to start your mood nutrition journey.";
  });

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail")?.value.trim();
    const password = document.getElementById("loginPassword")?.value.trim();

    if (!email || !password) {
      showMessage("authMessage", "Please enter email and password.", "error");
      return;
    }

    try {
      showMessage("authMessage", "Logging in...", "success");

      const response = await fetch(`${AUTH_API}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      console.log("Login response:", data);

      if (!response.ok || !data.ok) {
        showMessage("authMessage", data.error || "Login failed.", "error");
        return;
      }

      localStorage.setItem("nutrimoodToken", data.token);
      saveUser({ ...data.user, loggedIn: true });
      showMessage("authMessage", "Login successful!", "success");

      setTimeout(() => window.location.replace("dashboard.html"), 500);
    } catch (error) {
      console.error("Login error:", error);
      showMessage("authMessage", "Backend connection failed. Please try again.", "error");
    }
  });

  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("signupName")?.value.trim();
    const email = document.getElementById("signupEmail")?.value.trim();
    const password = document.getElementById("signupPassword")?.value.trim();
    const confirmPassword = document.getElementById("confirmPassword")?.value.trim();

    if (!name || !email || !password || !confirmPassword) {
      showMessage("authMessage", "Please fill all fields.", "error");
      return;
    }

    if (password.length < 6) {
      showMessage("authMessage", "Password must be at least 6 characters.", "error");
      return;
    }

    if (password !== confirmPassword) {
      showMessage("authMessage", "Passwords do not match.", "error");
      return;
    }

    try {
      showMessage("authMessage", "Creating account...", "success");

      const response = await fetch(`${AUTH_API}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });

      const data = await response.json();
      console.log("Signup response:", data);

      if (!response.ok || !data.ok) {
        showMessage("authMessage", data.error || "Signup failed.", "error");
        return;
      }

      localStorage.setItem("nutrimoodToken", data.token);
      saveUser({ ...data.user, loggedIn: true });
      showMessage("authMessage", "Account created successfully!", "success");

      setTimeout(() => window.location.replace("basic-details.html"), 500);
    } catch (error) {
      console.error("Signup error:", error);
      showMessage("authMessage", "Backend connection failed. Please try again.", "error");
    }
  });

  if (demoLoginBtn) {
    demoLoginBtn.addEventListener("click", () => {
      const demoUser = {
        id: "demo-user",
        name: "Afzhal",
        email: "demo@nutrimood.ai",
        loggedIn: true,
        profileCompleted: false,
        instructionsCompleted: false
      };

      localStorage.setItem("nutrimoodToken", "demo-token");
      saveUser(demoUser);
      addHistory({ type: "account", title: "Demo Login", details: "User logged in using demo account." });
      window.location.replace("basic-details.html");
    });
  }
}

function setupBasicDetails() {
  const form = document.getElementById("basicDetailsForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const user = getUser();
    const token = localStorage.getItem("nutrimoodToken");

    if (!user || !token) {
      window.location.replace("login.html");
      return;
    }

    const userId = user.id || user._id;
    const getValue = (id) => document.getElementById(id)?.value?.trim() || "";

    const profileData = {
      name: getValue("fullName") || getValue("name") || user.name,
      age: getValue("age"),
      gender: getValue("gender"),
      height: getValue("height"),
      weight: getValue("weight"),
      foodPreference: getValue("foodPreference"),
      healthGoal: getValue("healthGoal"),
      activityLevel: getValue("activityLevel"),
      commonMood: getValue("commonMood"),
      allergies: getValue("allergies") || "None"
    };

    if (!userId || userId === "demo-user") {
      saveUser({ ...user, ...profileData, profileCompleted: true, loggedIn: true });
      window.location.replace("instructions.html");
      return;
    }

    try {
      const response = await fetch(`${AUTH_API}/profile/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData)
      });

      const data = await response.json();
      if (!response.ok || !data.ok) {
        alert(data.error || "Profile update failed.");
        return;
      }

      saveUser({ ...data.user, loggedIn: true });
      window.location.replace("instructions.html");
    } catch (error) {
      console.error("Profile update error:", error);
      alert("Backend connection failed. Please try again.");
    }
  });
}

function setupInstructions() {
  const form = document.getElementById("instructionsForm");
  const btn = document.getElementById("acceptInstructionsBtn");

  const handler = async (e) => {
    e.preventDefault();

    const user = getUser();
    const token = localStorage.getItem("nutrimoodToken");

    if (!user || !token) {
      window.location.replace("login.html");
      return;
    }

    const userId = user.id || user._id;

    if (!userId || userId === "demo-user") {
      saveUser({ ...user, instructionsCompleted: true, loggedIn: true });
      window.location.replace("dashboard.html");
      return;
    }

    try {
      const response = await fetch(`${AUTH_API}/instructions/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" }
      });

      const data = await response.json();
      if (!response.ok || !data.ok) {
        alert(data.error || "Instructions update failed.");
        return;
      }

      saveUser({ ...user, ...data.user, loggedIn: true });
      window.location.replace("dashboard.html");
    } catch (error) {
      console.error("Instructions update error:", error);
      alert("Backend connection failed. Please try again.");
    }
  };

  if (form) form.addEventListener("submit", handler);
  if (btn) btn.addEventListener("click", handler);
}

function setupPasswordToggle() {
  const buttons = document.querySelectorAll(".password-toggle");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-target");
      const input = document.getElementById(targetId);
      if (!input) return;
      input.type = input.type === "password" ? "text" : "password";
    });
  });
}

function setupLogout() {
  document.addEventListener(
    "click",
    function (e) {
      const logoutBtn = e.target.closest("#logoutBtn, .logout-btn, [data-action='logout']");
      if (!logoutBtn) return;

      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      logoutUser();
    },
    true
  );
}

function setupSidebar() {
  const sidebar = document.getElementById("sidebar");
  const menuBtn = document.getElementById("dashboardMenuBtn");
  const overlay = document.getElementById("sidebarOverlay");

  if (!sidebar || !menuBtn || !overlay) return;

  function openSidebar() {
    sidebar.classList.add("active");
    overlay.classList.add("active");
    document.body.classList.add("sidebar-open");
  }

  function closeSidebar() {
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
    document.body.classList.remove("sidebar-open");
  }

  menuBtn.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    sidebar.classList.contains("active") ? closeSidebar() : openSidebar();
  });

  overlay.addEventListener("click", closeSidebar);

  sidebar.querySelectorAll(".side-link").forEach((link) => {
    link.addEventListener("click", closeSidebar);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeSidebar();
  });
}

function loadProfileInitial() {
  const user = getUser();
  const initialEls = document.querySelectorAll("#profileInitial");
  if (!user) return;

  initialEls.forEach((el) => {
    el.textContent = user.name ? user.name.charAt(0).toUpperCase() : "U";
  });
}

function setupFloatingLuckyBot() {
  const bot = document.getElementById("floatingLuckyBot");
  if (!bot) return;

  bot.addEventListener("click", function () {
    const user = getUser();
    window.location.href = user && user.loggedIn ? "lucky-ai.html" : "login.html";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  applyTheme();
  checkProtectedPage();
  redirectLoggedInUser();
  ensureLogoutButton();
  setupThemeToggle();
  setupLoginSignup();
  setupBasicDetails();
  setupInstructions();
  setupPasswordToggle();
  setupLogout();
  setupSidebar();
  loadProfileInitial();
  setupFloatingLuckyBot();
});
