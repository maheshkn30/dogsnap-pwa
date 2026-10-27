# 🐶 DogSnap PWA

A simple, lightweight Progressive Web App that fetches a random dog photo every time you tap a button.  
Built with pure HTML, CSS, and vanilla JavaScript — no frameworks, no build tools.

**Live Demo → [maheshkn30.github.io/dogsnap-pwa](https://maheshkn30.github.io/dogsnap-pwa/)**

---

## 🤔 What is a PWA?

A **Progressive Web App (PWA)** is a regular website that behaves like a native mobile or desktop app.

Think of it this way:

| Regular Website       | Native App                | PWA                                      |
| --------------------- | ------------------------- | ---------------------------------------- |
| Opens in browser      | Downloaded from app store | Opens in browser OR installs like an app |
| No offline support    | Works offline             | Works offline ✓                          |
| Can't be installed    | Installed on device       | Can be installed on device ✓             |
| Always needs internet | Works without internet    | Works without internet ✓                 |

In short — **a PWA is a website that you can install and use like an app, even without internet.**

---

## ⚙️ How Does a PWA Work?

A PWA is powered by three core pieces:

### 1. 📄 The Web App (HTML + CSS + JS)

This is the regular webpage you see — the UI, buttons, styles, and logic. Nothing special here.

### 2. 📋 The Web Manifest (`manifest.json`)

A small JSON file that tells the browser:

- What to name the app when installed
- What icon to use on the home screen
- What color the title bar should be
- Whether to open in a browser tab or a standalone window

```json
{
  "name": "DogSnap",
  "theme_color": "#007bff",
  "display": "standalone"
}
```

### 3. 🔧 The Service Worker (`sw.js`)

This is the magic piece. A Service Worker is a script that runs **in the background**, separate from the webpage. It acts like a middleman between your app and the internet.

```
Your App  ──→  Service Worker  ──→  Internet
                     ↓
                  Cache
                (saved files)
```

When you visit the app for the first time, the Service Worker **saves (caches) the core files** like `index.html` and `manifest.json`.

The next time you open the app — even without internet — the Service Worker **serves those saved files** instantly from the cache.

---

## 🐾 About DogSnap

DogSnap fetches a random dog photo from the **[Dog CEO API](https://dog.ceo/dog-api/)** — a free, public API with thousands of dog images across 120+ breeds.

### What it does

- Fetches a random dog photo on load
- Detects and displays the dog's breed from the image URL
- Shows an offline notice when there's no internet connection
- Disables the fetch button when offline so you don't get confusing errors
- Caches the app shell so it loads instantly on repeat visits

### How the caching strategy works

DogSnap uses two different strategies depending on what's being requested:

**Cache First** — for app files (`index.html`, `manifest.json`)

```
Request → Check cache first → Found? Serve it instantly.
                             → Not found? Fetch from network, then save to cache.
```

**Network First** — for dog photos from the API

```
Request → Try network first → Success? Serve it + save to cache.
                            → Failed (offline)? Serve last cached photo.
```

This means:

- The app **always loads fast** (shell from cache)
- Dog photos are **always fresh** when online
- You still **see something** when offline (last cached photo)

---

## 📁 Project Structure

```
dogsnap-pwa/
│
├── index.html      # The entire UI — layout, styles, and JavaScript
├── manifest.json   # PWA configuration (name, icon, colors, display mode)
└── sw.js           # Service Worker — caching and offline logic
```

That's it. Three files. No dependencies.

---

## 🚀 Run It Locally

PWAs require a local server (not `file://`). Use one of these:

**Node.js**

```bash
npx serve .
```

**Python**

```bash
python -m http.server 8080
```

Then open `http://localhost:8080` in Chrome.

---

## ✅ Lighthouse PWA Checklist

This app is built to pass Chrome's Lighthouse PWA audit:

- [x] Web App Manifest with name, icons, and theme color
- [x] Service Worker registered and active
- [x] Works offline (app shell cached)
- [x] Served over HTTPS (via GitHub Pages)
- [x] `start_url` responds while offline
- [x] Viewport meta tag set
- [x] `theme-color` meta tag set
- [x] Installable (add to home screen prompt)

To run the audit: **Chrome DevTools → Lighthouse tab → Progressive Web App → Analyze**

---

## 🌐 Deploy Your Own

1. Fork this repo
2. Go to **Settings → Pages**
3. Set source to `main` branch, `/ (root)` folder
4. Visit `https://your-username.github.io/dogsnap-pwa/`

---

## 📡 API Used

**[Dog CEO API](https://dog.ceo/dog-api/)**

- Free, no authentication required
- Endpoint used: `GET https://dog.ceo/api/breeds/image/random`
- Returns a random dog image URL and status

---

## 🛠️ Built With

- HTML5
- CSS3 (custom properties, flexbox, transitions)
- Vanilla JavaScript (Fetch API, Service Worker API)
- Dog CEO Public API

---

_Made as a minimal PWA reference project. Feel free to use it as a starting point for your own PWA._
