
/***********************
 * UI Components
 ***********************/
function renderNav() {
  const nav = $("#nav");
  if (!nav) return;
  nav.innerHTML = "";

  const isLogged = !!state.session;
  const role = state.session?.role;

  if (state.route.startsWith("#/cover")) return;

  const items = [];
  items.push(["Beranda", "#/landing"]);
  items.push(["Materi", "#/materi"]);
  items.push(["Subbab 1", "#/s1"]);
  items.push(["Subbab 2", "#/s2"]);
  items.push(["Subbab 3", "#/s3"]);
  items.push(["Subbab 4", "#/s4"]);

  if (allSubbabDone()) items.push(["Evaluasi", "#/eval"]);
  if (hasDone("eval")) items.push(["Akhir", "#/final"]);

  if (isLogged && role === "admin") {
    items.push(["Dashboard Admin", "#/admin"]);
  }

  for (const [label, hash] of items) {
    const btn = document.createElement("div");
    const locked = !canOpen(hash);
    btn.className = "chip" + (state.route.startsWith(hash) ? " active" : "") + (locked ? " locked" : "");
    btn.textContent = locked ? `${label} 🔒` : label;
    btn.onclick = () => go(hash);
    nav.appendChild(btn);
  }

  if (isLogged) {
    const me = document.createElement("div");
    me.className = "chip";
    me.style.maxWidth = "240px";
    me.style.overflow = "hidden";
    me.style.textOverflow = "ellipsis";
    me.title = state.session.email;
    me.textContent = `${state.session.role === "admin" ? "👩‍🏫 Admin" : "👩‍🎓 Siswa"} • ${state.session.name}`;
    nav.appendChild(me);

    const out = document.createElement("div");
    out.className = "chip";
    out.textContent = "Keluar";
    out.onclick = logout;
    nav.appendChild(out);
  }
}

function updateTopbarVisibility() {
  const topbar = $("#topbar");
  if (!topbar) return;
  if (state.route.startsWith("#/cover")) {
    topbar.classList.add("hidden");
  } else {
    topbar.classList.remove("hidden");
  }
}

function moduleCardLocked(id, tag, title, desc, score, unlocked) {
  const scoreText = (typeof score === "number") ? `Skor (Terkunci): <b>${score}</b>` : "Belum dikerjakan";
  const lockText = unlocked ? "" : " 🔒";
  return `
        <div class="module">
          <div class="pillRow">
            <span class="pill"><span class="dot"></span> ${tag}${lockText}</span>
            <span class="pill">📝 ${scoreText}</span>
          </div>
          <h3>${escapeHtml(title)}</h3>
          <p>${escapeHtml(desc)}</p>
          <div style="margin-top:auto; display:flex; gap:10px; flex-wrap:wrap;">
            <button class="btn btnPrimary ${unlocked ? "" : "disabled"}" style="padding:12px 12px; border-radius:16px;"
              ${unlocked ? `onclick="go('#/${id}')"` : "disabled"}>
              Buka
            </button>
          </div>
          ${unlocked ? "" : `<div class="hint">Selesaikan tahap sebelumnya dulu ya 🙂</div>`}
        </div>
      `;
}

function adminTable(rows) {
  if (!rows.length) {
    return `<div class="contentBox">Belum ada nilai tersimpan.</div>`;
  }
  const tr = rows.map(r => `
        <tr>
          <td>${escapeHtml(r.name || "")}<div class="hint">${escapeHtml(r.email || "")}</div></td>
          <td>${fmtScore(r.s1)}</td>
          <td>${fmtScore(r.s2)}</td>
          <td>${fmtScore(r.s3)}</td>
          <td>${fmtScore(r.s4)}</td>
          <td>${fmtScore(r.eval)}</td>
          <td><b>${fmtScore(r.total)}</b></td>
          <td class="hint">${escapeHtml(shortDate(r.updatedAt))}</td>
        </tr>
      `).join("");

  return `
        <table>
          <thead>
            <tr>
              <th>Nama & Email</th>
              <th>Subbab 1</th>
              <th>Subbab 2</th>
              <th>Subbab 3</th>
              <th>Subbab 4</th>
              <th>Evaluasi</th>
              <th>Total</th>
              <th>Update</th>
            </tr>
          </thead>
          <tbody>${tr}</tbody>
        </table>
      `;
}
