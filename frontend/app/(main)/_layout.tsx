import React from "react";
import { Pressable, Text } from "react-native";
import { Redirect, Stack } from "expo-router";
import { useAuth } from "../../src/context/AuthContext";

export default function MainLayout() {
  const { token, isBootstrapping, logoutUser } = useAuth();

  if (isBootstrapping) {
    return null;
  }

  if (!token) {
    return <Redirect href="/login" />;
  }

  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: "#f4f7f5" },
        headerTitleStyle: {
          fontSize: 22,
          fontWeight: "700",
          color: "#102a43",
        },
      }}
    >
      <Stack.Screen
        name="tasks"
        options={{
          title: "Taskra",
          headerRight: () => (
            <Pressable onPress={() => void logoutUser()}>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "600",
                  color: "#b23a48",
                }}
              >
                Logout
              </Text>
            </Pressable>
          ),
        }}
      />
    </Stack>
  );
}
