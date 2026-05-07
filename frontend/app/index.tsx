import React from "react";
import { Redirect } from "expo-router";
import { ActivityIndicator, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../src/context/AuthContext";

export default function Index() {
  const { token, isBootstrapping } = useAuth();

  if (isBootstrapping) {
    return (
      <SafeAreaView style={styles.screen}>
        <ActivityIndicator size="large" color="#1f7a8c" />
        <Text style={styles.text}>Loading Taskra...</Text>
      </SafeAreaView>
    );
  }

  if (token) {
    return <Redirect href="/tasks" />;
  }

  return <Redirect href="/login" />;
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f7f5",
  },
  text: {
    marginTop: 12,
    fontSize: 16,
    color: "#34515e",
  },
});
