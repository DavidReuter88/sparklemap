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

- `App.tsx`: single-screen UI (connect/send/receive demo)
- `services/esp32Service.ts`: WebSocket client to talk to an ESP32 over local Wi‑Fi

## ESP32 WebSocket configuration

To test locally, your **ESP32** must be running a **WebSocket server** on your LAN.

- **Same Wi‑Fi**: Your phone (Expo Go) and the ESP32 must be on the same Wi‑Fi network.
- **IP address**: Find the ESP32’s local IP (for example, from the serial monitor or your router DHCP list).
- **Port**: Whatever port your ESP32 WebSocket server listens on (common examples: `80`, `81`, `8080`).
- **URL format**: `ws://<ESP32_IP>:<PORT>/`

In the app UI you can edit **ESP32 IP** and **Port**, tap **Connect**, then send example commands like `PING` and `CLEAR`.

### Notes for ESP32 firmware

- The ESP32 must accept incoming WebSocket connections from your phone on the chosen port.
- Make sure your router/firewall doesn’t block local device-to-device traffic (some guest networks do).

## LED matrix commands (future-ready)

The app currently sends plain-text commands over WebSocket.

See `services/esp32Service.ts` for TODOs describing where to add a real command protocol for a **64‑LED (8x8) matrix**, for example:

- `SET x y r g b` (set one pixel)
- `FRAME <base64>` (send an entire 8x8 frame)
- `CLEAR` (clear the matrix)

No real ESP32 communication is implemented yet.

See `services/esp32Service.ts` for TODOs describing where local network communication will be added to:

- discover/connect to the ESP32 over Wi‑Fi
- send frame/LED updates for a 64‑LED (8x8) matrix

