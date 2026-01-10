# InStyle Modern Wood Art Site

React 19 + Vite project powering the InStyle Modern Wood Art marketing/catalog site.

## Core Stack
- React 19 / Vite 7
- Tailwind utility classes (via PostCSS config) + custom design tokens
- Dynamic contact grid with copy-to-clipboard + hours logic (Asia/Beirut)
- Image optimization pipeline placeholders (LQIP + social ingestion)

## Social Image Ingestion
Hero, category tiles and future spotlight sections can use real Instagram imagery placed under `public/images/social/`.

### 1. Prepare Post URLs
Create / edit `scripts/instagram-posts.json` with direct image URLs (or proxied CDN links):

```json
[
	"https://example.com/path/to/first-instagram-image.jpg",
	"https://example.com/path/to/second-instagram-image.jpg"
]
```

If you have objects, you can use `{ "url": "...", "id": "slug" }` format.

### 2. Install Sharp
```bash
npm install --save-dev sharp
```

### 3. Run Ingestion Script (Responsive + Blur)
```bash
node scripts/fetch-instagram-posts.cjs
```
Generates multiple sizes (`400, 800, 1200`) and a blur LQIP data URI in `manifest.json` like:
```json
{
	"post123": {
		"original": "post123-1711387212345.jpg",
		"sources": {
			"avif": {"400":"post123-400-1711387212345.avif","800":"post123-800-1711387212345.avif","1200":"post123-1200-1711387212345.avif"},
			"webp": {"400":"post123-400-1711387212345.webp","800":"post123-800-1711387212345.webp","1200":"post123-1200-1711387212345.webp"}
		},
		"blurData": "data:image/webp;base64,..."
	}
}
```

### 4. Naming Conventions
- Hero image expected at: `public/images/social/post-hero.avif` (you can symlink or copy one output there).
- Category fallbacks look for: `post-1.avif`, `post-2.avif`, etc. (edit logic as needed in `CategoryGrid`).
- You may replace product or spotlight sections similarly by pointing to social assets instead of remote Unsplash placeholders.

### 5. Updating Hero
`HERO_SLIDE.image` now points to `/images/social/post-hero.avif`. Ensure you place a real file there for production. Vite will serve it directly.

## Contact Section Anchor
Top navigation "Contact Us" smoothly scrolls to the footer contact grid via `id="contact"`.

## Development
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
npm run preview
```

## Copy-to-Clipboard Toast
Implemented in `FooterContactGrid` via `onCopy` callbacks; ephemeral toast disappears after ~1.8s.

## Instagram Token Automation (Outline)
Instagram Basic Display API steps (once you migrate from manual URLs):
1. Create Facebook App -> Add Instagram Basic Display product.
2. Configure valid redirect URI.
3. User authenticates -> short-lived token.
4. Exchange for long-lived token (GET graph.instagram.com/access_token).
5. Store token securely (.env local, secret manager in production).
6. Schedule refresh every ~30 days (graph.instagram.com/refresh_access_token).
7. Cron (GitHub Actions / server) runs ingestion script daily: fetch latest media endpoints -> collect image URLs -> update `instagram-posts.json` -> run conversion.
8. Purge old images beyond retention window (e.g., keep last 30 posts) and rebuild manifest.

Example cron (GitHub Actions):
```yaml
name: Refresh Instagram Media
on:
	schedule:
		- cron: '0 3 * * *'
jobs:
	fetch-media:
		runs-on: ubuntu-latest
		steps:
			- uses: actions/checkout@v4
			- name: Setup Node
				uses: actions/setup-node@v4
				with:
					node-version: 20
			- name: Install deps
				run: npm ci
			- name: Fetch media JSON
				run: node scripts/fetch-instagram-api.js # (to be implemented)
			- name: Generate responsive assets
				run: node scripts/fetch-instagram-posts.cjs
			- name: Commit & push
				run: |
					git config user.name 'automation'
					git config user.email 'actions@github.com'
					git add public/images/social
					git commit -m 'chore: update social images' || echo 'No changes'
					git push
```

## Future Enhancements
- Manifest-driven smart selection (hero vs category prioritization).
- Automatic srcset + `<picture>` emission for each component.
- Blur-up transition (swap blurData background to sharp image on load).
- On-demand image pruning & disk usage reporting.

## License
Internal project — no open license specified.
