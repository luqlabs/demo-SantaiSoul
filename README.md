<div align="center">

# SANTAISOUL

### *Luxury Aromatherapy & Digital Healing Sanctuary*

**A high-fidelity interactive prototype** — built to demonstrate the full product experience of SantaiSoul.com before production build on Webflow + Memberstack + Stripe.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-C5A880?style=for-the-badge&logo=vercel&logoColor=white)](https://demo-santai-soul.vercel.app)
[![GitHub](https://img.shields.io/badge/Repository-luqlabs%2Fdemo--SantaiSoul-1B3B2B?style=for-the-badge&logo=github&logoColor=white)](https://github.com/luqlabs/demo-SantaiSoul)

</div>

---

## Overview

SantaiSoul is a luxury wellness startup that merges **handcrafted botanical aromatherapy** with **immersive digital healing technology**. Each physical candle contains an embedded NFC microchip that — when tapped by a smartphone — instantly unlocks a personalized sensory sanctuary in the browser.

This prototype demonstrates the complete digital product experience:

- Full e-commerce flow with sliding cart and simulated Stripe checkout
- Memberstack-style gated premium membership with cinematic access verification
- NFC tap simulation portal with automatic session authentication
- Browser-native 432Hz / 528Hz / 396Hz healing frequency synthesizer — no audio files, no streaming costs
- Editorial Journal and social aesthetic feed
- Full mobile responsiveness

---

## Live Pages

| Page | Description |
|---|---|
| `/index.html` | Brand homepage — hero, product grid, journal, social feed, membership CTA |
| `/product.html` | Candle product detail — specs tabs, quantity selector, add to cart, NFC explainer |
| `/membership.html` | Gated Digital Sanctuary — cinematic auth gate, 432Hz synth player, Pranayama breathing ring |
| `/nfc-tap.html` | NFC hover simulator — tap animation, automatic session pairing, redirect to sanctuary |

---

## Key Features

### 🎵 Browser Audio Synthesis Engine
Zero MP3 files. Zero streaming. The entire healing soundscape is **synthesized in real-time** inside the client's browser using the Web Audio API.

Three frequency presets available:
- **432Hz Earth Grounding** — Sine/triangle drone with LFO swell modulation
- **528Hz Celestial Calm** — Perfect fourth harmonic stack, binaural offset
- **396Hz Aura Cleansing** — Minor chord base for deep emotional release

Each preset also includes randomized pentatonic wind chimes generated via scheduled oscillator callbacks.

### 🔒 Cinematic Membership Gate
The sanctuary page runs a 2.5-second verification sequence on every load — regardless of auth state:

```
Authenticating credentials...  →  Verifying candle ownership...
→  Decrypting sanctuary key...  →  Access granted ✦  (or: Credentials required.)
```

Authenticated users unlock the dashboard. New visitors see the gated lock screen.

### 📡 NFC Tap Simulation
`/nfc-tap.html` simulates the physical candle interaction:
1. User "hovers" phone → animated wave rings + wind chime audio fires
2. Session token written to `localStorage`
3. Auto-redirect to unlocked sanctuary dashboard

### 🛒 E-Commerce Cart & Stripe Checkout
- Slide-out cart drawer with persistent `localStorage` state
- Item quantity management, subtotal calculation
- Full simulated Stripe payment modal (pre-filled test card `4242 4242 4242 4242`)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Structure | Semantic HTML5 |
| Styling | Vanilla CSS — custom HSL design system, no frameworks |
| Interactions | Vanilla JavaScript (ES6+) — no dependencies |
| Audio Engine | Web Audio API — oscillators, gain nodes, LFO modulation, delay |
| Auth Simulation | `localStorage` state management |
| Fonts | Cormorant Garamond (serif) + Plus Jakarta Sans (sans) via Google Fonts |
| Icons | Font Awesome 6 |
| Deploy | Vercel |

---

## Production Architecture (Webflow Build)

This prototype maps directly to the planned production stack:

```
Webflow CMS          →  Visual design, Blog/Journal CMS, Product pages
Memberstack          →  Real authentication, premium gating, user profiles
Stripe               →  Live payment processing, subscription billing
Custom Code Embeds   →  Web Audio Synthesis Engine, NFC redirect scripts
NFC Hardware         →  NTAG213/NTAG215 chips embedded in walnut candle lids
```

The custom audio engine and NFC logic will be embedded into Webflow via Custom HTML Embed blocks — giving the client full Webflow visual editing while retaining bespoke technical capabilities.

---

## Local Development

No build tools required. Open directly in browser:

```bash
# Option A: Open directly
open index.html

# Option B: Local dev server with live reload
npx -y browser-sync start --server --files "*.html, assets/**/*"
```

---

## Project Structure

```
├── index.html              # Homepage
├── product.html            # Product detail page
├── membership.html         # Gated sanctuary dashboard
├── nfc-tap.html            # NFC tap simulator
└── assets/
    ├── css/
    │   └── style.css       # Complete design system (variables, animations, layout)
    ├── js/
    │   ├── main.js         # Cart, auth modals, Stripe simulation
    │   └── audio.js        # Web Audio synthesis engine
    └── images/
        └── hero.png        # Hero visual asset
```

---

<div align="center">

*Built with precision for SantaiSoul — Luxury Wellness, Digitally Delivered.*

</div>
