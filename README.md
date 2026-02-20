
# BR Hygiene — NaturoWipe

This repository contains the BR Hygiene marketing site built with React + Vite. It is an opinionated, responsive, and accessible front-end with a small Node server under `server/` used for API endpoints during local development.

This README covers:
- Project overview
- Local setup and scripts
- Recommended repository structure and how I organized the project
- How to push to GitHub and deploy to Vercel

---

**Project overview**

This is a Vite + React site (no SSR) that showcases products, clients and contact/inquiry functionality. Styling is contained in `src/index.css` and the app entrypoint is `src/main.jsx` → `src/App.jsx`.

Notes about changes I made:
- Adjusted header and logo styles in `src/index.css` so the logo fits the header at multiple breakpoints while maintaining strong visual presence.

---

## Quick start (local)

1. Install dependencies

```bash
npm install
```

2. Start the dev server

```bash
npm run dev
```

3. API server (optional)

There is a minimal server in the `server/` folder that this front-end expects for product data and form submissions during development. Start it separately from the `server` folder (if used):

```powershell
cd server
npm install
npm run dev
# or: node index.js
```

4. Build for production

```bash
npm run build
npm run preview
```

---

## Project structure (recommended)

I recommend the following structure for clarity and maintainability. The current project already contains most of these files — consider this the target layout.

- `public/` — static assets (images, favicon). Files are served as `/images/...` from the root.
- `src/`
	- `main.jsx` — app entrypoint
	- `App.jsx` — main application (can be split into components)
	- `index.css` — global styles (I updated header/logo rules here)
	- `components/` — (optional) split large components (Header, Footer, ProductCard, Modal, ClientsSlider) into separate files
	- `assets/` — application images and small icons (move brand images here when reorganizing)
- `server/` — optional local API server for products & inquiries
- `.gitignore` — ignores node_modules, personal files, large media

If you'd like, I can split `App.jsx` into `src/components/Header.jsx`, `src/components/Products.jsx`, etc. — tell me which parts you want separated and I'll refactor them.

---

## GitHub and deployment (Vercel)

1) Create a GitHub repo and push the code (example):

```bash
# create remote (replace <URL> with your repo)
git remote add origin <REMOTE_URL>
git push -u origin main
```

2) Deploy to Vercel

Option A — Vercel web UI (recommended):
- Go to https://vercel.com/import
- Select your GitHub repository
- Framework Preset: `Vite`
- Build command: `npm run build`
- Output directory: `dist`
- Click Deploy

Option B — Vercel CLI

```bash
npm i -g vercel
vercel login
vercel --prod
```

Notes: Vercel will run `npm run build` by default for Vite projects. If your server endpoints are required in production, you must host them separately (Vercel Serverless functions or another host). The `server/` folder here is for local dev.

---

## Accessibility and images

- I fixed the logo display so it respects header sizing and responds on mobile. If you'd like the logo in `src/assets/` instead of `public/images/`, I can move it and update references.

---

## Next steps I can do for you

- Split `App.jsx` into smaller components (`Header`, `Footer`, `Products`, `Clients`, `ContactForm`) and move images into `src/assets/`.
- Create a small CI workflow for lint/build on push.
- Connect and push to GitHub for you (requires `gh` CLI or your GitHub repo URL).
- Deploy to Vercel and confirm environment config.

If you want me to proceed with any of the above, tell me which item and I will continue.

---

### Contact

If you have design preferences for the header (height, spacing, or exact logo pixel size), tell me the target height in pixels and I will match it.

Thanks — I updated the header styles and README to help you move forward.
