const API_URL = "http://localhost:5000/api/chat";

document.addEventListener("DOMContentLoaded", () => {
  const chatForm = document.getElementById("chatForm");
  const chatInput = document.getElementById("chatInput");
  const chatBody = document.getElementById("chatBody");
  const clearChatBtn = document.getElementById("clearChatBtn");
  const promptButtons = document.querySelectorAll(".prompt-btn");

  const savedChats = JSON.parse(localStorage.getItem("nutrimoodChats")) || [];

  function addMessage(message, type = "bot", save = true) {
    if (!chatBody) return;

    const div = document.createElement("div");
    div.className = `message ${type === "user" ? "user-msg" : "bot-msg"}`;
    div.textContent = message;

    chatBody.appendChild(div);
    chatBody.scrollTop = chatBody.scrollHeight;

    if (save) {
      const chats = JSON.parse(localStorage.getItem("nutrimoodChats")) || [];
      chats.push({
        type,
        message,
        date: new Date().toLocaleString()
      });
      localStorage.setItem("nutrimoodChats", JSON.stringify(chats));
    }
  }

  async function askLuckyAI(message) {
    const userProfile = JSON.parse(localStorage.getItem("nutrimoodUser")) || {};
    const latestMood = JSON.parse(localStorage.getItem("nutrimoodLatestMood")) || {};

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message,
        userProfile,
        latestMood
      })
    });

    const data = await response.json();

    if (!response.ok || !data.ok) {
      throw new Error(data.error || "Lucky AI API error");
    }

    return data.answer || null;
  }

  savedChats.forEach((chat) => {
    addMessage(chat.message, chat.type, false);
  });

  if (chatForm) {
    chatForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const message = chatInput.value.trim();
      if (!message) return;

      addMessage(message, "user");
      chatInput.value = "";

      const loadingText = "Lucky AI is thinking...";
      addMessage(loadingText, "bot", false);

      try {
        const answer = await askLuckyAI(message);
        const responseText = answer || "Lucky AI could not generate a proper answer. Try asking with your mood and food preference.";

        const botMessages = chatBody.querySelectorAll(".bot-msg");
        const lastBot = botMessages[botMessages.length - 1];

        if (lastBot && lastBot.textContent === loadingText) {
          lastBot.textContent = responseText;
        } else {
          addMessage(responseText, "bot");
        }

        const chats = JSON.parse(localStorage.getItem("nutrimoodChats")) || [];
        chats.push({
          type: "bot",
          message: responseText,
          date: new Date().toLocaleString()
        });
        localStorage.setItem("nutrimoodChats", JSON.stringify(chats));

        const history = JSON.parse(localStorage.getItem("nutrimoodHistory")) || [];
        history.unshift({
          type: "chat",
          title: "Lucky AI Chat",
          date: new Date().toLocaleString(),
          details: message
        });
        localStorage.setItem("nutrimoodHistory", JSON.stringify(history));

      } catch (error) {
        const botMessages = chatBody.querySelectorAll(".bot-msg");
        const lastBot = botMessages[botMessages.length - 1];
        const connectionMessage = "Lucky AI connection error. Backend server may be off.";

        if (lastBot && lastBot.textContent === loadingText) {
          lastBot.textContent = connectionMessage;
        } else {
          addMessage(connectionMessage, "bot");
        }

        console.error(error);
      }
    });
  }

  promptButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      chatInput.value = btn.textContent;
      chatInput.focus();
    });
  });

  if (clearChatBtn) {
    clearChatBtn.addEventListener("click", () => {
      localStorage.removeItem("nutrimoodChats");
      chatBody.innerHTML = `
        <div class="message bot-msg">
          Hi! I am Lucky AI inside NutriMood AI. Ask me about mood-based foods.
        </div>
      `;
    });
  }
});