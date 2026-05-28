<div align="center">

# 🐱 Cat Blast

**A block puzzle game where every piece is an animated cat.**

[![Play Now](https://img.shields.io/badge/Play%20Now-Live%20Demo-ff6b6b?style=for-the-badge&logo=googlechrome&logoColor=white)](https://oxyloop.github.io/Cat-Blast/)
[![Platform](https://img.shields.io/badge/Platform-Web%20%7C%20Android-4a90d9?style=for-the-badge&logo=android&logoColor=white)](#)
[![Tech](https://img.shields.io/badge/Tech-Vanilla%20JS-f7df1e?style=for-the-badge&logo=javascript&logoColor=black)](#)

</div>

---

## Overview

Cat Blast is a browser-based block puzzle game inspired by classic tile-clearing mechanics. Place cat-shaped pieces on a grid, clear full rows or columns, and advance through progressively harder levels — all without any framework or build step.

Each block shape is a **hand-crafted, animated cat sprite** that reacts when placed and cleared.

---

## Gameplay

1. Three random cat pieces appear in the tray below the grid.
2. **Drag and drop** (or tap on mobile) a piece onto any valid cell.
3. Completing a full row or column clears it and awards points.
4. Reach the level's target score to advance.
5. The game ends when none of the three pieces can be placed anywhere.

---

## Levels

| # | Name | Grid | Obstacles | Target Score |
|---|------|:----:|:---------:|:------------:|
| 1 | Başlangıç *(Beginner)* | 7×7 | 0 | 400 |
| 2 | Orta *(Medium)* | 8×8 | 4 | 700 |
| 3 | Zor *(Hard)* | 8×8 | 10 | 1,100 |
| 4 | Çok Zor *(Very Hard)* | 9×9 | 14 | 1,600 |
| 5 | Uzman *(Expert)* | 9×9 | 20 | 2,200 |

After Level 5, the game continues in **Endless Mode** — no target, no ceiling.

---

## Cat Pieces

Each distinct block shape is paired with a unique animated cat:

| Sprite | Shape | Animation |
|--------|-------|-----------|
| 1×1 Block Cat | Single cell | 6-frame idle loop |
| 1×2 Vertical Block | Tall column | 6-frame idle loop |
| 3×1 Horizontal Block | Wide row | 5-frame idle loop |
| 2×2 Block Cat | Square | 6-frame idle loop |
| 2×3 Bottom-Left Corner | L-shape | 6-frame idle loop |
| 3×3 Upper-Right Corner | L-shape | 6-frame idle loop |

Cats idle, blink, and animate between placements. Adding new cat types only requires dropping a sprite sheet and adding one entry to `CAT_DEFS` in `block_blast.js`.

---

## Features

- **Animated sprites** — every block shape has a dedicated cat character with frame-by-frame animation
- **Background music & SFX** — themed audio for gameplay events
- **Dark mode** — automatic or manual toggle
- **5 hand-tuned levels** — scaling grid size and obstacle count
- **Endless mode** — unlimited play after completing all levels
- **Mobile-friendly** — drag, drop, and tap support across screen sizes
- **Android app** — wrapped with Capacitor; installable as a native APK

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Language | Vanilla JavaScript (ES6+) |
| Markup | HTML5 |
| Styling | CSS3 (custom properties, grid, animations) |
| Audio | Web Audio API |
| Mobile | [Capacitor](https://capacitorjs.com/) (Android wrapper) |
| Hosting | GitHub Pages |

No frameworks. No build step. No dependencies in the browser bundle.

---

## Running Locally

```bash
git clone https://github.com/oxyloop/Cat-Blast.git
cd Cat-Blast
```

Open `index.html` directly in a browser, or serve with any static file server:

```bash
# Python
python -m http.server 8080

# Node.js (npx)
npx serve .
```

Then visit `http://localhost:8080`.

---

## Project Structure

```
Cat Blast/
├── www/
│   ├── index.html          # Game shell & UI
│   ├── block_blast.js      # All game logic (levels, shapes, rendering, audio)
│   ├── sprites/            # Animated cat sprite sheets (PNG)
│   └── Sounds/             # Background music & sound effects
└── android/                # Capacitor Android project
```

---

## Adding a New Cat Piece

1. Add a sprite sheet PNG to `www/sprites/`.
2. Append an entry to `CAT_DEFS` in `www/block_blast.js`:

```js
{
  shape: [[1, 0], [1, 1]],          // 2D array matching the block layout
  sheet: 'sprites/my-cat.png',
  frames: 6, fpr: 6, fps: 10,
  earBodyY: 18,
}
```

The engine picks up the new piece automatically on the next load.

---

<div align="center">

Made with ❤️ and too many cat sprites.

</div>
