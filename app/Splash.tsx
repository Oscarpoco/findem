import { useColorScheme } from "@/components/useColorScheme";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Animated,
  StatusBar,
  Easing,
  View,
  Text,
  Dimensions,
} from "react-native";

import axios from "axios";
import { FindemLoader } from "@/components/FindemLoader";
import { useAuthStore } from "@/src/state/authStore";
import { useOnboardingStore } from "@/src/state/onboardingStore";

export const screenOptions = {
  title: "Splash",
  headerShown: false,
};

const { width, height } = Dimensions.get("window");
import { EXPO_PUBLIC_API_URL } from "@/src/lib/env";

export default function SplashScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [isLoading, setIsLoading] = useState(false);

  // Professional education palette (aligned with in-app brand)
  const BG = isDark ? "#0f1419" : "#fafbfc";
  const FG = isDark ? "#e8eaed" : "#0d1117";
  const ACCENT = isDark ? "#03d8fd" : "#03d8fd";
  const MUTED = isDark ? "#4a5568" : "#6b7280";

  /* ─── ANIM VALUES ─── */
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.94)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const footerOpacity = useRef(new Animated.Value(0)).current;

  /* ─── HELPERS ─── */
  const wakeUpServer = async (): Promise<boolean> => {
    if (!EXPO_PUBLIC_API_URL) {
      console.error("API_BASE_URL is not set");
      return true;
    }
    setIsLoading(true);
    try {
      const response = await axios.get(`${EXPO_PUBLIC_API_URL}`);
      return response.status === 200;
    } catch (error) {
      if (__DEV__) console.error("Error waking up server:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const animation = Animated.sequence([
      Animated.delay(150),
      // Logo appears with refined easing
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 700,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          useNativeDriver: true,
        }),
        Animated.timing(logoScale, {
          toValue: 1,
          duration: 700,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(200),
      // Tagline fades in
      Animated.timing(taglineOpacity, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.delay(150),
      // Footer appears
      Animated.timing(footerOpacity, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]);

    const run = async () => {
      const animationPromise = new Promise<void>((resolve) =>
        animation.start(() => resolve())
      );

      const serverPromise = wakeUpServer();

      await Promise.all([animationPromise, serverPromise]);

      if (cancelled) return;

      const auth = useAuthStore.getState();
      if (auth.isAuthenticated) {
        await auth.syncCareerFromApi();
      }

      const authAfterSync = useAuthStore.getState();
      const onboarding = useOnboardingStore.getState();

      if (authAfterSync.isAuthenticated) {
        if (!authAfterSync.profileCompleted) {
          router.replace("/ProfileUpdate");
        } else if (!authAfterSync.careerCompleted) {
          router.replace("/CareerPath");
        } else {
          router.replace("/(tabs)");
        }
      } else if (onboarding.completed) {
        router.replace("/Login");
      } else {
        router.replace("/Onboarding");
      }
    };

    run();

    return () => {
      cancelled = true;
      animation.stop();
    };
  }, []);

  return (
    <View style={[styles.root, { backgroundColor: BG }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      {/* Main content container */}
      <View style={styles.container}>
        {/* Logo section */}
        <Animated.View
          style={[
            styles.logoSection,
            {
              opacity: logoOpacity,
              transform: [{ scale: logoScale }],
            },
          ]}
        >
          {/* Wordmark */}
          <Text style={[styles.wordmark, { color: FG }]}>Findem</Text>
          
          {/* Separator line */}
          <View style={[styles.separator, { backgroundColor: ACCENT }]} />
          
          {/* Tagline */}
          <Animated.View style={{ opacity: taglineOpacity }}>
            <Text style={[styles.tagline, { color: MUTED }]}>
              Learn skills. Build your path.
            </Text>
          </Animated.View>
        </Animated.View>

        {/* Loading indicator positioned below logo */}
        {isLoading && (
          <View style={styles.loaderWrapper}>
            <FindemLoader variant="inline" indicatorColor={ACCENT} />
          </View>
        )}
      </View>

      {/* Footer */}
      <Animated.View
        style={[
          styles.footer,
          { opacity: footerOpacity },
        ]}
      >
        <Text style={[styles.footerText, { color: MUTED }]}>
          Gemini — reserved for upcoming AI features
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },

  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 48,
  },

  logoSection: {
    alignItems: "center",
  },

  wordmark: {
    fontFamily: "GeomBlack",
    fontSize: 64,
    letterSpacing: -3,
    marginBottom: 20,
  },

  separator: {
    width: 48,
    height: 3,
    borderRadius: 1.5,
    marginBottom: 20,
  },

  tagline: {
    fontFamily: "GeomRegular",
    fontSize: 17,
    letterSpacing: 0.2,
    textAlign: "center",
  },

  loaderWrapper: {
    marginTop: 56,
  },

  footer: {
    position: "absolute",
    bottom: 48,
    left: 0,
    right: 0,
    alignItems: "center",
  },

  footerText: {
    fontFamily: "GeomRegular",
    fontSize: 11,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
});