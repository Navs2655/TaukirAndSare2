# Taukir & Sara — Nikah Invitation

## Step 1 complete: foundation
- Next.js 14 App Router + TypeScript
- Tailwind configured with luxury palette (background, gold, champagne, emerald)
- Fonts: Cormorant Garamond, Inter, Amiri (self-hosted via next/font, zero layout shift)
- Lenis smooth scroll (auto-disables when the visitor prefers reduced motion)
- Floating navigation with scroll progress bar
- Folder structure: components/layout, components/ui, hooks, utils, styles, public/assets

## Run entirely in the cloud (no local machine)

### Option A — GitHub Codespaces (recommended)
1. Create a new **private** GitHub repo, e.g. `nikah-invitation`.
2. Upload this project's files to that repo (drag-and-drop works on github.com, or use the Codespaces file explorer).
3. On the repo page: **Code → Codespaces → Create codespace on main**.
4. In the Codespaces terminal:
   ```
   npm install
   npm run dev
   ```
5. Codespaces will pop up a "forward port 3000" link — click it to preview live in browser.

### Option B — StackBlitz
1. Go to stackblitz.com → "Import from GitHub" → paste your repo URL.
2. It installs and runs automatically in-browser.

## Deploy live — 100% on GitHub Pages (using your free student domain)

This project is already configured for static export (`output: "export"` in `next.config.mjs`) and includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that auto-builds and deploys on every push.

### 1. Claim your free domain
Go to education.github.com/pack → find the Namecheap "1 year free domain" offer → claim a `.me` (or similar) domain.

### 2. Push this repo to GitHub
```
git init
git add .
git commit -m "Step 1: foundation"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

### 3. Enable GitHub Pages
Repo → **Settings → Pages → Build and deployment → Source: GitHub Actions**.
The workflow runs automatically and deploys to `https://<your-username>.github.io/<repo-name>`.

### 4. Point your custom domain
1. Edit `public/CNAME` in this repo — replace the placeholder with your actual domain, e.g. `taukirandsara.me`.
2. In Namecheap → Domain List → your domain → **Manage → Advanced DNS**, add:
   | Type | Host | Value |
   |------|------|-------|
   | A | @ | 185.199.108.153 |
   | A | @ | 185.199.109.153 |
   | A | @ | 185.199.110.153 |
   | A | @ | 185.199.111.153 |
   | CNAME | www | `<your-username>.github.io` |
3. Back in repo → **Settings → Pages → Custom domain** → enter your domain → Save → wait for DNS check (can take up to an hour) → enable **Enforce HTTPS**.

Your site will then be live at `https://taukirandsara.me` (or whatever you chose) — share that on WhatsApp.

Every future `git push` to `main` auto-rebuilds and redeploys — no manual steps needed.

> Note: static export means no server-side API routes. This project is pure frontend (RSVP form has no backend per the spec), so nothing is lost.

## Next steps
Say "Step 2" to build the Hero section (stars, moonlight, entrance animation, Arabic blessing, particles).
