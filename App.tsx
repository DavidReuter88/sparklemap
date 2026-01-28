import React from "react";
import { Pressable, Text, View } from "react-native";

import { connectToEsp32Placeholder } from "./services/esp32Service";

export default function App() {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 24
      }}
    >
      <Text style={{ fontSize: 22, fontWeight: "600", marginBottom: 16 }}>
        LED Matrix Controller
      </Text>

      <Pressable
        onPress={connectToEsp32Placeholder}
        style={({ pressed }) => ({
          paddingVertical: 12,
          paddingHorizontal: 16,
          borderRadius: 10,
          borderWidth: 1,
          borderColor: "#111827",
          backgroundColor: pressed ? "#E5E7EB" : "#FFFFFF"
        })}
      >
        <Text style={{ fontSize: 16, fontWeight: "500" }}>
          Connect to ESP32
        </Text>
      </Pressable>
    </View>
  );
}

