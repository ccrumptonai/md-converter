# 📝 Markdown → Anything

Write Markdown, preview it live, and export to **standalone HTML**, **PDF**, and
**slides** — all in your browser. No backend, no build step, no signup.
**Nothing you type ever leaves your machine.**

<!-- TODO: add a demo GIF here, e.g. ![demo](docs/demo.gif) -->

## ✨ Features

- **Live preview** as you type, with GitHub-flavored Markdown + syntax highlighting
- **Themes** — GitHub, Light, and Dark
- **Export standalone HTML** — a single self-contained file that opens anywhere
- **Export PDF** — uses the browser's print dialog (choose *Save as PDF*)
- **Slides mode** — split your document with `---` and present with arrow keys
- **Autosave** — your draft is kept in `localStorage`
- **Zero install** — just open `index.html`

## 🚀 Use it

**Live demo:** _add your GitHub Pages URL here_

Or run locally:

```bash
git clone https://github.com/ccrumptonai/md-converter.git
cd md-converter
# just open index.html in a browser — no server needed
```

> A static server (e.g. `npx serve`) is optional; it's only needed if you want
> exported-HTML CSS extraction to read the CDN highlight theme. Everything else
> works straight from the filesystem.

## ⌨️ Slides controls

| Key | Action |
| --- | ------ |
| → / Space / PgDn | Next slide |
| ← / PgUp | Previous slide |
| Esc | Exit slides |

## 🛠️ Built with

- [marked](https://github.com/markedjs/marked) — Markdown parsing
- [DOMPurify](https://github.com/cure53/DOMPurify) — output sanitization
- [highlight.js](https://highlightjs.org/) — code syntax highlighting

All loaded from a CDN; no package install required.

## 📄 License

MIT
