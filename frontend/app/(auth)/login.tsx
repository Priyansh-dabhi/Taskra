import React from "react";
import { Alert } from "react-native";
import { Redirect, router } from "expo-router";
import LoginScreen from "./LoginScreen";
import { useAuth } from "../../src/context/AuthContext";

export default function LoginRoute() {
  const { token, isAuthenticating, loginUser } = useAuth();

  if (token) {
    return <Redirect href="/tasks" />;
  }

  return (
    <LoginScreen
      isSubmitting={isAuthenticating}
      onLogin={async (email, password) => {
        try {
          await loginUser(email, password);
          router.replace("/tasks");
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Unable to login";
          Alert.alert("Login failed", message);
        }
      }}
      onGoToSignup={() => router.push("/signup")}
    />
  );
}
