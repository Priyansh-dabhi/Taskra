import React from "react";
import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: "#f4f7f5" },
        headerTitleAlign: "center",
        headerTitleStyle: {
          fontSize: 22,
          fontWeight: "700",
          color: "#102a43",
        },
      }}
    >
      <Stack.Screen name="login" options={{ title: "Welcome back" }} />
      <Stack.Screen name="signup" options={{ title: "Create account" }} />
    </Stack>
  );
}
