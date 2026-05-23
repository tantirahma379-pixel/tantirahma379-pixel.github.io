
/***********************
 * Utils & Helpers
 ***********************/
const $ = (sel) => document.querySelector(sel);

function nowISO() { return new Date().toISOString(); }
function year() { return new Date().getFullYear(); }

function toast(text) {
    const t = document.createElement("div");
    t.textContent = text;
    Object.assign(t.style, {
        position: "fixed",
        left: "50%",
        bottom: "18px",
        transform: "translateX(-50%)",
        padding: "12px 14px",
        borderRadius: "999px",
        background: "rgba(255,255,255,.72)",
        border: "1px solid rgba(17,24,39,.14)",
        boxShadow: "0 18px 70px rgba(0,0,0,.18)",
        backdropFilter: "blur(12px)",
        fontWeight: "900",
        letterSpacing: ".2px",
        zIndex: 80
    });
    document.body.appendChild(t);
    setTimeout(() => {
        t.style.transition = "opacity .2s ease, transform .2s ease";
        t.style.opacity = "0";
        t.style.transform = "translateX(-50%) translateY(10px)";
        setTimeout(() => t.remove(), 240);
    }, 1200);
}

function fmtScore(v) {
    return (typeof v === "number" && !Number.isNaN(v)) ? v : "—";
}

function shortDate(iso) {
    if (!iso) return "";
    try { return new Date(iso).toLocaleString("id-ID"); }
    catch (e) { return String(iso); }
}

function escapeHtml(str) {
    return String(str ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}
function escapeAttr(str) { return escapeHtml(str).replaceAll("\n", " "); }
function escapeTextarea(str) { return String(str ?? "").replaceAll("</textarea>", "&lt;/textarea&gt;"); }

function safeFile(name) {
    return String(name || "user").replaceAll(/[^a-z0-9_\-]+/gi, "_").slice(0, 40);
}
function todayStamp() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const da = String(d.getDate()).padStart(2, "0");
    return `${y}${m}${da}`;
}

/***********************
 * Export Logic
 ***********************/
function downloadMyReport(type) {
    const row = currentUserResult();
    if (!row) {
        toast("Belum ada data untuk diunduh.");
        return;
    }
    exportRows([row], type, `ThermoLearn_Report_${safeFile(row.name)}_${todayStamp()}`);
}

function exportRows(rows, type, filename) {
    if (!rows || !rows.length) {
        toast("Tidak ada data.");
        return;
    }

    if (type === "html") {
        const html = toHTMLReport(rows[0]);
        downloadBlob(new Blob([html], { type: "text/html;charset=utf-8;" }), `${filename}.html`);
        toast("HTML terunduh ✅");
        return;
    }

    if (type === "pdf") {
        toPDF(rows, filename);
        return;
    }

    toast("Format tidak dikenal.");
}

function toHTMLReport(row) {
    const date = new Date().toLocaleString("id-ID");
    return `
<!doctype html>
<html lang="id">
<head>
<meta charset="utf-8"/>
<title>ThermoLearn — Report</title>
<style>
  body{ font-family: Arial, sans-serif; padding:20px; }
  table{ border-collapse: collapse; width:100%; margin-top:12px; }
  th,td{ border:1px solid #bbb; padding:10px; font-size:12px; vertical-align:top; }
  th{ background:#f2f2f2; }
  .box{ white-space:pre-wrap; border:1px solid #ddd; padding:12px; border-radius:8px; background:#fafafa; }
</style>
</head>
<body>
  <h1>ThermoLearn — Rekap Nilai</h1>
  <small>Nama: ${escapeHtml(row.name || "")}<br/>Email: ${escapeHtml(row.email || "")}<br/>Diekspor: ${escapeHtml(date)}</small>
  <table>
    <thead><tr><th>Komponen</th><th>Skor</th></tr></thead>
    <tbody>
      <tr><td>Subbab 1</td><td>${fmtScore(row.s1)}</td></tr>
      <tr><td>Subbab 2</td><td>${fmtScore(row.s2)}</td></tr>
      <tr><td>Subbab 3</td><td>${fmtScore(row.s3)}</td></tr>
      <tr><td>Subbab 4</td><td>${fmtScore(row.s4)}</td></tr>
      <tr><td>Evaluasi</td><td>${fmtScore(row.eval)}</td></tr>
      <tr><td><b>Total</b></td><td><b>${fmtScore(row.total)}</b></td></tr>
    </tbody>
  </table>
  <h3>Kesimpulan</h3>
  <div class="box">${escapeHtml(row.summary || "")}</div>
</body>
</html>
  `.trim();
}

async function toPDF(rows, filename) {
    const jspdf = window.jspdf?.jsPDF;
    if (!jspdf) {
        toast("Library PDF belum siap. Coba lagi sebentar.");
        return;
    }

    const r = rows[0];
    const doc = new jspdf({ unit: "pt", format: "a4" });
    const margin = 40;
    let y = margin;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("ThermoLearn — Rekap Nilai (Terkunci)", margin, y); y += 18;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Nama: ${String(r.name || "")}`, margin, y); y += 12;
    doc.text(`Email: ${String(r.email || "")}`, margin, y); y += 12;
    doc.text(`Diekspor: ${new Date().toLocaleString("id-ID")}`, margin, y); y += 16;

    doc.setLineWidth(0.7);
    doc.line(margin, y, 555, y);
    y += 16;

    const items = [
        ["Subbab 1", fmtScore(r.s1)],
        ["Subbab 2", fmtScore(r.s2)],
        ["Subbab 3", fmtScore(r.s3)],
        ["Subbab 4", fmtScore(r.s4)],
        ["Evaluasi", fmtScore(r.eval)],
        ["Total (rata-rata)", fmtScore(r.total)]
    ];

    doc.setFont("helvetica", "bold");
    doc.text("Nilai:", margin, y); y += 12;

    doc.setFont("helvetica", "normal");
    items.forEach(it => {
        doc.text(`${it[0]}: ${it[1]}`, margin, y);
        y += 12;
    });

    y += 10;
    doc.setFont("helvetica", "bold");
    doc.text("Kesimpulan:", margin, y); y += 12;
    doc.setFont("helvetica", "normal");

    const summaryLines = doc.splitTextToSize(String(r.summary || ""), 520);
    summaryLines.forEach(line => {
        if (y > 780) { doc.addPage(); y = margin; }
        doc.text(line, margin, y);
        y += 12;
    });

    doc.save(`${filename}.pdf`);
    toast("PDF terunduh ✅");
}

function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}
