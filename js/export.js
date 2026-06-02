/* export.js — standalone HTML download, PDF (print), and slides mode. */
(() => {
  "use strict";

  const HLJS_CDN = "https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/styles/";
  const HLJS_FOR_THEME = { github: "github.min.css", light: "github.min.css", dark: "github-dark.min.css" };

  /** Pull just the `.markdown-body` rules from loaded stylesheets so the
   *  exported file is self-contained without duplicating CSS in JS. */
  function collectMarkdownCss() {
    let css = "";
    for (const sheet of document.styleSheets) {
      let rules;
      try { rules = sheet.cssRules; } catch (_) { continue; } // skip cross-origin (CDN)
      if (!rules) continue;
      for (const rule of rules) {
        if (rule.selectorText && rule.selectorText.includes("markdown-body")) {
          css += rule.cssText + "\n";
        }
      }
    }
    return css;
  }

  function downloadFile(name, content, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = name;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  // ---- Export standalone HTML --------------------------------------------
  function exportHTML() {
    const theme = window.mdApp.getTheme();
    const bodyHTML = window.mdApp.getPreviewHTML();
    const hljsHref = HLJS_CDN + (HLJS_FOR_THEME[theme] || HLJS_FOR_THEME.github);

    const doc = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Exported document</title>
<link rel="stylesheet" href="${hljsHref}">
<style>
body { margin: 0; background: ${theme === "dark" ? "#15171c" : "#fff"}; }
.markdown-body { max-width: 820px; margin: 0 auto; padding: 2.5rem 1.5rem; }
${collectMarkdownCss()}
</style>
</head>
<body>
<article class="markdown-body" data-theme="${theme}">
${bodyHTML}
</article>
</body>
</html>`;

    downloadFile("document.html", doc, "text/html");
  }

  // ---- Export PDF (print) -------------------------------------------------
  function exportPDF() {
    window.print(); // print.css restyles for paper; user chooses "Save as PDF"
  }

  // ---- Slides -------------------------------------------------------------
  const overlay = document.getElementById("slides");
  const slideEl = document.getElementById("slide");
  const counter = document.getElementById("slide-counter");
  let slides = [];
  let idx = 0;

  function buildSlides() {
    // Split raw markdown on horizontal-rule lines (--- on their own line).
    const md = window.mdApp.getMarkdown();
    slides = md.split(/^\s*---\s*$/m).map((s) => s.trim()).filter(Boolean);
    if (slides.length === 0) slides = [""];
  }

  function showSlide(i) {
    idx = Math.max(0, Math.min(i, slides.length - 1));
    slideEl.innerHTML = window.mdApp.renderMarkdown(slides[idx]);
    slideEl.setAttribute("data-theme", "light");
    counter.textContent = `${idx + 1} / ${slides.length}`;
    slideEl.scrollTop = 0;
  }

  function openSlides() {
    buildSlides();
    showSlide(0);
    overlay.hidden = false;
    document.addEventListener("keydown", onSlideKey);
  }

  function closeSlides() {
    overlay.hidden = true;
    document.removeEventListener("keydown", onSlideKey);
  }

  function onSlideKey(e) {
    if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") { e.preventDefault(); showSlide(idx + 1); }
    else if (e.key === "ArrowLeft" || e.key === "PageUp") { e.preventDefault(); showSlide(idx - 1); }
    else if (e.key === "Escape") { closeSlides(); }
  }

  // ---- Wiring -------------------------------------------------------------
  document.getElementById("btn-html").addEventListener("click", exportHTML);
  document.getElementById("btn-pdf").addEventListener("click", exportPDF);
  document.getElementById("btn-slides").addEventListener("click", openSlides);
  document.getElementById("slides-close").addEventListener("click", closeSlides);
  document.getElementById("slide-prev").addEventListener("click", () => showSlide(idx - 1));
  document.getElementById("slide-next").addEventListener("click", () => showSlide(idx + 1));
})();
