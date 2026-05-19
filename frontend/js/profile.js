// Profile page scripts
// ================= NUTRIMOOD AI - PROFILE JS =================

document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("nutrimoodUser")) || {};
  const profileForm = document.getElementById("profileForm");
  const profileMessage = document.getElementById("profileMessage");

  const fields = {
    name: document.getElementById("profileNameInput"),
    email: document.getElementById("profileEmailInput"),
    age: document.getElementById("profileAgeInput"),
    gender: document.getElementById("profileGenderInput"),
    height: document.getElementById("profileHeightInput"),
    weight: document.getElementById("profileWeightInput"),
    foodPreference: document.getElementById("profileFoodInput"),
    healthGoal: document.getElementById("profileGoalInput")
  };

  if (fields.name) fields.name.value = user.name || "";
  if (fields.email) fields.email.value = user.email || "";
  if (fields.age) fields.age.value = user.age || "";
  if (fields.gender) fields.gender.value = user.gender || "";
  if (fields.height) fields.height.value = user.height || "";
  if (fields.weight) fields.weight.value = user.weight || "";
  if (fields.foodPreference) fields.foodPreference.value = user.foodPreference || "Mixed";
  if (fields.healthGoal) fields.healthGoal.value = user.healthGoal || "Healthy Lifestyle";

  if (profileForm) {
    profileForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const updatedUser = {
        ...user,
        name: fields.name.value.trim(),
        email: fields.email.value.trim(),
        age: fields.age.value.trim(),
        gender: fields.gender.value,
        height: fields.height.value.trim(),
        weight: fields.weight.value.trim(),
        foodPreference: fields.foodPreference.value,
        healthGoal: fields.healthGoal.value,
        profileCompleted: true,
        loggedIn: true
      };

      localStorage.setItem("nutrimoodUser", JSON.stringify(updatedUser));

      const history = JSON.parse(localStorage.getItem("nutrimoodHistory")) || [];
      history.unshift({
        type: "profile",
        title: "Profile Updated",
        date: new Date().toLocaleString(),
        details: `Goal: ${updatedUser.healthGoal}, Food: ${updatedUser.foodPreference}`
      });
      localStorage.setItem("nutrimoodHistory", JSON.stringify(history));

      profileMessage.textContent = "Profile updated successfully!";
      profileMessage.style.color = "#22c55e";
    });
  }
});