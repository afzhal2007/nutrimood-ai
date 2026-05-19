// ================= NUTRIMOOD AI - FINAL COMMON MOBILE NAV FIX =================

(function () {
  function byId(id) {
    return document.getElementById(id);
  }

  function closePublicNav() {
    const menuBtn = byId("menuBtn");
    const navLinks = byId("navLinks");

    if (menuBtn) menuBtn.classList.remove("active");
    if (navLinks) navLinks.classList.remove("active");

    document.body.classList.remove("menu-open");
  }

  function openSidebar() {
    const sidebar = byId("sidebar");
    const overlay = byId("sidebarOverlay");

    if (!sidebar || !overlay) return;

    sidebar.classList.add("active");
    overlay.classList.add("active");
    document.body.classList.add("sidebar-open");

    sidebar.style.left = "0";
    sidebar.style.opacity = "1";
    sidebar.style.visibility = "visible";
    sidebar.style.pointerEvents = "auto";

    overlay.style.opacity = "1";
    overlay.style.pointerEvents = "auto";

    document.body.style.overflow = "hidden";
  }

  function closeSidebar() {
    const sidebar = byId("sidebar");
    const overlay = byId("sidebarOverlay");

    if (sidebar) {
      sidebar.classList.remove("active");
      sidebar.style.left = "-100%";
    }

    if (overlay) {
      overlay.classList.remove("active");
      overlay.style.opacity = "0";
      overlay.style.pointerEvents = "none";
    }

    document.body.classList.remove("sidebar-open");
    document.body.style.overflow = "";
  }

  window.openSideNow = function (event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    openSidebar();
  };

  window.closeSideNow = function (event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    closeSidebar();
  };

  window.logoutNow = function (event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    localStorage.removeItem("nutrimoodUser");
    localStorage.removeItem("nutrimoodToken");
    localStorage.removeItem("nutrimoodStarted");

    closeSidebar();

    window.location.href = "index.html";
  };

  function setupPublicNavbar() {
    const menuBtn = byId("menuBtn");
    const navLinks = byId("navLinks");

    if (!menuBtn || !navLinks) return;

    menuBtn.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();

      menuBtn.classList.toggle("active");
      navLinks.classList.toggle("active");

      document.body.classList.toggle(
        "menu-open",
        navLinks.classList.contains("active")
      );
    });

    document.addEventListener(
      "click",
      function (event) {
        const link = event.target.closest(".nav-links a, .nav-btn");

        if (!link) return;

        const href = link.getAttribute("href");
        if (!href) return;

        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();

        closePublicNav();

        window.location.href = href;
      },
      true
    );
  }

  function setupDashboardSidebar() {
    const menuBtn = byId("dashboardMenuBtn");
    const overlay = byId("sidebarOverlay");

    if (menuBtn) {
      menuBtn.addEventListener(
        "click",
        function (event) {
          event.preventDefault();
          event.stopPropagation();

          const sidebar = byId("sidebar");

          if (sidebar && sidebar.classList.contains("active")) {
            closeSidebar();
          } else {
            openSidebar();
          }
        },
        true
      );
    }

    if (overlay) {
      overlay.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        closeSidebar();
      });
    }

    document.addEventListener(
      "click",
      function (event) {
        const logoutBtn = event.target.closest(
          "#logoutBtn, .logout-btn, [data-action='logout']"
        );

        if (!logoutBtn) return;

        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();

        window.logoutNow(event);
      },
      true
    );

    document.addEventListener(
      "click",
      function (event) {
        const link = event.target.closest(".side-link");

        if (!link) return;

        const href = link.getAttribute("href");
        if (!href) return;

        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();

        closeSidebar();

        setTimeout(function () {
          window.location.href = href;
        }, 50);
      },
      true
    );
  }

  function setupFloatingBot() {
    const bot = byId("floatingLuckyBot");

    if (!bot) return;

    bot.addEventListener("click", function (event) {
      event.preventDefault();

      const user = JSON.parse(localStorage.getItem("nutrimoodUser") || "null");

      if (user && user.loggedIn) {
        window.location.href = "lucky-ai.html";
      } else {
        window.location.href = "login.html";
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    setupPublicNavbar();
    setupDashboardSidebar();
    setupFloatingBot();

    console.log("mobile-nav-fix.js loaded successfully");
  });
})();
