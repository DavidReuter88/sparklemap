import React, { useEffect, useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View
} from "react-native";

import {
  connect,
  disconnect,
  getConnectionStatus,
  onMessage,
  onStatus,
  sendCommand,
  setEndpointConfig
} from "./services/esp32Service";

export default function App() {
  const [ip, setIp] = useState("192.168.1.50");
  const [port, setPort] = useState("81");
  const [command, setCommand] = useState("PING");
  const [status, setStatus] = useState(getConnectionStatus());
  const [messages, setMessages] = useState<string[]>([]);

  const portNumber = useMemo(() => {
    const n = Number(port);
    return Number.isFinite(n) ? n : NaN;
  }, [port]);

  useEffect(() => {
    const unsubMsg = onMessage((msg) => {
      setMessages((prev) => [msg, ...prev].slice(0, 50));
    });
    const unsubStatus = onStatus(setStatus);
    return () => {
      unsubMsg();
      unsubStatus();
    };
  }, []);

  const canConnect = ip.trim().length > 0 && Number.isFinite(portNumber);

  async function handleConnect(): Promise<void> {
    if (!canConnect) return;
    setEndpointConfig({ ip: ip.trim(), port: portNumber, path: "/" });
    await connect();
  }

  async function handleDisconnect(): Promise<void> {
    await disconnect();
  }

  async function handleSend(cmd: string): Promise<void> {
    try {
      await sendCommand(cmd);
      setMessages((prev) => [`→ ${cmd}`, ...prev].slice(0, 50));
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "Failed to send command";
      setMessages((prev) => [`⚠️ ${message}`, ...prev].slice(0, 50));
    }
  }

  return (
    <View
      style={{
        flex: 1,
        padding: 24,
        paddingTop: 56
      }}
    >
      <Text style={{ fontSize: 22, fontWeight: "600", marginBottom: 8 }}>
        LED Matrix Controller
      </Text>

      <Text style={{ color: "#374151", marginBottom: 16 }}>
        Phone and ESP32 must be on the same Wi‑Fi. Status:{" "}
        <Text style={{ fontWeight: "700" }}>{status}</Text>
      </Text>

      <View style={{ width: "100%", gap: 10, marginBottom: 12 }}>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ color: "#6B7280", marginBottom: 6 }}>ESP32 IP</Text>
            <TextInput
              value={ip}
              onChangeText={setIp}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="192.168.1.50"
              inputMode="text"
              style={{
                borderWidth: 1,
                borderColor: "#D1D5DB",
                borderRadius: 10,
                paddingHorizontal: 12,
                paddingVertical: 10
              }}
            />
          </View>

          <View style={{ width: 110 }}>
            <Text style={{ color: "#6B7280", marginBottom: 6 }}>Port</Text>
            <TextInput
              value={port}
              onChangeText={setPort}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="number-pad"
              placeholder="81"
              style={{
                borderWidth: 1,
                borderColor: "#D1D5DB",
                borderRadius: 10,
                paddingHorizontal: 12,
                paddingVertical: 10
              }}
            />
          </View>
        </View>

        <View style={{ flexDirection: "row", gap: 10 }}>
          <Pressable
            disabled={!canConnect}
            onPress={handleConnect}
            style={({ pressed }) => ({
              flex: 1,
              paddingVertical: 12,
              paddingHorizontal: 16,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: "#111827",
              backgroundColor: !canConnect
                ? "#F3F4F6"
                : pressed
                  ? "#E5E7EB"
                  : "#FFFFFF"
            })}
          >
            <Text style={{ fontSize: 16, fontWeight: "600", textAlign: "center" }}>
              Connect
            </Text>
          </Pressable>

          <Pressable
            onPress={handleDisconnect}
            style={({ pressed }) => ({
              flex: 1,
              paddingVertical: 12,
              paddingHorizontal: 16,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: "#111827",
              backgroundColor: pressed ? "#E5E7EB" : "#FFFFFF"
            })}
          >
            <Text style={{ fontSize: 16, fontWeight: "600", textAlign: "center" }}>
              Disconnect
            </Text>
          </Pressable>
        </View>
      </View>

      <View style={{ width: "100%", gap: 10, marginBottom: 12 }}>
        <Text style={{ color: "#6B7280" }}>Command</Text>
        <TextInput
          value={command}
          onChangeText={setCommand}
          autoCapitalize="characters"
          autoCorrect={false}
          placeholder="PING"
          style={{
            borderWidth: 1,
            borderColor: "#D1D5DB",
            borderRadius: 10,
            paddingHorizontal: 12,
            paddingVertical: 10
          }}
        />

        <View style={{ flexDirection: "row", gap: 10 }}>
          <Pressable
            onPress={() => handleSend(command)}
            style={({ pressed }) => ({
              flex: 1,
              paddingVertical: 12,
              paddingHorizontal: 16,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: "#111827",
              backgroundColor: pressed ? "#E5E7EB" : "#FFFFFF"
            })}
          >
            <Text style={{ fontSize: 16, fontWeight: "600", textAlign: "center" }}>
              Send
            </Text>
          </Pressable>

          <Pressable
            onPress={() => handleSend("PING")}
            style={({ pressed }) => ({
              paddingVertical: 12,
              paddingHorizontal: 16,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: "#111827",
              backgroundColor: pressed ? "#E5E7EB" : "#FFFFFF"
            })}
          >
            <Text style={{ fontSize: 16, fontWeight: "600" }}>PING</Text>
          </Pressable>

          <Pressable
            onPress={() => handleSend("CLEAR")}
            style={({ pressed }) => ({
              paddingVertical: 12,
              paddingHorizontal: 16,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: "#111827",
              backgroundColor: pressed ? "#E5E7EB" : "#FFFFFF"
            })}
          >
            <Text style={{ fontSize: 16, fontWeight: "600" }}>CLEAR</Text>
          </Pressable>
        </View>
      </View>

      <Text style={{ fontWeight: "700", marginBottom: 8 }}>Incoming / log</Text>
      <View
        style={{
          flex: 1,
          width: "100%",
          borderWidth: 1,
          borderColor: "#E5E7EB",
          borderRadius: 12,
          overflow: "hidden"
        }}
      >
        <ScrollView
          contentContainerStyle={{ padding: 12, gap: 8 }}
          keyboardShouldPersistTaps="handled"
        >
          {messages.length === 0 ? (
            <Text style={{ color: "#6B7280" }}>
              No messages yet. Connect and send a command (for example: PING).
            </Text>
          ) : (
            messages.map((m, idx) => (
              <Text key={`${idx}-${m}`} style={{ color: "#111827" }}>
                {m}
              </Text>
            ))
          )}
        </ScrollView>
      </View>
    </View>
  );
}

