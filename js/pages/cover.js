
/***********************
 * Cover Page
 ***********************/
function renderCover(app) {
  setChatContext("Selamat datang! Login atau daftar untuk mulai.");

  app.innerHTML = `
        <section class="card">
          <div class="cardPad centerCol">
            <span class="badge"><i></i> THERMOLEARN • TERMOKIMIA INTERACTIVE</span>

            <h2 class="titleXL" style="margin-top:10px;">
              TERMOLEARN <span style="background:linear-gradient(90deg, var(--orange), var(--blue)); -webkit-background-clip:text; background-clip:text; color:transparent;">seru</span>
            </h2>
            <div class="coverMascot">
              <div class="mascotWrap" style="min-height:320px; padding:0;">
                <img class="mascot" src="https://cdn.jsdelivr.net/gh/tantirahma379-pixel/Termolearn@master/gambar/Maskot.png" alt="Maskot TermoLearn">
              </div>

            <div class="authTabs" style="display:flex; gap:0; max-width:520px; width:100%; margin-bottom:0;">
              <button id="tabLogin" class="btn authTab active" onclick="switchAuthTab('login')" style="flex:1; border-radius:18px 0 0 0; font-size:13px; padding:12px 10px;">Masuk</button>
              <button id="tabRegister" class="btn authTab" onclick="switchAuthTab('register')" style="flex:1; border-radius:0 18px 0 0; font-size:13px; padding:12px 10px;">Daftar</button>
            </div>

            <!-- LOGIN FORM -->
            <div id="formLogin" class="form" style="max-width:520px; width:100%; margin-top:0; border-top:none;">
              <div class="field">
                <label>Email (opsional)</label>
                <input id="inpEmail" type="email" placeholder="Email@gmail.com... (boleh kosong)" autocomplete="email" />
              </div>
              <div class="field">
                <label>Password (opsional)</label>
                <input id="inpPassword" type="password" placeholder="Password... (boleh kosong)" autocomplete="current-password" />
              </div>

              <button id="btnLogin" class="btn btnPrimary" onclick="login()">Masuk</button>

              <div class="hint">
                Klik <b>Masuk</b> untuk langsung memulai. Email bersifat opsional.
              </div>
            </div>

            <!-- REGISTER FORM -->
            <div id="formRegister" class="form" style="max-width:520px; width:100%; margin-top:0; display:none; border-top:none;">
              <div class="field">
                <label>Nama (opsional)</label>
                <input id="inpRegName" type="text" placeholder="Tulis Nama Kamu... (boleh kosong)" autocomplete="name" />
              </div>
              <div class="field">
                <label>Email (opsional)</label>
                <input id="inpRegEmail" type="email" placeholder="Email@gmail.com... (boleh kosong)" autocomplete="email" />
              </div>
              <div class="field">
                <label>Password (opsional)</label>
                <input id="inpRegPassword" type="password" placeholder="Password... (boleh kosong)" autocomplete="new-password" />
              </div>

              <button id="btnRegister" class="btn btnPrimary" onclick="register()">Daftar</button>

              <div class="hint">
                Klik <b>Daftar</b> untuk langsung memulai. Semua field bersifat opsional.
              </div>
            </div>
          </div>
        </section>
      `;
}

function switchAuthTab(tab) {
  const tabLogin = document.getElementById("tabLogin");
  const tabRegister = document.getElementById("tabRegister");
  const formLogin = document.getElementById("formLogin");
  const formRegister = document.getElementById("formRegister");

  if (tab === "login") {
    tabLogin.classList.add("active");
    tabRegister.classList.remove("active");
    formLogin.style.display = "";
    formRegister.style.display = "none";
  } else {
    tabRegister.classList.add("active");
    tabLogin.classList.remove("active");
    formRegister.style.display = "";
    formLogin.style.display = "none";
  }
}
