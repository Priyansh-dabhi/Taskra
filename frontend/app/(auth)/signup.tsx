import React from "react";
import { Alert } from "react-native";
import { Redirect, router } from "expo-router";
import SignupScreen from "./SignupScreen";
import { useAuth } from "../../src/context/AuthContext";

export default function SignupRoute() {
  const { token, isAuthenticating, signupUser } = useAuth();

  if (token) {
    return <Redirect href="/tasks" />;
  }

  return (
    <SignupScreen
      isSubmitting={isAuthenticating}
      onSignup={async (name, email, password) => {
        try {
          await signupUser(name, email, password);
          router.replace("/tasks");
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Unable to create account";
          Alert.alert("Signup failed", message);
        }
      }}
      onGoToLogin={() => router.back()}
    />
  );
}
