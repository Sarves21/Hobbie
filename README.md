# Sarvesvar M S — Creative Editor Portfolio

A modern, cinematic single-page portfolio showcasing video edits, mashups, and visual storytelling.

🔗 **Live:** https://sarves21.github.io/Hobbie/

## ✨ Features

- Cinematic dark UI with animated gradient text, drifting aurora glow, and a subtle film-grain overlay
- Interactive cards with a cursor-following spotlight and animated gradient borders
- **Fullscreen video lightbox** — click any edit to watch it big and centered (only one plays at a time)
- Scroll progress bar, active-section nav highlighting, animated stat counter, and magnetic buttons
- Fully responsive (desktop → mobile) with `prefers-reduced-motion` support
- Installable **PWA** (offline-capable) via a service worker and web manifest
- Accessible: keyboard navigation, skip link, focus styles, and screen-reader labels

## 🛠️ Built With

- HTML5 & CSS3 (custom properties, grid, glassmorphism)
- Vanilla JavaScript (ES modules) — no framework, no build step
- [tsParticles](https://tsparticles.github.io/) for the animated particle background
- Google Fonts: Outfit + Space Grotesk

## 📂 Structure

```
index.html              # Page markup
styles.css              # All styling
app.js                  # Interactions (particles, animations, video lightbox, PWA)
sw.js                   # Service worker (offline support)
manifest.webmanifest    # PWA manifest
icon.svg                # App / favicon icon
```

## 🚀 Run Locally

The site uses ES modules and a service worker, so serve it over HTTP (not `file://`):

```bash
python -m http.server 8000
# then open http://localhost:8000
```

## 📬 Connect

- Instagram — [@aragorn.ii](https://www.instagram.com/aragorn.ii/)
- LinkedIn — [in/sarvesvar](https://www.linkedin.com/in/sarvesvar/)
- GitHub — [@Sarves21](https://github.com/Sarves21)
