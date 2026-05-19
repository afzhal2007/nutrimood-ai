// Auth page scripts
// ================= NUTRIMOOD AI - AUTH JS =================

const AUTH_API = "http://localhost:5000/api/auth";

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

const currentPage = window.location.pathname.split("/").pop() || "index.html";

function getUser() {
  return JSON.parse(localStorage.getItem("nutrimoodUser")) || null;
}

function saveUser(user) {
  localStorage.setItem("nutrimoodUser", JSON.stringify(user));
}

function updateUserInUsers(updatedUser) {
  const users = JSON.parse(localStorage.getItem("nutrimoodUsers")) || [];
  const updatedUsers = users.map((user) => {
    if (user.email === updatedUser.email) {
      return {
        ...user,
        ...updatedUser
      };
    }
    return user;
  });

  const exists = updatedUsers.some((user) => user.email === updatedUser.email);

  if (!exists) {
    updatedUsers.push(updatedUser);
  }

  localStorage.setItem("nutrimoodUsers", JSON.stringify(updatedUsers));
  localStorage.setItem("nutrimoodUser", JSON.stringify(updatedUser));
}

function addHistory(item) {
  const history = JSON.parse(localStorage.getItem("nutrimoodHistory")) || [];
  history.unshift({
    ...item,
    date: new Date().toLocaleString()
  });
  localStorage.setItem("nutrimoodHistory", JSON.stringify(history));
}

function showMessage(elementId, message, type = "success") {
  const el = document.getElementById(elementId);
  if (!el) return;

  el.textContent = message;
  el.style.color = type === "success" ? "#22c55e" : "#ef4444";
}

function applyTheme() {
  const savedTheme = localStorage.getItem("nutrimoodTheme") || "dark";
  document.documentElement.setAttribute("data-theme", savedTheme);
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

function checkProtectedPage() {
  if (!protectedPages.includes(currentPage)) return;

  const user = getUser();

  if (!user || !user.loggedIn) {
    window.location.href = "login.html";
  }
}

function redirectLoggedInUser() {
  const user = getUser();

  if (currentPage === "login.html" && user && user.loggedIn) {
    window.location.href = "dashboard.html";
  }
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
    formTitle.textContent = "Login";
    formSubtitle.textContent = "Enter your details to continue.";
  });

  signupTab.addEventListener("click", () => {
    signupTab.classList.add("active");
    loginTab.classList.remove("active");
    signupForm.classList.remove("hidden");
    loginForm.classList.add("hidden");
    formTitle.textContent = "Create Account";
    formSubtitle.textContent = "Signup to start your mood nutrition journey.";
  });

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    (async () => {
      const email = document.getElementById("loginEmail").value.trim();
      const password = document.getElementById("loginPassword").value.trim();

      if (!email || !password) {
        showMessage("authMessage", "Please enter email and password.", "error");
        return;
      }

      try {
        const res = await fetch(`${AUTH_API}/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ email, password })
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          showMessage("authMessage", err.error || "Login failed.", "error");
          return;
        }

        const data = await res.json();

        if (!data.ok) {
          showMessage("authMessage", data.error || "Login failed.", "error");
          return;
        }

        localStorage.setItem("nutrimoodToken", data.token);
        const userObj = { ...data.user, loggedIn: true };
        localStorage.setItem("nutrimoodUser", JSON.stringify(userObj));

        showMessage("authMessage", "Login successful!");

        setTimeout(() => {
          window.location.href = "dashboard.html";
        }, 700);
      } catch (error) {
        showMessage("authMessage", "Backend connection failed. Please start backend server.", "error");
      }
    })();
  });

  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();

    (async () => {
      const name = document.getElementById("signupName").value.trim();
      const email = document.getElementById("signupEmail").value.trim();
      const password = document.getElementById("signupPassword").value.trim();
      const confirmPassword = document.getElementById("confirmPassword").value.trim();

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
        const res = await fetch(`${AUTH_API}/signup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password })
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          showMessage("authMessage", err.error || "Signup failed.", "error");
          return;
        }

        const data = await res.json();

        if (!data.ok) {
          showMessage("authMessage", data.error || "Signup failed.", "error");
          return;
        }

        localStorage.setItem("nutrimoodToken", data.token);
        localStorage.setItem("nutrimoodUser", JSON.stringify({ ...data.user, loggedIn: true }));

        addHistory({
          type: "account",
          title: "Account Created",
          details: `Welcome ${name}`
        });

        showMessage("authMessage", "Account created successfully!");

        setTimeout(() => {
          window.location.href = "basic-details.html";
        }, 700);
      } catch (error) {
        showMessage("authMessage", "Backend connection failed. Please start backend server.", "error");
      }
    })();
  });

  if (demoLoginBtn) {
    demoLoginBtn.addEventListener("click", () => {
      // Demo login: local-only demo user (does not persist to backend)
      const demoUser = {
        name: "Afzhal",
        email: "demo@nutrimood.ai",
        loggedIn: true,
        profileCompleted: false,
        instructionsCompleted: false
      };

      localStorage.setItem("nutrimoodUser", JSON.stringify(demoUser));

      addHistory({
        type: "account",
        title: "Demo Login",
        details: "User logged in using demo account."
      });

      if (!demoUser.profileCompleted) {
        window.location.href = "basic-details.html";
      } else if (!demoUser.instructionsCompleted) {
        window.location.href = "instructions.html";
      } else {
        window.location.href = "dashboard.html";
      }
    });
  }
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
  const logoutButtons = document.querySelectorAll("#logoutBtn, #settingsLogoutBtn");

  logoutButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Clear session items
      localStorage.removeItem("nutrimoodUser");
      localStorage.removeItem("nutrimoodToken");

      window.location.href = "index.html";
    });
  });
}

function setupSidebar() {
  const sidebar = document.getElementById("sidebar");
  const menuBtn = document.getElementById("dashboardMenuBtn");
  const overlay = document.getElementById("sidebarOverlay");

  if (!sidebar || !menuBtn || !overlay) return;

  menuBtn.addEventListener("click", () => {
    sidebar.classList.add("active");
    overlay.classList.add("active");
  });

  overlay.addEventListener("click", () => {
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
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

document.addEventListener("DOMContentLoaded", () => {
  applyTheme();
  checkProtectedPage();
  redirectLoggedInUser();
  setupThemeToggle();
  setupLoginSignup();
  setupPasswordToggle();
  setupLogout();
  setupSidebar();
  loadProfileInitial();
});