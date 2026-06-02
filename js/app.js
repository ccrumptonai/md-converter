/* app.js — editor wiring, live render, theme switching, draft persistence. */
(() => {
  "use strict";

  const STORAGE_KEY = "md-converter:draft";
  const THEME_KEY = "md-converter:theme";

  const editor = document.getElementById("editor");
  const preview = document.getElementById("preview");
  const themeSelect = document.getElementById("theme-select");
  const hljsTheme = document.getElementById("hljs-theme");

  // highlight.js stylesheet that best matches each preview theme.
  const HLJS_CDN = "https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/styles/";
  const HLJS_FOR_THEME = {
    github: "github.min.css",
    light: "github.min.css",
    dark: "github-dark.min.css",
  };

  const SAMPLE = `# Markdown → Anything

Welcome! Edit on the left and watch the preview update. When you're happy, **export**.

## What you can do

- ✍️  **Bold**, _italics_, \`inline code\`, and [links](https://github.com).
- 🎨  Switch the preview **theme** in the toolbar.
- 📄  **Export HTML** — a self-contained file you can open anywhere.
- 🖨️  **Export PDF** — opens the print dialog; pick *Save as PDF*.
- 🎞️  **Slides** — split with \`---\` and present.

## Code is highlighted

\`\`\`js
function greet(name) {
  return \`Hello, \${name}!\`;
}
console.log(greet("world"));
\`\`\`

| Feature | Status |
| ------- | ------ |
| Live preview | ✅ |
| HTML / PDF / Slides export | ✅ |

> Everything runs in your browser. Nothing is uploaded.

---

## Slide two

Anything after a \`---\` becomes a new slide. Use ← / → and press **Esc** to exit.

---

## That's it ✨
`;

  // marked: enable GFM + per-block syntax highlighting via highlight.js.
  marked.setOptions({
    gfm: true,
    breaks: false,
    highlight(code, lang) {
      if (window.hljs && lang && hljs.getLanguage(lang)) {
        try { return hljs.highlight(code, { language: lang }).value; } catch (_) {}
      }
      return window.hljs ? hljs.highlightAuto(code).value : code;
    },
  });

  /** Render the current editor content into the preview pane (sanitized). */
  function render() {
    const dirty = marked.parse(editor.value);
    preview.innerHTML = DOMPurify.sanitize(dirty);
  }

  function debounce(fn, ms) {
    let t;
    return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
  }

  function setTheme(name) {
    preview.setAttribute("data-theme", name);
    themeSelect.value = name;
    hljsTheme.href = HLJS_CDN + (HLJS_FOR_THEME[name] || HLJS_FOR_THEME.github);
    localStorage.setItem(THEME_KEY, name);
  }

  // ---- Wiring -------------------------------------------------------------
  const persist = debounce(() => localStorage.setItem(STORAGE_KEY, editor.value), 400);
  const liveRender = debounce(render, 120);

  editor.addEventListener("input", () => { liveRender(); persist(); });

  // Allow Tab to insert two spaces instead of leaving the textarea.
  editor.addEventListener("keydown", (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const s = editor.selectionStart, end = editor.selectionEnd;
      editor.value = editor.value.slice(0, s) + "  " + editor.value.slice(end);
      editor.selectionStart = editor.selectionEnd = s + 2;
      liveRender(); persist();
    }
  });

  themeSelect.addEventListener("change", () => setTheme(themeSelect.value));

  document.getElementById("btn-sample").addEventListener("click", () => {
    editor.value = SAMPLE;
    render();
    localStorage.setItem(STORAGE_KEY, editor.value);
  });

  // ---- Init ---------------------------------------------------------------
  setTheme(localStorage.getItem(THEME_KEY) || "github");
  editor.value = localStorage.getItem(STORAGE_KEY) ?? SAMPLE;
  render();

  // Expose for export.js (rendered HTML + current theme).
  window.mdApp = {
    getPreviewHTML: () => preview.innerHTML,
    getTheme: () => preview.getAttribute("data-theme"),
    getMarkdown: () => editor.value,
    renderMarkdown: (md) => DOMPurify.sanitize(marked.parse(md)),
  };
})();
