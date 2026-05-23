
/***********************
 * Evaluasi Page
 ***********************/
function renderEvaluasi(app) {
    setChatContext("Evaluasi: latihan campuran termokimia.");

    const res = currentUserResult() || {};
    const nextUnlocked = hasDone("eval");
    const savedScore = (typeof res.eval === "number") ? res.eval : null;

    const lockedInfo = (typeof savedScore === "number")
        ? `<div class="lockHint">🔒 Nilai Evaluasi sudah terkunci (${savedScore}). Submit ulang hanya untuk latihan.</div>`
        : ``;

    app.innerHTML = `
        <section class="card">
          <div class="cardPad">
            <div class="row" style="justify-content:space-between;">
              <div>
                <span class="badge"><i></i> EVALUASI AKHIR</span>
                <h2 style="margin:10px 0 6px; font-size:26px;">Uji Pemahaman Termokimia 🧪</h2>
                <p class="subtitle" style="margin:0;">Submit evaluasi pertama kali untuk membuka halaman akhir (nilai dikunci).</p>
              </div>
              <div class="scoreBadge">🧾 Skor Terkunci: <span style="font-size:14px;">${typeof res.eval === "number" ? res.eval : "—"}</span></div>
            </div>

            <div class="divider"></div>

            <div id="evalContent">${state.content.eval.html}</div>

            <div class="divider"></div>

            <h3 style="margin:0 0 8px;">🧠 Kuis Evaluasi</h3>
            ${lockedInfo}
            <div id="quizArea"></div>

            <div class="row" style="margin-top:10px;">
              <button class="btn btnGhost" onclick="go('#/s3')">⬅️ Back</button>
              <button class="btn btnPrimary" onclick="submitQuiz('eval')">Submit Evaluasi ✅</button>
              <button class="btn btnGhost ${nextUnlocked ? "" : "disabled"}" ${nextUnlocked ? `onclick="go('#/final')"` : "disabled"}>
                Next ➡️
              </button>
            </div>
          </div>
        </section>
      `;

    renderQuiz("eval");
}
