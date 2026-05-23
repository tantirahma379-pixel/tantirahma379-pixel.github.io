
/***********************
 * Landing Page (Video)
 ***********************/
function renderLanding(app) {
  setChatContext("Beranda: tonton video pengantar dulu ya.");

  const me = state.session;

  app.innerHTML = `
        <section class="card">
          <div class="cardPad">
            <div class="row" style="justify-content:space-between;">
              <div>
                <span class="badge"><i></i> VIDEO PENGANTAR</span>
                <h2 style="margin:10px 0 6px; font-size:26px;">Halo, ${escapeHtml(me.name)} 👋</h2>
                <p class="subtitle" style="margin:0;">
                  Tonton video pengantar ini sebelum mulai belajar materi Termokimia.
                </p>
              </div>
              <button class="btn btnGhost" onclick="logout()">Keluar</button>
            </div>

            <div class="divider"></div>

            <div class="videoWrap" style="margin-bottom:20px; border-radius:12px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.1);">
              <iframe width="560" height="315" src="https://www.youtube.com/embed/Iyl5V9viCvk?si=5DSUU1QNQasW3PZM" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
            </div>

            <div class="row" style="justify-content:center;">
              <button class="btn btnPrimary" onclick="go('#/materi')" style="padding:14px 24px; font-size:16px;">
                Mulai Belajar Materi 🚀
              </button>
            </div>
          </div>
        </section>
      `;
}
