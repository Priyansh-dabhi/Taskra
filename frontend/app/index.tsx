import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { TOKEN_KEY } from "../src/api/client";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const APP_NAME = "Taskra";
const PROGRESS_WIDTH = 220;

export default function SplashIndex() {
  // ─── Shared values ────────────────────────────────────────────────────────
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.3);
  const taglineOpacity = useSharedValue(0);
  const progressWidth = useSharedValue(0);
  const screenOpacity = useSharedValue(1);

  // ─── Typewriter state ──────────────────────────────────────────────────────
  const [displayedName, setDisplayedName] = useState("");
  const typewriterRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ─── Navigation helper (called from UI thread via runOnJS) ────────────────
  const navigateAway = () => {
    AsyncStorage.getItem(TOKEN_KEY)
      .then((token) => {
        if (token) {
          router.replace("/tasks");
        } else {
          router.replace("/login");
        }
      })
      .catch(() => {
        router.replace("/login");
      });
  };

  useEffect(() => {
    // Step 2 (300ms): Logo fades in + spring scale
    logoOpacity.value = withDelay(300, withTiming(1, { duration: 350 }));
    logoScale.value = withDelay(
      300,
      withSpring(1, { damping: 12, stiffness: 120 })
    );

    // Step 3 (800ms): Typewriter — one character every 80ms
    const typewriterStart = setTimeout(() => {
      let index = 0;
      typewriterRef.current = setInterval(() => {
        index += 1;
        setDisplayedName(APP_NAME.slice(0, index));
        if (index >= APP_NAME.length) {
          if (typewriterRef.current !== null) {
            clearInterval(typewriterRef.current);
          }
        }
      }, 80);
    }, 800);

    // Step 4 (1400ms): Tagline fades in
    taglineOpacity.value = withDelay(
      1400,
      withTiming(1, { duration: 400 })
    );

    // Step 5 (1800ms): Progress bar animates left → right
    progressWidth.value = withDelay(
      1800,
      withTiming(PROGRESS_WIDTH, {
        duration: 500,
        easing: Easing.out(Easing.ease),
      })
    );

    // Step 6 (2200ms): Entire screen fades out
    // Step 7 (2500ms): Navigate
    screenOpacity.value = withDelay(
      2200,
      withSequence(
        withTiming(0, { duration: 300 }, (finished) => {
          if (finished) {
            scheduleOnRN(navigateAway);
          }
        })
      )
    );

    return () => {
      clearTimeout(typewriterStart);
      if (typewriterRef.current !== null) {
        clearInterval(typewriterRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Animated styles ──────────────────────────────────────────────────────
  const screenStyle = useAnimatedStyle(() => ({
    opacity: screenOpacity.value,
  }));

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const taglineStyle = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value,
  }));

  const progressStyle = useAnimatedStyle(() => ({
    width: progressWidth.value,
  }));

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <Animated.View style={[styles.screen, screenStyle]}>
      <View style={styles.center}>
        {/* Logo mark */}
        <Animated.View style={[styles.logoWrap, logoStyle]}>
          <View style={styles.logoBox}>
            <Text style={styles.logoLetter}>T</Text>
          </View>
        </Animated.View>

        {/* App name — typewriter */}
        <View style={styles.nameRow}>
          {APP_NAME.split("").map((char, i) => (
            <Text
              key={i}
              style={[
                styles.appName,
                { opacity: i < displayedName.length ? 1 : 0 },
              ]}
            >
              {char}
            </Text>
          ))}
        </View>

        {/* Tagline */}
        <Animated.Text style={[styles.tagline, taglineStyle]}>
          Get things done.
        </Animated.Text>

        {/* Progress line */}
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressBar, progressStyle]} />
        </View>
      </View>

      {/* Version watermark */}
      <Text style={styles.version}>v1.0.0</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f4f7f5",
    alignItems: "center",
    justifyContent: "center",
  },
  center: {
    alignItems: "center",
  },

  /* ── Logo ── */
  logoWrap: {
    marginBottom: 28,
  },
  logoBox: {
    width: 80,
    height: 80,
    borderRadius: 22,
    backgroundColor: "#d9822b",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#d9822b",
    shadowOpacity: 0.24,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  logoLetter: {
    fontSize: 44,
    fontWeight: "900",
    color: "#ffffff",
    lineHeight: 50,
    letterSpacing: -2,
  },

  /* ── App name ── */
  nameRow: {
    flexDirection: "row",
  },
  appName: {
    fontSize: 36,
    fontWeight: "800",
    color: "#102a43",
    letterSpacing: 4,
  },

  /* ── Tagline ── */
  tagline: {
    marginTop: 10,
    fontSize: 14,
    fontStyle: "italic",
    color: "#627d98",
    letterSpacing: 0.5,
  },

  /* ── Progress line ── */
  progressTrack: {
    marginTop: 40,
    width: PROGRESS_WIDTH,
    height: 2,
    borderRadius: 1,
    backgroundColor: "#d9e2ec",
    overflow: "hidden",
  },
  progressBar: {
    height: 2,
    borderRadius: 1,
    backgroundColor: "#d9822b",
  },

  /* ── Version ── */
  version: {
    position: "absolute",
    bottom: 36,
    fontSize: 12,
    color: "#9fb3c8",
    letterSpacing: 1,
  },
});
