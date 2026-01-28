/**
 * esp32Service.ts
 *
 * Placeholder for future local-network communication with an ESP32.
 *
 * TODO(ESP32):
 * - The ESP32 will control a 64-LED matrix (8x8).
 * - Communication will happen over the local network (Wi‑Fi).
 * - Likely transport options: HTTP (REST), WebSocket, or raw UDP/TCP.
 *
 * When you implement this:
 * - Put discovery / IP selection logic here (e.g. mDNS, manual IP entry, QR code).
 * - Put connection lifecycle (connect/disconnect/retry) here.
 * - Put message formats here (e.g. send full 8x8 frame, or per‑LED updates).
 */

export async function connectToEsp32Placeholder(): Promise<void> {
  // TODO: Replace this with real ESP32 connection logic (local Wi‑Fi).
  // Example future flow:
  // 1) Discover ESP32 on LAN or use saved IP
  // 2) Establish HTTP/WebSocket connection
  // 3) Send a handshake/capabilities request (matrix size = 64 LEDs)
  // 4) Begin sending frame updates
  console.log("TODO: connect to ESP32 over local network (Wi‑Fi).");
}

