import React from "react";
import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: "#f4f7f5" },
        headerTitleAlign: "center",
        headerBackTitleVisible: false,
        headerLeftContainerStyle: {
          paddingLeft: 8,
        },
        headerRightContainerStyle: {
          paddingRight: 8,
        },
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
