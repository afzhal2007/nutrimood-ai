// ================= NUTRIMOOD AI - FINAL HOTFIX =================
// Fixes:
// 1. Mobile navbar links not clickable
// 2. Navbar menu open/close
// 3. Dashboard sidebar open/close
// 4. Logout button not working
// 5. Floating bot navigation

document.addEventListener("DOMContentLoaded", function () {
  setupMobileNavbarHotfix();
  setupDashboardSidebarHotfix();
  setupLogoutHotfix();
  setupFloatingBotHotfix();
});

// ================= MOBILE HOMEPAGE NAVBAR =================

function setupMobileNavbarHotfix() {
  const menuBtn = document.getElementById("menuBtn");
  const navLinks = document.getElementById("navLinks");

  if (!menuBtn || !navLinks) return;

  menuBtn.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();

    menuBtn.classList.toggle("active");
    navLinks.classList.toggle("active");
    document.body.classList.toggle("menu-open", navLinks.classList.contains("active"));
  });

  navLinks.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      menuBtn.classList.remove("active");
      navLinks.classList.remove("active");
      document.body.classList.remove("menu-open");

      const href = link.getAttribute("href");

      if (!href) return;

      if (href.startsWith("#")) {
        const target = document.querySelector(href);

        if (target) {
          setTimeout(function () {
            target.scrollIntoView({
              behavior: "smooth",
              block: "start"
            });
          }, 100);
        }
      }
    });
  });

  document.addEventListener("click", function (e) {
    if (!menuBtn.contains(e.target) && !navLinks.contains(e.target)) {
      menuBtn.classList.remove("active");
      navLinks.classList.remove("active");
      document.body.classList.remove("menu-open");
    }
  });
}

// ================= DASHBOARD SIDEBAR =================

function setupDashboardSidebarHotfix() {
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

    if (sidebar.classList.contains("active")) {
      closeSidebar();
    } else {
      openSidebar();
    }
  });

  overlay.addEventListener("click", function () {
    closeSidebar();
  });

  sidebar.querySelectorAll(".side-link").forEach(function (link) {
    link.addEventListener("click", function () {
      closeSidebar();
    });
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeSidebar();
    }
  });
}

// ================= LOGOUT FIX =================

function logoutUserFinal() {
  console.log("Logout clicked");

  localStorage.removeItem("nutrimoodUser");
  localStorage.removeItem("nutrimoodToken");
  localStorage.removeItem("nutrimoodStarted");

  document.body.classList.remove("sidebar-open");

  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebarOverlay");

  if (sidebar) sidebar.classList.remove("active");
  if (overlay) overlay.classList.remove("active");

  window.location.href = "index.html";
}

window.logoutUser = logoutUserFinal;

function setupLogoutHotfix() {
  document.addEventListener(
    "click",
    function (e) {
      const logoutBtn = e.target.closest(
        "#logoutBtn, .logout-btn, [data-action='logout']"
      );

      if (!logoutBtn) return;

      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();

      logoutUserFinal();
    },
    true
  );
}

// ================= FLOATING BOT FIX =================

function setupFloatingBotHotfix() {
  const bot = document.getElementById("floatingLuckyBot");

  if (!bot) return;

  bot.addEventListener("click", function () {
    const user = JSON.parse(localStorage.getItem("nutrimoodUser") || "null");

    if (user && user.loggedIn) {
      window.location.href = "lucky-ai.html";
    } else {
      window.location.href = "login.html";
    }
  });
}