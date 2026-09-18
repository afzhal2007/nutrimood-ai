const API_URL = "https://nutrimood-ai.vercel.app/api/chat";

document.addEventListener("DOMContentLoaded", () => {
  const chatForm = document.getElementById("chatForm");
  const chatInput = document.getElementById("chatInput");
  const chatBody = document.getElementById("chatBody");
  const clearChatBtn = document.getElementById("clearChatBtn");
  const promptButtons = document.querySelectorAll(".prompt-btn");

  function addMessage(message, type = "bot", save = true) {
    if (!chatBody) return;

    const div = document.createElement("div");

    div.className =
      type === "user"
        ? "message user-msg"
        : "message bot-msg";

    div.textContent = message;

    chatBody.appendChild(div);
    chatBody.scrollTop = chatBody.scrollHeight;

    if (save) {
      const chats =
        JSON.parse(localStorage.getItem("nutrimoodChats")) || [];

      chats.push({
        type,
        message,
        date: new Date().toLocaleString()
      });

      localStorage.setItem(
        "nutrimoodChats",
        JSON.stringify(chats)
      );
    }
  }

  async function askLuckyAI(message) {
    const userProfile =
      JSON.parse(
        localStorage.getItem("nutrimoodUser")
      ) || {};

    const latestMood =
      JSON.parse(
        localStorage.getItem("nutrimoodLatestMood")
      ) || {};

    console.log("Sending Lucky AI request...");

    const response = await fetch(API_URL, {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        message: message,
        userProfile: userProfile,
        latestMood: latestMood
      })
    });

    console.log(
      "Lucky AI status:",
      response.status
    );

    const text = await response.text();

    console.log(
      "Lucky AI raw response:",
      text
    );

    let data;

    try {
      data = JSON.parse(text);
    } catch (error) {
      throw new Error(
        `Invalid backend response: ${text}`
      );
    }

    if (!response.ok || !data.ok) {
      throw new Error(
        data.error ||
        `Backend error ${response.status}`
      );
    }

    return data.answer;
  }

  /* =========================
     LOAD OLD CHAT
  ========================= */

  const savedChats =
    JSON.parse(
      localStorage.getItem("nutrimoodChats")
    ) || [];

  savedChats.forEach((chat) => {
    addMessage(
      chat.message,
      chat.type,
      false
    );
  });

  /* =========================
     CHAT SUBMIT
  ========================= */

  if (chatForm) {
    chatForm.addEventListener(
      "submit",
      async (e) => {
        e.preventDefault();

        const message =
          chatInput.value.trim();

        if (!message) return;

        addMessage(
          message,
          "user"
        );

        chatInput.value = "";

        const loadingText =
          "Lucky AI is thinking...";

        addMessage(
          loadingText,
          "bot",
          false
        );

        try {
          const answer =
            await askLuckyAI(message);

          const botMessages =
            chatBody.querySelectorAll(
              ".bot-msg"
            );

          const lastBot =
            botMessages[
              botMessages.length - 1
            ];

          const responseText =
            answer ||
            "Lucky AI could not generate a response.";

          if (
            lastBot &&
            lastBot.textContent ===
              loadingText
          ) {
            lastBot.textContent =
              responseText;
          } else {
            addMessage(
              responseText,
              "bot"
            );
          }

          const chats =
            JSON.parse(
              localStorage.getItem(
                "nutrimoodChats"
              )
            ) || [];

          chats.push({
            type: "bot",
            message: responseText,
            date:
              new Date().toLocaleString()
          });

          localStorage.setItem(
            "nutrimoodChats",
            JSON.stringify(chats)
          );

        } catch (error) {
          console.error(
            "Lucky AI ERROR:",
            error
          );

          const botMessages =
            chatBody.querySelectorAll(
              ".bot-msg"
            );

          const lastBot =
            botMessages[
              botMessages.length - 1
            ];

          const errorMessage =
            `Lucky AI Error: ${error.message}`;

          if (
            lastBot &&
            lastBot.textContent ===
              loadingText
          ) {
            lastBot.textContent =
              errorMessage;
          } else {
            addMessage(
              errorMessage,
              "bot"
            );
          }
        }
      }
    );
  }

  /* =========================
     PROMPT BUTTONS
  ========================= */

  promptButtons.forEach((btn) => {
    btn.addEventListener(
      "click",
      () => {
        if (!chatInput) return;

        chatInput.value =
          btn.textContent.trim();

        chatInput.focus();
      }
    );
  });

  /* =========================
     CLEAR CHAT
  ========================= */

  if (clearChatBtn) {
    clearChatBtn.addEventListener(
      "click",
      () => {
        localStorage.removeItem(
          "nutrimoodChats"
        );

        chatBody.innerHTML = `
          <div class="message bot-msg">
            Hi! I am Lucky AI inside NutriMood AI. Ask me about mood-based foods.
          </div>
        `;
      }
    );
  }
});
