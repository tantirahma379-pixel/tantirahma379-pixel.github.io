/***********************
 * State & Core Logic
 * (Offline / localStorage only — no backend)
 ***********************/
const state = {
    route: "#/cover",
    session: null,
    users: [],
    results: [],
    content: null,
    currentUserResult: null
};

const sleep = ms => new Promise(r => setTimeout(r, ms));

/* ---- localStorage helpers for results ---- */
function loadResultsFromStorage() {
    try {
        return JSON.parse(localStorage.getItem(LS_KEYS.results) || "[]");
    } catch (e) { return []; }
}

function saveResultsToStorage(results) {
    localStorage.setItem(LS_KEYS.results, JSON.stringify(results));
}

function findResultByEmail(email) {
    const all = loadResultsFromStorage();
    return all.find(r => r.email === email) || null;
}

function upsertResultInStorage(email, name, partial) {
    const all = loadResultsFromStorage();
    let idx = all.findIndex(r => r.email === email);
    if (idx === -1) {
        all.push({ email, name, s1: null, s2: null, s3: null, s4: null, eval: null, total: null, summary: "", updatedAt: nowISO() });
        idx = all.length - 1;
    }
    const row = all[idx];
    Object.assign(row, partial);
    row.name = name || row.name;
    // Recalculate total & summary
    const scores = [row.s1, row.s2, row.s3, row.s4, row.eval].filter(v => typeof v === "number");
    row.total = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null;
    row.summary = buildSummary(row);
    row.updatedAt = nowISO();
    all[idx] = row;
    saveResultsToStorage(all);
    return row;
}

/* ---- Load state ---- */
function loadAll() {
    try {
        state.session = JSON.parse(localStorage.getItem(LS_KEYS.session) || "null");
    } catch (e) {
        console.warn("Session load error:", e);
    }

    state.content = defaultContent();

    if (state.session && state.session.email) {
        refreshCurrentUserResult();
    }

    const y = $("#year");
    if (y) y.textContent = year();
}

function saveSession() {
    localStorage.setItem(LS_KEYS.session, JSON.stringify(state.session));
}

function saveUsers() { /* no-op */ }
function saveResults() { /* no-op */ }
function saveContent() { /* no-op */ }

function currentUserResult() {
    return state.currentUserResult || null;
}

function refreshCurrentUserResult() {
    if (!state.session || !state.session.email) return;
    state.currentUserResult = findResultByEmail(state.session.email);
}

function hasDone(key) {
    const r = currentUserResult();
    return !!r && typeof r[key] === "number";
}

function allSubbabDone() {
    return hasDone("s1") && hasDone("s2") && hasDone("s3") && hasDone("s4");
}

function canOpen(routeHash) {
    if (routeHash.startsWith("#/cover")) return true;
    if (!state.session) return false;

    if (routeHash.startsWith("#/admin")) return state.session.role === "admin";
    if (routeHash.startsWith("#/landing")) return true;
    if (routeHash.startsWith("#/materi")) return true;

    if (routeHash.startsWith("#/s1")) return true;
    if (routeHash.startsWith("#/s2")) return hasDone("s1");
    if (routeHash.startsWith("#/s3")) return hasDone("s1") && hasDone("s2");
    if (routeHash.startsWith("#/s4")) return hasDone("s1") && hasDone("s2") && hasDone("s3");

    if (routeHash.startsWith("#/eval")) return allSubbabDone();
    if (routeHash.startsWith("#/final")) return hasDone("eval");

    return false;
}

function guardRoute() {
    if (!canOpen(state.route)) {
        toast("Bagian ini masih terkunci. Kerjakan tahap sebelumnya dulu ya 🙂");
        go(state.session ? "#/landing" : "#/cover");
        return false;
    }
    return true;
}

/* ---- Login (terhubung ke Google Apps Script) ---- */
async function login() {
    const email = ($("#inpEmail")?.value || "").trim() || "siswa@thermolearn.id";
    const password = ($("#inpPassword")?.value || "").trim();
    const name = email.split("@")[0];

    const btn = $("#btnLogin");
    const originalText = btn ? btn.textContent : "Masuk";
    if (btn) btn.textContent = "Memproses...";

    try {
        if (typeof GAS_URL !== 'undefined' && GAS_URL && GAS_URL !== "ISI_URL_WEB_APP_GOOGLE_SCRIPT_DI_SINI") {
            const res = await fetch(GAS_URL, {
                method: "POST",
                body: JSON.stringify({ action: "login", email, password, name })
            });
            const result = await res.json();
            if (result.status !== "success") {
                toast("Gagal login: " + result.message);
                if (btn) btn.textContent = originalText;
                return;
            }
            if (result.progress) {
                // Simpan progress dari server ke local
                upsertResultInStorage(email, name, result.progress);
            }
        }
    } catch (err) {
        console.warn("Gagal fetch GAS_URL:", err);
        toast("Mode Offline aktif (Server tidak merespons)");
    }
    
    if (btn) btn.textContent = originalText;

    const role = (email === ADMIN_EMAIL) ? "admin" : "siswa";

    state.session = { email, name, role };
    saveSession();

    refreshCurrentUserResult();

    updateChatVisibility();
    bootstrapChat();

    go(role === "admin" ? "#/admin" : "#/landing");
    toast(role === "admin" ? "Masuk sebagai Admin" : "Selamat belajar!");
}

/* ---- Register (terhubung ke Google Apps Script) ---- */
async function register() {
    const name = ($("#inpRegName")?.value || "").trim() || "Siswa";
    const email = ($("#inpRegEmail")?.value || "").trim() || "siswa@thermolearn.id";
    const password = ($("#inpRegPassword")?.value || "").trim();

    const btn = $("#btnRegister");
    const originalText = btn ? btn.textContent : "Daftar";
    if (btn) btn.textContent = "Memproses...";

    try {
        if (typeof GAS_URL !== 'undefined' && GAS_URL && GAS_URL !== "ISI_URL_WEB_APP_GOOGLE_SCRIPT_DI_SINI") {
            const res = await fetch(GAS_URL, {
                method: "POST",
                body: JSON.stringify({ action: "register", email, password, name })
            });
            const result = await res.json();
            if (result.status !== "success") {
                toast("Gagal mendaftar: " + result.message);
                if (btn) btn.textContent = originalText;
                return;
            }
            if (result.progress) {
                upsertResultInStorage(email, name, result.progress);
            }
        }
    } catch (err) {
        console.warn("Gagal fetch GAS_URL:", err);
        toast("Mode Offline aktif (Server tidak merespons)");
    }
    
    if (btn) btn.textContent = originalText;

    const role = (email === ADMIN_EMAIL) ? "admin" : "siswa";

    state.session = { email, name, role };
    saveSession();

    refreshCurrentUserResult();

    updateChatVisibility();
    bootstrapChat();

    go(role === "admin" ? "#/admin" : "#/landing");
    toast("Pendaftaran berhasil! Selamat belajar!");
}

function logout() {
    state.session = null;
    state.currentUserResult = null;
    saveSession();
    toggleChat(false);
    updateChatVisibility();
    go("#/cover");
    toast("Kamu sudah keluar.");
}

function upsertResult(partial, options = { lockIfExists: true }) {
    if (!state.session || !state.session.email) return { changed: false, row: null };

    if (state.currentUserResult && options.lockIfExists) {
        const blockedKeys = [];
        for (const k of Object.keys(partial || {})) {
            if (typeof state.currentUserResult[k] === "number" && typeof partial[k] === "number") {
                blockedKeys.push(k);
            }
        }
        if (blockedKeys.length) {
            return { changed: false, row: state.currentUserResult, blockedKeys };
        }
    }

    const row = upsertResultInStorage(state.session.email, state.session.name, partial);
    state.currentUserResult = row;
    
    // Sinkronisasi data ke server (fire and forget)
    syncResultWithServer(row);
    
    return { changed: true, row };
}

async function syncResultWithServer(row) {
    if (typeof GAS_URL === 'undefined' || !GAS_URL || GAS_URL === "ISI_URL_WEB_APP_GOOGLE_SCRIPT_DI_SINI") return;
    try {
        const payload = { action: "sync_result", ...row };
        await fetch(GAS_URL, {
            method: "POST",
            body: JSON.stringify(payload)
        });
    } catch (e) {
        console.warn("Gagal sinkronisasi progress ke server", e);
    }
}

function buildSummary(row) {
    const avg = row.total ?? 0;
    if (avg >= 85) return "Luar biasa! Pemahaman kamu sangat kuat.\nMotivasi: pertahankan ya! 🚀";
    if (avg >= 70) return "Bagus! Kamu sudah menguasai sebagian besar konsep.\nMotivasi: sedikit lagi menuju sempurna 💛";
    if (avg >= 55) return "Cukup baik, tapi masih perlu latihan.\nMotivasi: pelan-pelan tapi konsisten ✅";
    return "Semangat! Kita perbaiki konsep dasar dulu ya.\nMotivasi: kamu pasti bisa kalau rutin 🙌";
}
