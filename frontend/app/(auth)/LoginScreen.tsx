import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

interface LoginScreenProps {
  isSubmitting: boolean;
  onLogin: (email: string, password: string) => Promise<void>;
  onGoToSignup: () => void;
}

export default function LoginScreen({
  isSubmitting,
  onLogin,
  onGoToSignup,
}: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.card}>
        <Text style={styles.eyebrow}>Taskra</Text>
        <Text style={styles.title}>Sign in to your workspace</Text>

        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
          editable={!isSubmitting}
        />
        <View style={styles.passwordField}>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            secureTextEntry={!isPasswordVisible}
            style={styles.passwordInput}
            editable={!isSubmitting}
          />
          <Pressable
            onPress={() => setIsPasswordVisible((current) => !current)}
            style={styles.passwordToggle}
            hitSlop={10}
          >
            <Ionicons
              name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
              size={22}
              color="#486581"
            />
          </Pressable>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.primaryButton,
            pressed && styles.buttonPressed,
            isSubmitting && styles.buttonDisabled,
          ]}
          onPress={() => void onLogin(email, password)}
          disabled={isSubmitting}
        >
          <Text style={styles.primaryButtonText}>
            {isSubmitting ? "Signing in..." : "Login"}
          </Text>
        </Pressable>

        <Pressable onPress={onGoToSignup} style={styles.linkWrap}>
          <Text style={styles.linkText}>Need an account? Sign up</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f4f7f5",
  },
  card: {
    borderRadius: 24,
    padding: 24,
    backgroundColor: "#ffffff",
  },
  eyebrow: {
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
    color: "#d9822b",
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#102a43",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d9e2ec",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#102a43",
    backgroundColor: "#fffaf2",
    marginBottom: 12,
  },
  passwordField: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#d9e2ec",
    borderRadius: 16,
    backgroundColor: "#fffaf2",
    marginBottom: 12,
    paddingRight: 16,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#102a43",
  },
  passwordToggle: {
    justifyContent: "center",
    alignItems: "center",
  },
  primaryButton: {
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: "#d9822b",
    marginTop: 4,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  buttonPressed: {
    opacity: 0.9,
  },
  buttonDisabled: {
    backgroundColor: "#d8a46d",
  },
  linkWrap: {
    marginTop: 16,
    alignItems: "center",
  },
  linkText: {
    color: "#d9822b",
    fontWeight: "600",
  },
});
