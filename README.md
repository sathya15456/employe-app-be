# Employee Backend Setup Guide

This guide explains how to install Node.js, initialize a backend project, install dependencies, and run the server.

---

## 1. Install Node.js

Download and install Node.js (LTS version) from: https://nodejs.org

### Verify Installation

```bash id="j5k2sd"
node -v
npm -v
```

---

## 2. Initialize Project

Navigate to your backend folder and run:

```bash id="n4k8pl"
npm init -y
```

This creates a `package.json` file.

---

## 3. Install Nodemon

Nodemon automatically restarts your server when changes are detected.

```bash id="p8x2qa"
npm install -g nodemon
```

(Optional: install locally)

```bash id="v1m9zk"
npm install --save-dev nodemon
```

---

## 4. Add Start Script

Open `package.json` and update the `scripts` section:

```json id="c7w3rm"
"scripts": {
  "devv": "nodemon index.js"
}
```

> Replace `index.js` with your main file name if different (e.g., `app.js`, `server.js`).

---

## 5. Run Backend Server

```bash id="h2q9ls"
npm run dev
```

---

## Notes

* Ensure your entry file (e.g., `index.js`) exists
* If nodemon is not recognized, install it globally or use:

```bash id="z8t1bn"
npx nodemon index.js
```

---

## Summary

* Install Node.js
* Initialize project using `npm init -y`
* Install nodemon
* Add script in `package.json`
* Run using `npm run dev`
