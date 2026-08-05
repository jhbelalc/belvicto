# Standard landing page for my Web (belvicto.com)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE) [![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](package.json)

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

## Contributing

1. Create a branch from `main`.
2. Open a PR against `main`.

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
