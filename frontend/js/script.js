// Global frontend scripts
// ================= NUTRIMOOD AI - HOMEPAGE SCRIPT =================

document.addEventListener("DOMContentLoaded", function () {
  // ================= THEME SETUP =================
  const html = document.documentElement;
  const savedTheme = localStorage.getItem("nutrimoodTheme") || "dark";
  html.setAttribute("data-theme", savedTheme);

  const themeToggle = document.getElementById("themeToggle");

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      const currentTheme = html.getAttribute("data-theme");
      const newTheme = currentTheme === "dark" ? "light" : "dark";

      html.setAttribute("data-theme", newTheme);
      localStorage.setItem("nutrimoodTheme", newTheme);
    });
  }

  // ================= MOBILE NAVBAR =================
  const menuBtn = document.getElementById("menuBtn");
  const navLinks = document.getElementById("navLinks");

  if (menuBtn && navLinks) {
    menuBtn.addEventListener("click", function () {
      navLinks.classList.toggle("active");
      menuBtn.classList.toggle("active");
      document.body.classList.toggle("menu-open", navLinks.classList.contains("active"));
    });

    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navLinks.classList.remove("active");
        menuBtn.classList.remove("active");
        document.body.classList.remove("menu-open");
      });
    });
  }

  // ================= ACTIVE NAV LINK ON SCROLL =================
  const sections = document.querySelectorAll("section[id]");
  const navbarLinks = document.querySelectorAll(".nav-links a");

  function updateActiveNav() {
    let currentSection = "";

    sections.forEach(function (section) {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;

      if (
        window.scrollY >= sectionTop &&
        window.scrollY < sectionTop + sectionHeight
      ) {
        currentSection = section.getAttribute("id");
      }
    });

    navbarLinks.forEach(function (link) {
      link.classList.remove("active");

      if (link.getAttribute("href") === "#" + currentSection) {
        link.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", updateActiveNav);

  // ================= MOOD DATA =================
  const moodFoods = {
    Happy: {
      icon: "😊",
      confidence: "92%",
      foods: [
        {
          emoji: "🥑",
          name: "Avocado",
          desc: "Healthy fats for energy and focus."
        },
        {
          emoji: "🍫",
          name: "Dark Chocolate",
          desc: "Helps boost mood and feel-good vibes."
        },
        {
          emoji: "🫐",
          name: "Blueberries",
          desc: "Antioxidants for brain health."
        },
        {
          emoji: "🥜",
          name: "Nuts",
          desc: "Supports steady energy."
        }
      ]
    },

    Sad: {
      icon: "😔",
      confidence: "84%",
      foods: [
        {
          emoji: "🍌",
          name: "Banana",
          desc: "Natural mood support and quick energy."
        },
        {
          emoji: "🥛",
          name: "Milk",
          desc: "Comfort drink with useful nutrients."
        },
        {
          emoji: "🍫",
          name: "Dark Chocolate",
          desc: "Supports feel-good mood."
        },
        {
          emoji: "🌰",
          name: "Walnuts",
          desc: "Healthy fats for brain support."
        }
      ]
    },

    Stress: {
      icon: "😣",
      confidence: "88%",
      foods: [
        {
          emoji: "🍵",
          name: "Green Tea",
          desc: "Calming and refreshing drink."
        },
        {
          emoji: "🥜",
          name: "Almonds",
          desc: "Magnesium and healthy fats."
        },
        {
          emoji: "🥣",
          name: "Oats",
          desc: "Steady energy release."
        },
        {
          emoji: "🍌",
          name: "Banana",
          desc: "Simple mood-friendly fruit."
        }
      ]
    },

    Tired: {
      icon: "😴",
      confidence: "86%",
      foods: [
        {
          emoji: "🍌",
          name: "Banana",
          desc: "Quick energy boost."
        },
        {
          emoji: "🌴",
          name: "Dates",
          desc: "Natural sugar and energy."
        },
        {
          emoji: "🥚",
          name: "Egg",
          desc: "Protein support for energy."
        },
        {
          emoji: "💧",
          name: "Water",
          desc: "Hydration helps tiredness."
        }
      ]
    },

    Angry: {
      icon: "😡",
      confidence: "82%",
      foods: [
        {
          emoji: "🥒",
          name: "Cucumber",
          desc: "Cooling and hydrating food."
        },
        {
          emoji: "🍵",
          name: "Herbal Tea",
          desc: "Calm and relaxing drink."
        },
        {
          emoji: "🥛",
          name: "Curd",
          desc: "Cooling food option."
        },
        {
          emoji: "🍉",
          name: "Watermelon",
          desc: "Hydrating and light."
        }
      ]
    },

    Neutral: {
      icon: "🙂",
      confidence: "80%",
      foods: [
        {
          emoji: "🍎",
          name: "Apple",
          desc: "Light and healthy snack."
        },
        {
          emoji: "🥗",
          name: "Salad",
          desc: "Balanced nutrition."
        },
        {
          emoji: "🥣",
          name: "Oats",
          desc: "Good daily energy."
        },
        {
          emoji: "🥜",
          name: "Nuts",
          desc: "Healthy fats and focus."
        }
      ]
    }
  };

  // ================= HOMEPAGE MOOD SELECTION =================
  const moodCards = document.querySelectorAll(".mood-card");
  const selectedMood = document.getElementById("selectedMood");
  const detectedMood = document.getElementById("detectedMood");
  const detectedIcon = document.getElementById("detectedIcon");
  const foodList = document.getElementById("foodList");

  function updateMoodPreview(mood) {
    const data = moodFoods[mood];

    if (!data) return;

    if (selectedMood) {
      selectedMood.textContent = mood;
    }

    if (detectedMood) {
      detectedMood.textContent = mood;
    }

    if (detectedIcon) {
      detectedIcon.textContent = data.icon;
    }

    const confidenceText = document.querySelector(".detected-card span");

    if (confidenceText) {
      confidenceText.textContent = "Confidence Preview: " + data.confidence;
    }

    if (foodList) {
      foodList.innerHTML = data.foods
        .map(function (food) {
          return `
            <div class="food-card">
              <div class="food-emoji">${food.emoji}</div>
              <h3>${food.name}</h3>
              <p>${food.desc}</p>
            </div>
          `;
        })
        .join("");
    }

    localStorage.setItem("nutrimoodPreviewMood", mood);
  }

  moodCards.forEach(function (card) {
    card.addEventListener("click", function () {
      moodCards.forEach(function (item) {
        item.classList.remove("active");
      });

      card.classList.add("active");

      const mood = card.getAttribute("data-mood") || "Happy";
      updateMoodPreview(mood);
    });
  });

  const savedPreviewMood = localStorage.getItem("nutrimoodPreviewMood") || "Happy";
  updateMoodPreview(savedPreviewMood);

  moodCards.forEach(function (card) {
    if (card.getAttribute("data-mood") === savedPreviewMood) {
      card.classList.add("active");
    } else {
      card.classList.remove("active");
    }
  });

  // ================= SMOOTH SCROLL FIX =================
  const smoothLinks = document.querySelectorAll('a[href^="#"]');

  smoothLinks.forEach(function (link) {
    link.addEventListener("click", function (e) {
      const targetId = link.getAttribute("href");

      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        e.preventDefault();

        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    });
  });

  // ================= SIMPLE SCROLL REVEAL ANIMATION =================
  const revealElements = document.querySelectorAll(
    ".feature-card, .mood-card, .food-card, .step-card, .stat-card, .detected-card, .chat-preview"
  );

  function revealOnScroll() {
    revealElements.forEach(function (element) {
      const elementTop = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;

      if (elementTop < windowHeight - 80) {
        element.classList.add("show");
      }
    });
  }

  window.addEventListener("scroll", revealOnScroll);
  revealOnScroll();

  // ================= GET STARTED CHECK =================
  const getStartedButtons = document.querySelectorAll(
    'a[href="login.html"], .nav-btn, .floating-bot'
  );

  getStartedButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      localStorage.setItem("nutrimoodStarted", "true");
    });
  });
});



// ================= FLOATING LUCKY BOT HANDLER =================
function setupFloatingLuckyBot() {
  const bot = document.getElementById("floatingLuckyBot");

  if (!bot) return;

  bot.addEventListener("click", function () {
    const user = JSON.parse(localStorage.getItem("nutrimoodUser")) || null;

    if (user && user.loggedIn) {
      window.location.href = "lucky-ai.html";
    } else {
      window.location.href = "login.html";
    }
  });
}

setupFloatingLuckyBot();



