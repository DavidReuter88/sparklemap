# LED Matrix Controller (Expo + React Native + TypeScript)

Minimal starter app intended to later control a **64‑LED (8x8) matrix** driven by an **ESP32** over a **local network**.

## Prerequisites

- **Node.js LTS** installed (includes `node`, `npm`, `npx`)
- Optional (recommended): **Expo Go** app on your phone for quick testing
- For iOS simulator: macOS + Xcode
- For Android emulator: Android Studio

## Install dependencies

From this folder:

```bash
npm install
```

## Run the app with the latest Expo Go

Make sure you have the **latest Expo Go** app installed from the iOS App Store or Google Play.

### Start the dev server

```bash
npm start
```

This will start the Expo development server and show a QR code in the terminal / browser.

### Android

- **Physical device**: Open Expo Go and scan the QR code.
- **Android emulator**: With the emulator running, press `a` in the Expo CLI terminal, or run:

```bash
npm run android
```

### iOS

- **Physical device**: Use the Camera app (or Expo Go) to scan the QR code and open in Expo Go.
- **iOS simulator (macOS only)**: With the simulator running, press `i` in the Expo CLI terminal, or run:

```bash
npm run ios
```

## Project structure

- `App.tsx`: single-screen UI (title + placeholder button)
- `services/esp32Service.ts`: placeholder for future ESP32 networking (Wi‑Fi / HTTP / WebSocket)

## ESP32 networking (future)

No real ESP32 communication is implemented yet.

See `services/esp32Service.ts` for TODOs describing where local network communication will be added to:

- discover/connect to the ESP32 over Wi‑Fi
- send frame/LED updates for a 64‑LED (8x8) matrix

