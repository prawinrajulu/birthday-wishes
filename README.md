# 🎂 Birthday Surprise Website

A cinematic, romantic birthday surprise website built with **React + Vite + Framer Motion**.

---

## 🚀 Quick Start

**Option 1 — Double-click launcher:**
```
Double-click START.bat
```

**Option 2 — Terminal:**
```bash
cd "d:\birthday gift\birthday-surprise"
npm install
npm run dev
```

Then open → **http://localhost:3000**

---

## 🔑 How to Customize

All personal details are in one file: **`src/data/config.js`**

| What to change | Where |
|---|---|
| Passcode (4-digit) | `CONFIG.passcode` |
| Birthday girl's name | `CONFIG.birthdayGirlName` |
| Your name (sender) | `CONFIG.senderName` |
| Background music file | `CONFIG.musicFile` |
| Letter message | `CONFIG.letterMessage` |

---

## 📸 Adding Real Photos

1. Place your **8 photo files** inside: `public/images/`
2. Name them: `photo1.jpg`, `photo2.jpg` ... `photo8.jpg`
3. Edit captions in: `src/data/photos.js`

---

## 🎵 Adding Background Music

1. Download a romantic piano / acoustic MP3 (free from [Pixabay](https://pixabay.com/music/) or [Bensound](https://bensound.com))
2. Rename it to: `romantic-background.mp3`
3. Place it in: `public/music/`

> Music auto-plays on first user interaction (browser policy).

---

## 🌐 Deploy Online (Share the link!)

```bash
npm run build
```
Then upload the `dist/` folder to:
- **Netlify** → drag & drop `dist/` at netlify.com/drop
- **Vercel** → `npx vercel --prod`
- **GitHub Pages** → push and enable Pages

---

## 📁 Project Structure

```
birthday-surprise/
├── public/
│   ├── images/          ← Add photo1.jpg ... photo8.jpg here
│   ├── music/           ← Add romantic-background.mp3 here
│   └── heart.svg        ← Browser tab icon
│
├── src/
│   ├── data/
│   │   ├── config.js    ← ✏️ Edit all personal details here
│   │   └── photos.js    ← ✏️ Edit photo captions here
│   │
│   ├── components/
│   │   ├── TeddyBear.jsx        ← Animated SVG teddy (5 moods)
│   │   ├── FloatingParticles.jsx← Canvas hearts/petals/stars
│   │   ├── MusicController.jsx  ← Play/pause + volume
│   │   ├── GiftBox.jsx          ← 3D gift box card
│   │   ├── PhotoModal.jsx       ← Cinematic photo popup
│   │   ├── HeartBurst.jsx       ← Canvas heart explosion
│   │   └── BackButton.jsx       ← Scene back navigation
│   │
│   ├── pages/
│   │   ├── LockScreen.jsx   ← 🔐 Passcode screen
│   │   ├── GiftSelection.jsx← 🎁 Three gifts scene
│   │   ├── MemoryTree.jsx   ← 🌸 Growing memory tree
│   │   ├── BirthdayCake.jsx ← 🎂 Candle blow scene
│   │   └── LoveLetter.jsx   ← 💌 Envelope & letter
│   │
│   ├── App.jsx    ← Scene router
│   ├── main.jsx   ← React entry
│   └── style.css  ← Full design system
│
├── START.bat      ← One-click launcher
└── package.json
```

---

## ✨ Features

| Feature | Details |
|---|---|
| 🔐 Passcode lock | 4-digit OTP with shake/teddy/heart-burst |
| 🎁 Gift selection | 3 animated 3D gift boxes with hover glow |
| 🌸 Memory tree | SVG tree grows trunk → branches → photos |
| 🎂 Birthday cake | 7 animated candles, sequential blow-out, confetti |
| 💌 Love letter | Envelope opens, typewriter letter, heart burst |
| 🐻 Teddy bear | 5 moods — SVG, animated, speech bubbles |
| 🎵 Music | Auto-play with play/pause and volume control |
| ✨ Particles | Canvas hearts, rose petals, stars on every scene |
| 📱 Responsive | Mobile, tablet, desktop — all screen sizes |
| 🎬 Transitions | Framer Motion AnimatePresence between scenes |

---

## 🛠️ Tech Stack

- **React 18** + **Vite 5**
- **Framer Motion 11** — page transitions, spring animations
- **HTML5 Canvas** — floating particles, heart bursts, confetti
- **CSS3** — glassmorphism, gradients, keyframe animations
- **Google Fonts** — Dancing Script, Playfair Display, Inter, Satisfy

---

*Made with ❤️ for someone very special.*
