# Publishing to GitHub Pages (Vite + React)

This app is a static client-only build. Nothing server-side runs on Pages. Data stays in the visitor’s browser unless they export JSON.

## 1. Repository and `base` URL

GitHub **project** sites use a path prefix:

`https://<owner>.github.io/<repository-name>/`

Vite must use the same prefix for asset URLs. This repo’s Vite config sets:

- `base: '/'` when **`GITHUB_REPOSITORY_NAME` is unset** (local `npm run dev` and local `npm run preview` of `dist/` at the root).
- `base: '/<repo>/'` when **`GITHUB_REPOSITORY_NAME`** matches the GitHub repository name.

**Before the first Pages build**, set the env var to your **actual** repo name (the segment in the URL, case-sensitive as GitHub serves it).

Examples:

- Bash: `GITHUB_REPOSITORY_NAME=my-repo npm run build`
- PowerShell: `$env:GITHUB_REPOSITORY_NAME='my-repo'; npm run build`

If `base` does not match the repo name, you will get blank pages or missing JS/CSS.

## 2. Build

```bash
npm ci
GITHUB_REPOSITORY_NAME=<your-repo-name> npm run build
```

Output is in `dist/`. That folder is gitignored on purpose; Pages should deploy **artifacts**, not commit `dist/` to `main` unless you intentionally choose that workflow.

## 3. Enable GitHub Pages

In the GitHub repo: **Settings → Pages**.

- **Source**: either  
  - **GitHub Actions** (recommended): add a workflow that runs the build above and uploads `dist/` (search “vite github actions deploy pages” for the current official template), or  
  - **Deploy from a branch** / **GitHub Actions** artifact from CI.

Do not enable Pages on a branch that contains secrets or private data; this project should not contain any.

## 4. Final security pass before going public

Use this as a checklist when the repo moves to GitHub:

1. **Secrets**  
   - Confirm no API keys, tokens, or internal URLs in source, `index.html`, or committed JSON.  
   - Keep `.env` out of git (see root `.gitignore`). This app has no required env vars for the public build.

2. **What you push**  
   - `node_modules/` and `dist/` stay ignored.  
   - Do not commit local canvas exports that contain real client data (if you ever add fixtures, sanitize them).

3. **Dependencies**  
   - Run `npm audit` before releases; upgrade where reasonable.

4. **Runtime behavior**  
   - The app uses `localStorage` only on the user’s machine; mention that in release notes or the LinkedIn post so expectations are clear.

5. **Repository metadata**  
   - Set repo description and optional **website** URL to the Pages link once live.

## 5. After deploy

Open the Pages URL, hard-refresh once, and verify:

- Intro modal and main UI load.  
- Preset dropdown opens and loads an example.  
- Export/import still works (paths are relative to `base`).

If anything fails, almost always **`GITHUB_REPOSITORY_NAME` ≠ repo name** or Pages is pointing at the wrong folder.
