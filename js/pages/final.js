
/***********************
 * Final Page
 ***********************/
function renderFinal(app) {
    setChatContext("Akhir: lihat rekap dan unduh laporan.");

    const me = state.session;
    const row = currentUserResult();

    const s1 = row?.s1 ?? "—";
    const s2 = row?.s2 ?? "—";
    const s3 = row?.s3 ?? "—";
    const s4 = row?.s4 ?? "—";
    const ev = row?.eval ?? "—";
    const total = row?.total ?? "—";
    const summary = row?.summary || "Kerjakan subbab dan evaluasi untuk melihat kesimpulan.";

    const isAdmin = state.session?.role === "admin";

    app.innerHTML = `
        <section class="card">
          <div class="cardPad">
            <span class="badge"><i></i> HALAMAN TERAKHIR</span>
            <h2 style="margin:10px 0 6px; font-size:28px;">Terima kasih sudah belajar Termokimia bersama ThermoLearn 💛</h2>
            <p class="subtitle" style="margin:0;">
              Berikut rekap hasil belajarmu (nilai terkunci).
            </p>

            <div class="divider"></div>

            <div class="grid2">
              <div class="card" style="box-shadow:none;">
                <div class="cardPad">
                  <h3 style="margin:0 0 10px;">📌 Rekap Nilai — ${escapeHtml(me.name)}</h3>

                  <table>
                    <thead>
                      <tr>
                        <th>Komponen</th>
                        <th>Skor</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr><td>Subbab 1</td><td>${s1}</td></tr>
                      <tr><td>Subbab 2</td><td>${s2}</td></tr>
                      <tr><td>Subbab 3</td><td>${s3}</td></tr>
                      <tr><td>Subbab 4</td><td>${s4}</td></tr>
                      <tr><td>Evaluasi</td><td>${ev}</td></tr>
                      <tr><td><b>Total (rata-rata)</b></td><td><b>${total}</b></td></tr>
                    </tbody>
                  </table>

                  <div class="row" style="margin-top:12px;">
                    ${isAdmin
            ? `
                        <button class="btn btnPrimary" onclick="downloadMyReport('html')">Unduh HTML (1 File)</button>
                        <button class="btn btnGhost" onclick="downloadMyReport('pdf')">Unduh PDF</button>
                      `
            : `
                        <button class="btn btnPrimary" onclick="downloadMyReport('pdf')">Unduh PDF</button>
                      `
        }
                  </div>

                  <p class="hint" style="margin-top:10px;">
                    ${isAdmin ? "Admin bisa unduh versi HTML 1 file." : "Siswa hanya bisa mengunduh PDF."}
                  </p>
                </div>
              </div>

              <div class="card" style="box-shadow:none;">
                <div class="cardPad">
                  <h3 style="margin:0 0 10px;">🧾 Kesimpulan & Motivasi</h3>
                  <div class="contentBox" style="white-space:pre-wrap;">${escapeHtml(summary)}</div>

                  <div class="divider"></div>
                  <div class="row">
                    <button class="btn btnPrimary" onclick="go('#/landing')">Kembali ke Beranda 🔁</button>
                    ${isAdmin ? `<button class="btn btnGhost" onclick="go('#/admin')">Dashboard Admin 👩‍🏫</button>` : ""}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>
      `;
}
