# Markdown → Anything Converter — Implementation Plan

## Goal
A browser-only tool: paste/write Markdown on the left, see a live preview on the
right, and export to **standalone HTML**, **PDF**, and **slides**. No backend,
no build step, no data leaves the browser. Deployable on GitHub Pages.

## Success Criteria
- [ ] Live editor + preview, updates as you type
- [ ] Export standalone .html (styles inlined, opens anywhere)
- [ ] Export PDF (via browser print with a clean print stylesheet)
- [ ] Export slides (split on `---`, arrow-key navigation)
- [ ] At least 3 preview themes (light, dark, GitHub)
- [ ] Works by opening index.html directly — zero install
- [ ] README with GIF + live demo link

## Stack
- Vanilla JS + HTML + CSS (no framework, no bundler)
- [marked](https://github.com/markedjs/marked) via CDN — Markdown → HTML
- [DOMPurify](https://github.com/cure53/DOMPurify) via CDN — sanitize output
- `highlight.js` via CDN — code block syntax highlighting
- Browser `window.print()` + print CSS for PDF (no PDF lib needed)

## Architecture
```
index.html      # layout: toolbar, editor pane, preview pane
css/app.css     # app chrome + theme variables
css/themes.css  # preview themes (light/dark/github)
css/print.css   # PDF / print rules
js/app.js       # editor wiring, debounced render, theme switch
js/export.js    # HTML download, PDF print, slides mode
sample.md       # demo content loaded on first visit
```

## Build Sequence
1. Static layout + split-pane (toolbar / editor / preview)
2. Wire marked + DOMPurify + highlight.js; debounced live render
3. Theme switcher (CSS variables)
4. Export standalone HTML (inline current theme CSS into a single file)
5. PDF export via print stylesheet
6. Slides mode (parse `---` into sections, keyboard nav, ESC to exit)
7. Sample content + localStorage draft persistence
8. README + demo GIF + GitHub Pages deploy

## Out of Scope (v1)
- Real-time collaboration / accounts
- Server-side rendering
- DOCX/LaTeX export (could be v2)
