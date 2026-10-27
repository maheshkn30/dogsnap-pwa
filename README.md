Writing

# 🐶 DogSnap PWA

A simple, lightweight Progressive Web App that fetches a random dog photo every time you tap a button.\
Built with pure HTML, CSS, and vanilla JavaScript — no frameworks, no build tools.

**Live Demo →****maheshkn30.github.io/dogsnap-pwa**

---

## 🤔 What is a PWA?

A **Progressive Web App (PWA)** is a website that looks, feels, and acts like a mobile app installed from an app store.

It is essentially a regular website built with web technologies (HTML, CSS, JavaScript), but enhanced with special code that lets users install it to their phone or desktop home screen, receive push notifications, and use it completely offline.

### ✨ Why People Use Them

- 📲 **No App Stores:** Users can download the app straight from their browser without dealing with Google Play or the Apple App Store.
- ⚡ **Extremely Lightweight:** They take up a fraction of the storage space required by traditional mobile apps.
- 🔄 **Instant Updates:** Every time the user opens the app while connected to the internet, it updates automatically.

Think of it this way:

| 🌐 Regular Website | 📱 Native App | 🚀 PWA |
| --- | --- | --- |
| Opens in browser | Downloaded from app store | Opens in browser OR installs like an app |
| No offline support | Works offline | Works offline ✓ |
| Can't be installed | Installed on device | Can be installed on device ✓ |

---

## ⚙️ How Does a PWA Work?

A PWA is powered by three core pieces:

### 1\. 📄 The Web App (HTML + CSS + JS)

This is the regular webpage you see — the UI, buttons, styles, and logic. Nothing special here.

### 2\. 📋 The Web Manifest (`manifest.json`)

A small JSON file that tells the browser:

- What to name the app when installed
- What icon to use on the home screen
- What color the title bar should be
- Whether to open in a browser tab or a standalone window

json

```
{
  "name": "DogSnap",
  "theme_color": "#007bff",
  "display": "standalone"
}
```

### 3\. 🔧 The Service Worker (`sw.js`)

This is the magic piece. A Service Worker is a script that runs **in the background**, separate from the webpage. It acts like a middleman between your app and the internet.

text

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

DogSnap fetches a random dog photo from the [**Dog CEO API**](<https://dog.ceo/dog-api/>) — a free, public API with thousands of dog images across 120+ breeds.

### ✨ What It Does

- 🐕 Fetches a random dog photo on load
- 🏷️ Detects and displays the dog's breed from the image URL
- 📡 Shows an offline notice when there's no internet connection
- 🚫 Disables the fetch button when offline so you don't get confusing errors
- 💾 Caches the app shell so it loads instantly on repeat visits

---

## 💾 How the Caching Strategy Works

DogSnap uses two different strategies depending on what's being requested:

### ⚡ Cache First — App Files

For app files (`index.html`, `manifest.json`).

text

```
Request → Check cache first → Found? Serve it instantly.
                             → Not found? Fetch from network, then save to cache.
```

### 🌐 Network First — Dog Photos

For dog photos from the API.

text

```
Request → Try network first → Success? Serve it + save to cache.
                            → Failed (offline)? Serve last cached photo.
```

This means:

- ⚡ The app **always loads fast** (shell from cache)
- 🐕 Dog photos are **always fresh** when online
- 📡 You still **see something** when offline (last cached photo)

---

## 📁 Project Structure

text

```
dogsnap-pwa/
│
├── 📄 index.html      # The entire UI — layout, styles, and JavaScript
├── 📋 manifest.json   # PWA configuration (name, icon, colors, display mode)
└── 🔧 sw.js           # Service Worker — caching and offline logic
```

That's it. **Three files. No dependencies.**

---

## ✅ Lighthouse PWA Checklist

This app is built to pass Chrome's Lighthouse PWA audit:

- [x]Web App Manifest with name, icons, and theme color
- [x]Service Worker registered and active
- [x]Works offline (app shell cached)
- [x]Served over HTTPS (via GitHub Pages)
- [x]`start_url` responds while offline
- [x]Viewport meta tag set
- [x]`theme-color` meta tag set
- [x]Installable (add to home screen prompt)

🔍 **To run the audit:** Chrome DevTools → Lighthouse tab → Progressive Web App → Analyze

---

## 🛠️ Built With

- 🌐 HTML5
- 🎨 CSS3 (custom properties, flexbox, transitions)
- ⚡ Vanilla JavaScript (Fetch API, Service Worker API)
- 🐶 Dog CEO Public API

---

🐾 _Made as a minimal PWA reference project. Feel free to use it as a starting point for your own PWA._
