/**
 * esp32Service.ts
 *
 * Expo / React Native includes a built-in WebSocket implementation, so we don't
 * need extra libraries.
 *
 * Wi‑Fi / local network requirement:
 * - Your phone/emulator and the ESP32 must be on the **same Wi‑Fi network**.
 * - The ESP32 must be running a WebSocket server and listening on the chosen port.
 * - Typical URLs look like: ws://192.168.1.50:81/
 *
 * TODO(ESP32 / LED matrix):
 * - Define a command protocol for a 64‑LED (8x8) matrix. For example:
 *   - "PING"
 *   - "CLEAR"
 *   - "SET x y r g b"
 *   - "FRAME <base64>" (send whole 8x8 frame)
 * - Add helpers here to generate and validate those commands.
 */

export type Esp32ConnectionStatus =
  | "idle"
  | "connecting"
  | "connected"
  | "reconnecting"
  | "disconnected"
  | "error";

export type Esp32MessageCallback = (message: string) => void;
export type Esp32StatusCallback = (status: Esp32ConnectionStatus) => void;

export type Esp32EndpointConfig = Readonly<{
  ip: string; // e.g. "192.168.1.50"
  port: number; // e.g. 81
  path?: string; // default "/"
  secure?: boolean; // wss:// if true
}>;

type Unsubscribe = () => void;

let socket: WebSocket | null = null;
let endpoint: Esp32EndpointConfig = { ip: "192.168.1.50", port: 81, path: "/" };
let status: Esp32ConnectionStatus = "idle";

const messageListeners = new Set<Esp32MessageCallback>();
const statusListeners = new Set<Esp32StatusCallback>();

let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
let reconnectAttempts = 0;
let manuallyDisconnected = false;

const RECONNECT_MAX_ATTEMPTS = 10;
const RECONNECT_BASE_DELAY_MS = 500;
const RECONNECT_MAX_DELAY_MS = 10_000;

function setStatus(next: Esp32ConnectionStatus): void {
  status = next;
  for (const cb of statusListeners) cb(next);
}

function clearReconnectTimer(): void {
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }
}

function getUrl(cfg: Esp32EndpointConfig): string {
  const protocol = cfg.secure ? "wss" : "ws";
  const path = cfg.path && cfg.path.trim().length > 0 ? cfg.path : "/";
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${protocol}://${cfg.ip}:${cfg.port}${normalizedPath}`;
}

function safeClose(): void {
  if (!socket) return;
  try {
    socket.onopen = null;
    socket.onmessage = null;
    socket.onerror = null;
    socket.onclose = null;
    socket.close();
  } catch {
    // ignore
  } finally {
    socket = null;
  }
}

function scheduleReconnect(): void {
  if (manuallyDisconnected) return;
  if (reconnectAttempts >= RECONNECT_MAX_ATTEMPTS) {
    setStatus("error");
    return;
  }

  clearReconnectTimer();
  reconnectAttempts += 1;

  const delay = Math.min(
    RECONNECT_MAX_DELAY_MS,
    RECONNECT_BASE_DELAY_MS * Math.pow(2, reconnectAttempts - 1)
  );

  setStatus("reconnecting");
  reconnectTimer = setTimeout(() => {
    void connect();
  }, delay);
}

/**
 * Configure the ESP32 endpoint (IP/port/path).
 * You can call this before `connect()` or while disconnected.
 */
export function setEndpointConfig(next: Esp32EndpointConfig): void {
  endpoint = { ...next };
}

export function getEndpointConfig(): Esp32EndpointConfig {
  return endpoint;
}

export function getConnectionStatus(): Esp32ConnectionStatus {
  return status;
}

/**
 * Connect to the ESP32 WebSocket server.
 * If already connected/connecting, it will no-op.
 */
export async function connect(
  override?: Partial<Esp32EndpointConfig>
): Promise<void> {
  if (
    status === "connecting" ||
    status === "connected" ||
    status === "reconnecting"
  ) {
    return;
  }

  manuallyDisconnected = false;
  clearReconnectTimer();

  const cfg: Esp32EndpointConfig = { ...endpoint, ...override };
  endpoint = cfg;
  const url = getUrl(cfg);

  setStatus("connecting");

  // Ensure old socket (if any) is gone.
  safeClose();

  try {
    socket = new WebSocket(url);
  } catch (e) {
    setStatus("error");
    scheduleReconnect();
    return;
  }

  socket.onopen = () => {
    reconnectAttempts = 0;
    setStatus("connected");
  };

  socket.onmessage = (event: WebSocketMessageEvent) => {
    // In RN, `event.data` is usually string.
    const data =
      typeof event.data === "string" ? event.data : JSON.stringify(event.data);
    for (const cb of messageListeners) cb(data);
  };

  socket.onerror = () => {
    // Most RN WebSocket errors do not include useful details; onclose usually follows.
    setStatus("error");
  };

  socket.onclose = () => {
    safeClose();
    setStatus(manuallyDisconnected ? "disconnected" : "disconnected");
    if (!manuallyDisconnected) scheduleReconnect();
  };
}

/**
 * Disconnect and stop auto-reconnect.
 */
export async function disconnect(): Promise<void> {
  manuallyDisconnected = true;
  clearReconnectTimer();
  safeClose();
  setStatus("disconnected");
}

/**
 * Send a command string to the ESP32.
 *
 * TODO(LED matrix):
 * - Add strongly-typed command builders (e.g. setPixel(x,y,color), sendFrame(frame)).
 * - Add validation (bounds 0..7, color 0..255, etc.) before sending.
 */
export async function sendCommand(command: string): Promise<void> {
  const trimmed = command.trim();
  if (trimmed.length === 0) return;

  if (!socket || status !== "connected") {
    throw new Error("WebSocket is not connected. Call connect() first.");
  }

  try {
    socket.send(trimmed);
  } catch (e) {
    // If send fails, assume socket is unhealthy and reconnect.
    setStatus("error");
    scheduleReconnect();
    throw e;
  }
}

/**
 * Subscribe to incoming messages from ESP32.
 * Returns an unsubscribe function.
 */
export function onMessage(callback: Esp32MessageCallback): Unsubscribe {
  messageListeners.add(callback);
  return () => {
    messageListeners.delete(callback);
  };
}

/**
 * Optional: subscribe to connection status changes.
 * Returns an unsubscribe function.
 */
export function onStatus(callback: Esp32StatusCallback): Unsubscribe {
  statusListeners.add(callback);
  // Emit current status immediately so UI can render it.
  callback(status);
  return () => {
    statusListeners.delete(callback);
  };
}

