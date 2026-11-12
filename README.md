# Many Mansions

A 12-pillar Mormon / Latter-day Saint personality test. It's plain HTML, CSS and JS with no framework, and it deploys free on Vercel.

## Files
- `assets/data.js`: all content (12 pillars, 60 statements, 16 types, 14 scripture figures, 13 missions). Edit this file to change wording.
- `assets/quiz.js`: quiz engine (Quick 24 / Full 48, swap, back, auto-advance, keys 1–5, progress saved in the browser).
- `assets/results.js`: call-letter envelope, Sunstone chart, 12 sliders, "your room in the house" and matches.
- `assets/share.js`: draws the 1080×1920 Story image and handles link sharing.
- `build.js`: generates `index.html`, `quiz.html`, `results.html`, `types/*.html`, `sitemap.xml`, `robots.txt` and `vercel.json`.

## Edit, then rebuild
```
node build.js
```
After you buy a domain, rebuild with it so the canonical tags and sitemap point at the right place:
```
SITE_URL=https://yourdomain.com node build.js
```

## Preview locally
```
node serve.js
```
Then open http://localhost:4173

## Deploy
Push the folder to GitHub, import it on vercel.com (no build command needed), and add your domain.

## AdSense
Once approved, paste your AdSense script tag where the comment is in `build.js` (inside `<head>`). Ad units go in the `<div class="ad-slot">` spots on the results and type pages. Rebuild after.
