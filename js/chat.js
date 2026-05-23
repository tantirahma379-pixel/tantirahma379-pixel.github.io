
/***********************
 * Chatbot
 ***********************/
function updateChatVisibility() {
    const logged = !!state.session;
    const toggle = $("#chatToggle");
    const bot = $("#chatbot");
    if (!toggle || !bot) return;

    if (logged) {
        toggle.style.display = "flex";
    } else {
        toggle.style.display = "none";
        bot.classList.add("hidden");
    }
}

function toggleChat(forceOpen) {
    const bot = $("#chatbot");
    const toggle = $("#chatToggle");
    if (!bot || !toggle) return;

    const isHidden = bot.classList.contains("hidden");
    const open = (typeof forceOpen === "boolean") ? forceOpen : isHidden;

    if (open) {
        bot.classList.remove("hidden");
        toggle.style.display = "none";
        $("#chatInput")?.focus();
    } else {
        bot.classList.add("hidden");
        toggle.style.display = "flex";
    }
}

function setChatContext(text) {
    const el = $("#chatContext");
    if (el) el.textContent = text || "Siap bantu termokimia!";
}

function bootstrapChat() {
    const body = $("#chatBody");
    if (!body) return;
    body.innerHTML = "";
    addBot(`Hai ${state.session?.name || "teman"}! Aku ThermoBot 🤖⚗️\nTanya apa saja tentang termokimia 🙂`);
}

function sendChat() {
    const input = $("#chatInput");
    const text = (input?.value || "").trim();
    if (!text) return;
    input.value = "";
    addUser(text);
    setTimeout(() => addBot("Oke! Kalau kamu mau, sebut topiknya: eksoterm/endoterm, ΔH°, Hess, kalorimeter."), 200);
}

function addUser(text) {
    const body = $("#chatBody");
    const div = document.createElement("div");
    div.className = "bubble user";
    div.textContent = text;
    body.appendChild(div);
}

function addBot(text) {
    const body = $("#chatBody");
    const div = document.createElement("div");
    div.className = "bubble bot";
    div.textContent = text;
    body.appendChild(div);
}
