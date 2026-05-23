
/***********************
 * Materi Page (Modules)
 ***********************/
function renderMateri(app) {
  setChatContext("Materi: kerjakan Subbab 1 dulu ya.");

  const me = state.session;
  const res = currentUserResult() || { s1: null, s2: null, s3: null, s4: null, eval: null };

  app.innerHTML = `
        <section class="card">
          <div class="cardPad">
            <div class="row" style="justify-content:space-between;">
              <div>
                <span class="badge"><i></i> Tujuan Pembelajaran</span>
                <h2 style="margin:10px 0 6px; font-size:26px;">Apa yang Akan Kita Pelajari?</h2>
                <div class="subtitle" style="margin:0;">
                  Setelah mengikuti pembelajaran ini, kamu diharapkan mampu:
                  <ul>
                    <li>Menjelaskan secara sederhana bagaimana energi terlibat dalam reaksi kimia melalui konsep sistem dan lingkungan.</li>
                    <li>Mengenali perbedaan reaksi yang melepaskan energi dan reaksi yang menyerap energi.</li>
                    <li>Mengidentifikasi berbagai bentuk perubahan energi reaksi, seperti pembentukan, pembakaran, dan penguraian.</li>
                    <li>Menentukan perubahan energi reaksi dengan beberapa cara dan mengaitkannya dengan peristiwa dalam kehidupan sehari-hari.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div class="divider"></div>
            <div class="row" style="justify-content:space-between;">
              <div>
                <span class="badge"><i></i> Peta Konsep</span>
                <h2 style="margin:10px 0 6px; font-size:26px;">Bagaimana Materi Ini Disusun?</h2>
                <p class="subtitle" style="margin:0;">
                  Peta konsep berikut menunjukkan alur materi yang akan kamu pelajari, mulai dari konsep dasar hingga penerapannya dalam kehidupan sehari-hari. Gunakan peta ini sebagai panduan belajar, sehingga kamu tahu dari mana harus mulai dan ke mana pembelajaran akan berlanjut.
                </p>
                <img src="https://cdn.jsdelivr.net/gh/tantirahma379-pixel/Termolearn@master/gambar/PetaKonsepTermokimia.png" alt="Peta Konsep Termokimia" style="width:100%; max-width:1000px; margin:20px 0; border-radius:12px; box-shadow:0 4px 12px rgba(0,0,0,0.1);">
              </div>
            </div>

            <div class="divider"></div>

            <div class="row" style="justify-content:space-between;">
              <div>
                <span class="badge"><i></i> MATERI PEMBELAJARAN</span>
                <h2 style="margin:10px 0 6px; font-size:26px;">Pilih Materi 📚</h2>
                <p class="subtitle" style="margin:0;">
                  Kerjakan subbab berurutan. Nilai <b>otomatis dikunci</b> setelah pertama kali submit.
                </p>
              </div>
            </div>

            <div class="divider"></div>

            <div class="modules">
              ${moduleCardLocked("s1", "SUBBAB 1", state.content.s1.title, "Eksoterm/Endoterm • Sistem/Lingkungan", res.s1, true)}
              ${moduleCardLocked("s2", "SUBBAB 2", state.content.s2.title, "Kondisi standar • ∆H° • ∆H°f", res.s2, hasDone("s1"))}
              ${moduleCardLocked("s3", "SUBBAB 3", state.content.s3.title, "Kalorimeter • Hess • Energi ikatan", res.s3, hasDone("s1") && hasDone("s2"))}
              ${moduleCardLocked("s4", "SUBBAB 4", state.content.s4.title, "Pendalaman Materi", res.s4, hasDone("s1") && hasDone("s2") && hasDone("s3"))}
            </div>

            <div class="lockHint">
              🔒 Evaluasi akan muncul setelah semua Subbab selesai.
            </div>

            ${allSubbabDone() ? `
              <div class="divider"></div>
              <div class="row">
                <button class="btn btnPrimary" onclick="go('#/eval')">Mulai Evaluasi 🧪</button>
              </div>
            ` : ``}
          </div>
        </section>
      `;
}
