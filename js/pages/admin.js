/***********************
 * Admin Page
 ***********************/
async function renderAdmin(app) {
    if (state.session?.role !== "admin") {
        app.innerHTML = `
          <section class="card"><div class="cardPad">
            <h2 style="margin:0 0 6px;">Akses ditolak</h2>
            <p class="subtitle" style="margin:0;">Halaman ini hanya untuk Admin.</p>
            <div class="divider"></div>
            <button class="btn btnPrimary" onclick="go('#/landing')">Kembali</button>
          </div></section>
        `;
        return;
    }

    setChatContext("Admin: kelola data nilai siswa.");

    // Tampilkan loading state
    app.innerHTML = `
        <section class="card">
          <div class="cardPad centerCol" style="min-height:200px;">
            <h2 style="margin-bottom:10px;">Mengambil Data... ⏳</h2>
            <p class="subtitle">Mohon tunggu, sedang memuat progress dari Spreadsheet.</p>
          </div>
        </section>
    `;

    // Ambil data (dari server jika GAS_URL tersedia, atau fallback ke local)
    let results = loadResultsFromStorage();
    if (typeof GAS_URL !== 'undefined' && GAS_URL && GAS_URL !== "ISI_URL_WEB_APP_GOOGLE_SCRIPT_DI_SINI") {
        try {
            const res = await fetch(GAS_URL, {
                method: "POST",
                body: JSON.stringify({ action: "get_all_results" })
            });
            const resultData = await res.json();
            if (resultData.status === "success" && resultData.data) {
                results = resultData.data;
                // Sinkronisasi ke storage lokal agar bisa offline sementara
                saveResultsToStorage(results);
            }
        } catch (e) {
            console.warn("Gagal fetch data admin dari server, menggunakan data lokal", e);
            toast("Mode Offline: Menggunakan data lokal");
        }
    }

    const rows = results.sort((a, b) => (b.updatedAt || "").localeCompare(a.updatedAt || ""));
    const countUsers = rows.length;

    app.innerHTML = `
        <section class="card">
          <div class="cardPad">
            <div class="row" style="justify-content:space-between;">
              <div>
                <span class="badge"><i></i> SPREADSHEET • DASHBOARD ADMIN</span>
                <h2 style="margin:10px 0 6px; font-size:26px;">Kelola ThermoLearn 👩‍🏫</h2>
                <p class="subtitle" style="margin:0;">
                  Lihat nilai siswa secara real-time tersinkron dengan Google Sheets.
                </p>
              </div>
              <div class="scoreBadge">👥 Pengunjung: <span style="font-size:14px;">${countUsers}</span></div>
            </div>

            <div class="divider"></div>

            <h3 style="margin:0 0 10px;">📋 Data Nilai Siswa</h3>
            <div style="overflow:auto;">
              ${adminTable(rows)}
            </div>

            <div class="divider"></div>
            <div class="row">
              <button class="btn btnPrimary" onclick="go('#/landing')">Kembali ke Beranda</button>
              <button class="btn btnGhost" onclick="go('#/final')">Lihat Halaman Akhir</button>
            </div>
          </div>
        </section>
      `;
}
