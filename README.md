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

## Run the app

Start the Expo dev server:

```bash
npm run start
```

### Android

```bash
npm run android
```

### iOS

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

