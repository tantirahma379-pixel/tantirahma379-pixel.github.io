
/***********************
 * Router (Main Render Dispatcher)
 ***********************/
function render() {
    updateTopbarVisibility();
    renderNav();
    updateChatVisibility();

    const app = $("#app");
    if (!app) return;

    const r = state.route || "#/cover";
    if (!state.session && !r.startsWith("#/cover")) {
        go("#/cover");
        return;
    }

    if (!r.startsWith("#/cover") && !guardRoute()) return;

    if (r.startsWith("#/cover")) return renderCover(app);
    if (r.startsWith("#/landing")) return requireLogin() && renderLanding(app);
    if (r.startsWith("#/materi")) return requireLogin() && renderMateri(app);
    if (r.startsWith("#/s1")) return requireLogin() && renderSubbab1(app);
    if (r.startsWith("#/s2")) return requireLogin() && renderSubbab2(app);
    if (r.startsWith("#/s3")) return requireLogin() && renderSubbab3(app);
    if (r.startsWith("#/s4")) return requireLogin() && renderSubbab4(app);
    if (r.startsWith("#/eval")) return requireLogin() && renderEvaluasi(app);
    if (r.startsWith("#/final")) return requireLogin() && renderFinal(app);
    if (r.startsWith("#/admin")) return requireLogin() && renderAdmin(app);

    go("#/cover");
}
