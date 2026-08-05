# Standard landing page for my Web (belvicto.com)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE) [![Version](https://img.shields.io/badge/version-0.0.0-blue.svg)](package.json)

Small Vite + React app used for https://www.belvicto.com/.

## Build

Install dependencies and build a production bundle:

```bash
npm install
npm run build
```

The build output is written to `../../dist/apps/web` relative to this folder. The files you should publish are:

- `index.html`
- the `assets/` folder and any other generated files in `../../dist/apps/web`

## Deploy (any hosting provider)

Publish the files in `../../dist/apps/web` to your hosting provider's web root. Common options:

- File manager / control panel: Upload the contents of `../../dist/apps/web` into the site root (for many providers this is `public_html` or `www`).
- FTP/SFTP: Connect with your FTP credentials and upload the files to the site root.
- Git-based deploys (Netlify, Vercel, GitHub Pages, etc.): Configure the provider to build or serve the `dist` output (or use their build step to run `npm run build`).

Important: upload the *contents* of the `web` build folder (for example `index.html` and the `assets/` folder) — not the parent `dist` directory itself.

If you use client-side routing, configure your hosting server to serve `index.html` for unknown routes. Examples:

- Apache (`.htaccess`):

```apache
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

- Nginx (example):

```nginx
location / {
	try_files $uri $uri/ /index.html;
}
```

## Git / GitHub

This directory was initialized as a Git repository. To push to GitHub (replace the URL):

```bash
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

If the remote repo's default branch is `master` (see note below), you can create `main` locally and push it as shown above.

## Why is the branch `master` and not `main`?

Historically Git used `master` as the default branch name. In recent years many providers (including GitHub) changed the default to `main`. If you see `master` it can be because:

- The remote repository was created a long time ago or with an older default that used `master`.
- The repo was created with an explicit default branch set to `master`.
- A tooling or organization policy still prefers `master`.

To check the current local branch:

```bash
git branch --show-current
```

To check the remote default branch (what `HEAD` points to):

```bash
git ls-remote --symref origin HEAD
```

To rename `master` → `main` (local + remote):

```bash
git branch -m master main
git push -u origin main
# On GitHub change the default branch in the repository settings to `main`, then optionally delete `master`:
git push origin --delete master
```

If you want, I can update the remote default branch for you (I can create the repo and adjust the default if you install and authenticate the GitHub CLI `gh`, or I can follow a remote URL you provide).

## Contributing

1. Create a branch from `main`.
2. Open a PR against `main`.

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
