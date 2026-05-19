// Food scanner page scripts
// ================= NUTRIMOOD AI - SCANNER JS =================

document.addEventListener("DOMContentLoaded", () => {
  const foodImageInput = document.getElementById("foodImageInput");
  const foodPreview = document.getElementById("foodPreview");
  const previewPlaceholder = document.getElementById("previewPlaceholder");
  const scanFoodBtn = document.getElementById("scanFoodBtn");
  const scannerMessage = document.getElementById("scannerMessage");

  const calories = document.getElementById("calories");
  const protein = document.getElementById("protein");
  const carbs = document.getElementById("carbs");
  const fat = document.getElementById("fat");

  let selectedFile = null;

  const foodDatabase = [
    {
      keywords: ["idli", "idly"],
      name: "Idli",
      category: "Tamil / South Indian",
      calories: "58 kcal per piece",
      protein: "2g",
      carbs: "12g",
      fat: "0.4g",
      moodBenefit: "Light food, good for neutral or tired mood.",
      suggestion: "Best with sambar for protein and vegetables."
    },
    {
      keywords: ["dosa", "dosai"],
      name: "Dosa",
      category: "Tamil / South Indian",
      calories: "130 kcal per dosa",
      protein: "3g",
      carbs: "25g",
      fat: "3g",
      moodBenefit: "Gives energy because it has carbs.",
      suggestion: "Use less oil and add sambar for better nutrition."
    },
    {
      keywords: ["sambar", "sambhar"],
      name: "Sambar",
      category: "Tamil / South Indian",
      calories: "120 kcal per bowl",
      protein: "5g",
      carbs: "18g",
      fat: "3g",
      moodBenefit: "Dal and vegetables support energy and fullness.",
      suggestion: "Good with idli, dosa, or rice."
    },
    {
      keywords: ["curd rice", "thayir sadam", "yogurt rice"],
      name: "Curd Rice",
      category: "Tamil Food",
      calories: "220 kcal per bowl",
      protein: "6g",
      carbs: "35g",
      fat: "6g",
      moodBenefit: "Cooling food, useful for angry or stressed mood.",
      suggestion: "Add cucumber or carrot for better nutrition."
    },
    {
      keywords: ["lemon rice", "elumichai sadam"],
      name: "Lemon Rice",
      category: "Tamil Food",
      calories: "250 kcal per bowl",
      protein: "5g",
      carbs: "42g",
      fat: "7g",
      moodBenefit: "Quick energy food.",
      suggestion: "Add groundnuts for protein and healthy fats."
    },
    {
      keywords: ["tomato rice", "thakkali sadam"],
      name: "Tomato Rice",
      category: "Tamil Food",
      calories: "260 kcal per bowl",
      protein: "5g",
      carbs: "45g",
      fat: "7g",
      moodBenefit: "Good comfort food for neutral mood.",
      suggestion: "Use less oil and add curd for balance."
    },
    {
      keywords: ["pongal", "ven pongal"],
      name: "Ven Pongal",
      category: "Tamil Food",
      calories: "300 kcal per bowl",
      protein: "8g",
      carbs: "45g",
      fat: "10g",
      moodBenefit: "Comfort food, useful when tired.",
      suggestion: "Good with sambar; avoid too much ghee."
    },
    {
      keywords: ["vada", "medu vada"],
      name: "Medu Vada",
      category: "Tamil / South Indian",
      calories: "150 kcal per piece",
      protein: "5g",
      carbs: "15g",
      fat: "8g",
      moodBenefit: "Protein from urad dal but fried food.",
      suggestion: "Eat moderately, better with sambar."
    },
    {
      keywords: ["biryani", "chicken biryani"],
      name: "Chicken Biryani",
      category: "Indian Food",
      calories: "500 kcal per plate",
      protein: "25g",
      carbs: "60g",
      fat: "18g",
      moodBenefit: "High energy meal.",
      suggestion: "Eat with curd/onion raita and avoid overeating."
    },
    {
      keywords: ["parotta", "paratha"],
      name: "Parotta",
      category: "Tamil Food",
      calories: "300 kcal per piece",
      protein: "6g",
      carbs: "40g",
      fat: "12g",
      moodBenefit: "Heavy food, gives energy but may feel sleepy.",
      suggestion: "Eat occasionally, pair with protein curry."
    },
    {
      keywords: ["banana", "vazhai pazham"],
      name: "Banana",
      category: "Fruit",
      calories: "105 kcal",
      protein: "1.3g",
      carbs: "27g",
      fat: "0.3g",
      moodBenefit: "Good for tired mood and quick energy.",
      suggestion: "Good pre-workout or evening snack."
    },
    {
      keywords: ["apple"],
      name: "Apple",
      category: "Fruit",
      calories: "95 kcal",
      protein: "0.5g",
      carbs: "25g",
      fat: "0.3g",
      moodBenefit: "Light snack for neutral mood.",
      suggestion: "Good with nuts for better fullness."
    }
  ];

  const fallbackFood = {
    name: "Unknown Food",
    category: "General Food",
    calories: "Not sure",
    protein: "Not sure",
    carbs: "Not sure",
    fat: "Not sure",
    moodBenefit: "Unable to identify accurately in frontend demo mode.",
    suggestion: "Try typing the food name or connect AI vision backend for accurate scanning."
  };

  function createResultNote() {
    let note = document.getElementById("scannerResultNote");

    if (!note) {
      note = document.createElement("div");
      note.id = "scannerResultNote";
      note.style.marginTop = "18px";
      note.style.padding = "16px";
      note.style.border = "1px solid var(--border)";
      note.style.borderRadius = "18px";
      note.style.background = "var(--card-bg)";
      note.style.color = "var(--text)";
      note.style.whiteSpace = "pre-line";

      if (scanFoodBtn?.parentElement) {
        scanFoodBtn.parentElement.appendChild(note);
      }
    }

    return note;
  }

  function updateResult(result) {
    if (calories) calories.textContent = result.calories;
    if (protein) protein.textContent = result.protein;
    if (carbs) carbs.textContent = result.carbs;
    if (fat) fat.textContent = result.fat;

    const note = createResultNote();
    note.textContent = `Food: ${result.name}\nCategory: ${result.category}\nMood Support: ${result.moodBenefit}\nSuggestion: ${result.suggestion}`;

    if (scannerMessage) {
      scannerMessage.textContent = "Scan result ready.";
      scannerMessage.style.color = "#22c55e";
    }

    const history = JSON.parse(localStorage.getItem("nutrimoodHistory")) || [];
    history.unshift({
      type: "scan",
      title: `Food Scanned: ${result.name}`,
      details: `${result.category} | ${result.calories}`,
      date: new Date().toLocaleString()
    });
    localStorage.setItem("nutrimoodHistory", JSON.stringify(history));
  }

  function findFoodByText(text) {
    if (!text) return null;
    const search = text.toLowerCase().trim();
    return foodDatabase.find((food) =>
      food.keywords.some((keyword) => keyword.toLowerCase() === search)
    );
  }

  function getRandomFood() {
    return foodDatabase[Math.floor(Math.random() * foodDatabase.length)];
  }

  function createTextInput() {
    let input = document.getElementById("foodNameInput");
    if (input) return input;

    input = document.createElement("input");
    input.type = "text";
    input.id = "foodNameInput";
    input.placeholder = "Type food name: idli, dosa, sambar, curd rice...";
    input.style.width = "100%";
    input.style.padding = "14px 16px";
    input.style.borderRadius = "16px";
    input.style.border = "1px solid var(--border)";
    input.style.background = "var(--card-bg)";
    input.style.color = "var(--text)";
    input.style.marginBottom = "16px";

    if (scanFoodBtn?.parentElement) {
      scanFoodBtn.parentElement.insertBefore(input, scanFoodBtn);
    }

    return input;
  }

  if (foodImageInput) {
    foodImageInput.addEventListener("change", () => {
      selectedFile = foodImageInput.files[0];

      if (!selectedFile) return;

      const reader = new FileReader();

      reader.onload = (e) => {
        if (foodPreview) {
          foodPreview.src = e.target.result;
          foodPreview.style.display = "block";
        }
        if (previewPlaceholder) {
          previewPlaceholder.style.display = "none";
        }
      };

      reader.readAsDataURL(selectedFile);
    });
  }

  const foodNameInput = createTextInput();

  if (scanFoodBtn) {
    scanFoodBtn.addEventListener("click", () => {
      const typedFood = foodNameInput?.value.trim();
      const textResult = findFoodByText(typedFood);

      if (typedFood && textResult) {
        updateResult(textResult);
        if (scannerMessage) {
          scannerMessage.textContent = `Identified from text: ${textResult.name}`;
          scannerMessage.style.color = "#22c55e";
        }
        return;
      }

      if (typedFood && !textResult) {
        updateResult(fallbackFood);
        if (scannerMessage) {
          scannerMessage.textContent = `Unable to identify '${typedFood}'. Showing fallback result.`;
          scannerMessage.style.color = "#ef4444";
        }
        return;
      }

      if (!selectedFile) {
        if (scannerMessage) {
          scannerMessage.textContent = "Upload an image or type a food name to identify it.";
          scannerMessage.style.color = "#ef4444";
        }
        return;
      }

      const randomResult = getRandomFood();
      updateResult(randomResult);
      if (scannerMessage) {
        scannerMessage.textContent = "Image preview only. For accurate image recognition, connect AI vision backend. You can type food name for better result.";
        scannerMessage.style.color = "#22c55e";
      }
    });
  }
});
