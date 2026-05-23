
/***********************
 * Subbab 3 Page
 ***********************/
function renderSubbab3(app) {
    const key = "s3";
    const label = "Subbab 3";
    setChatContext(`${label}: tanya konsep, rumus, contoh soal.`);

    const res = currentUserResult();
    const savedScore = res ? res[key] : null;

    const nextHash = "#/s4";
    const nextUnlocked = canOpen(nextHash);

    const lockedInfo = (typeof savedScore === "number")
        ? `<div class="lockHint">🔒 Nilai ${label} sudah terkunci (${savedScore}). Submit ulang hanya untuk latihan (tidak mengubah nilai).</div>`
        : ``;

    app.innerHTML = `
        <section class="card">
          <div class="cardPad">
            <div class="row" style="justify-content:space-between;">
              <div>
                <span class="badge"><i></i> ${label.toUpperCase()}</span>
                <h2 style="margin:10px 0 6px; font-size:26px;">${escapeHtml(state.content[key].title)}</h2>
                <p class="subtitle" style="margin:0;">Belajar materi → kerjakan kuis → submit. Nilai terkunci saat submit pertama.</p>
              </div>
              <div class="scoreBadge">🎯 Skor Terkunci: <span style="font-size:14px;">${typeof savedScore === "number" ? savedScore : "—"}</span></div>
            </div>

            <div class="divider"></div>

            <div id="stageProgressBar"></div>

            <div id="subContent">${state.content[key].html}</div>

            <div id="quizSection">
              <div class="divider"></div>

              <h3 style="margin:0 0 8px;">🧠 Kuis Singkat (${label})</h3>
              ${lockedInfo}
              <div id="quizArea"></div>

              <div class="row" style="margin-top:10px;">
                <button class="btn btnGhost" onclick="go('#/materi')">⬅️ Back</button>
                <button class="btn btnPrimary" onclick="submitQuiz('${key}')">Submit ✅</button>
                <button class="btn btnGhost ${nextUnlocked ? "" : "disabled"}" ${nextUnlocked ? `onclick="go('${nextHash}')"` : "disabled"}>
                  Next ➡️
                </button>
              </div>

              ${nextUnlocked ? "" : `<div class="lockHint">Next masih terkunci. Submit (pertama kali) agar terbuka 🙂</div>`}
            </div>
          </div>
        </section>
      `;

    renderQuiz(key);
    initStages(key);
}

function checkS3Praktikum() {
  const tAwal = document.getElementById("s3_suhu_awal").value;
  const tAkhir = document.getElementById("s3_suhu_akhir").value;
  const dt = document.getElementById("s3_dt").value;
  const hitung = document.getElementById("s3_perhitungan").value;
  const alasan = document.getElementById("s3_alasan").value;
  
  let sifat = "";
  const radios = document.getElementsByName("s3_sifat");
  for (let i = 0; i < radios.length; i++) {
    if (radios[i].checked) {
      sifat = radios[i].value;
      break;
    }
  }

  const fb = document.getElementById("feedback_s3_praktikum");
  fb.style.display = "block";

  if (!tAwal || !tAkhir || !dt || !hitung || !sifat || !alasan) {
    fb.innerHTML = '<div style="padding:10px; background:rgba(239,68,68,0.1); color:#b91c1c; border-radius:6px;">⚠️ Harap lengkapi semua isian terlebih dahulu!</div>';
    return;
  }

  // Cek sederhana
  let score = 0;
  if (dt == (tAkhir - tAwal)) score += 30; // Data Pengamatan
  if (hitung.includes("2940")) score += 40; // Perhitungan
  if (sifat === "eksoterm") score += 20; // Analisis Reaksi
  score += 10; // Kesimpulan (langsung dapat poin)

  fb.innerHTML = `<div style="padding:10px; background:rgba(16,185,129,0.1); color:#065f46; border-radius:6px;">
    <strong>✅ Jawaban Tersimpan!</strong><br>
    Nilai Lkpd Praktikum kamu: ${score}/100<br>
    <em>Feedback: Perhitungan kalor yang benar adalah q = 100 × 4.2 × 7 = 2940 J. Reaksi bersifat eksoterm karena suhu meningkat (melepas kalor).</em>
  </div>`;
}

function checkS3Hess() {
  const h1_1 = document.getElementById("s3_hess1_1").value.trim();
  const h1_2 = document.getElementById("s3_hess1_2").value.trim();
  const h2_1 = document.getElementById("s3_hess2_1").value.trim();
  const h2_2 = document.getElementById("s3_hess2_2").value.trim();

  const fb = document.getElementById("feedback_s3_hess");
  fb.style.display = "block";

  if (!h1_1 || !h1_2 || !h2_1 || !h2_2) {
    fb.innerHTML = '<div style="padding:10px; background:rgba(239,68,68,0.1); color:#b91c1c; border-radius:6px;">💡 Perhatikan hubungan antara koefisien reaksi dan ΔH. Harap isi semua kolom!</div>';
    return;
  }

  let benar = true;
  if (!h1_1.includes("+285.8") && !h1_1.includes("+ 285.8")) benar = false;
  if (!h1_2.includes("-571.6") && !h1_2.includes("- 571.6")) benar = false;
  if (h2_2 != "-110.5") benar = false;

  if (benar) {
    fb.innerHTML = `<div style="padding:10px; background:rgba(16,185,129,0.1); color:#065f46; border-radius:6px;">
      <strong>✅ Tepat Sekali!</strong><br>
      Aktivitas 1: Jika reaksi dibalik, ΔH menjadi +285.8 kJ. Jika dikali 2, ΔH menjadi -571.6 kJ.<br>
      Aktivitas 2: Reaksi 2 dibalik, lalu dijumlahkan dengan Reaksi 1. ΔH = -393.5 + 283 = -110.5 kJ.
    </div>`;
  } else {
    fb.innerHTML = '<div style="padding:10px; background:rgba(239,68,68,0.1); color:#b91c1c; border-radius:6px;">💡 Masih ada yang kurang tepat. Coba periksa kembali tanda positif/negatif dan perhitungan matematikanya!</div>';
  }
}
