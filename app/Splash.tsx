import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
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
  ActivityIndicator,
} from "react-native";

import axios from "axios";
import { useAuthStore } from "@/src/state/authStore";
import { useOnboardingStore } from "@/src/state/onboardingStore";

export const screenOptions = {
  title: "Splash",
  headerShown: false,
};

const { width } = Dimensions.get("window");
const EXPO_PUBLIC_API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function SplashScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const TINT = Colors.light.tint;
  const [isLoading, setIsLoading] = useState(false);

  const BG = isDark ? "#080810" : "#f7f7fb";
  const FG = isDark ? "#ffffff" : "#0a0a14";

  /* ─── ANIM VALUES ─── */
  const lineScale = useRef(new Animated.Value(0)).current;
  const topFade   = useRef(new Animated.Value(0)).current;
  const topY      = useRef(new Animated.Value(-20)).current;
  const nameFade  = useRef(new Animated.Value(0)).current;
  const nameScale = useRef(new Animated.Value(0.88)).current;
  const subFade   = useRef(new Animated.Value(0)).current;

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
    } finally{
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const hydrateStores = async () => {
      const authPersist = (useAuthStore as any).persist;
      const onboardingPersist = (useOnboardingStore as any).persist;

      try {
        await Promise.all([
          authPersist?.rehydrate?.(),
          onboardingPersist?.rehydrate?.(),
        ]);
      } catch (error) {
        if (__DEV__) console.warn("Store hydration failed:", error);
      }
    };

    const animation = Animated.sequence([
      Animated.delay(200),
      /* accent line sweeps in */
      Animated.timing(lineScale, {
        toValue: 1,
        duration: 420,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
      /* top tag drops in */
      Animated.parallel([
        Animated.timing(topFade, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(topY, {
          toValue: 0,
          duration: 300,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
      /* main name scales up */
      Animated.parallel([
        Animated.timing(nameFade, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(nameScale, {
          toValue: 1,
          friction: 7,
          tension: 120,
          useNativeDriver: true,
        }),
      ]),
      /* tagline + bottom text fade to their intended dim opacities */
      Animated.timing(subFade, {
        toValue: 1,
        duration: 360,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]);

    const run = async () => {
      const animationPromise = new Promise<void>((resolve) =>
        animation.start(() => resolve())
      );

      const hydrationPromise = hydrateStores();
      const serverPromise = wakeUpServer();

      await Promise.all([animationPromise, hydrationPromise, serverPromise]);

      if (cancelled) return;

      const auth = useAuthStore.getState();
      const onboarding = useOnboardingStore.getState();

      if (auth.isAuthenticated) {
        if (!auth.profileCompleted) {
          router.replace("/ProfileUpdate");
        } else if (!auth.careerCompleted) {
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

      {/* ─── BACKGROUND DECORATIONS ─── */}
      <View style={[styles.bgRingOuter, { borderColor: TINT + "18" }]} />
      <View style={[styles.bgBlobBL,   { backgroundColor: TINT + "0e" }]} />

      {/* ─── CENTER CONTENT ─── */}
      <View style={styles.center}>
        {/* north@health tag */}
        <Animated.View
          style={{ opacity: topFade, transform: [{ translateY: topY }] }}
        >
          <View style={[styles.topTag, { borderColor: TINT + "55" }]}>
            <View style={[styles.tagDot, { backgroundColor: TINT }]} />
            <Text style={[styles.tagText, { color: TINT }]}>
              north @ health
            </Text>
          </View>
        </Animated.View>

        {/* accent rule */}
        <Animated.View
          style={[
            styles.accentLine,
            { backgroundColor: TINT, transform: [{ scaleX: lineScale }] },
          ]}
        />

        {/* main wordmark */}
        <Animated.Text
          style={[
            styles.mainWord,
            { color: FG, opacity: nameFade, transform: [{ scale: nameScale }] },
          ]}
        >
          Findem
        </Animated.Text>

        {/* tagline — opacity driven entirely by subFade (toValue: 0.4) */}
        <Animated.Text
          style={[
            styles.subWord,
            {
              color: FG,
              opacity: subFade.interpolate({
                inputRange:  [0, 1],
                outputRange: [0, 0.4],
              }),
            },
          ]}
        >
          Find. Connect. Care.
        </Animated.Text>
      </View>

      <View style={{ position: 'absolute', bottom: 150, left: 0, right: 0, alignItems: 'center', justifyContent: 'center' }}>
        {isLoading && <ActivityIndicator size={'large'} color={TINT}/>}
      </View>

      {/* ─── BOTTOM WORDMARK — opacity driven by subFade (toValue: 0.22) ─── */}
      <Animated.Text
        style={[
          styles.bottomText,
          {
            color: FG,
            opacity: subFade.interpolate({
              inputRange:  [0, 1],
              outputRange: [0, 0.22],
            }),
          },
        ]}
      >
        Powered by Gemini.ai
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  /* ─── BG ─── */
  bgRingOuter: {
    position: "absolute",
    width: width * 1.1,
    height: width * 1.1,
    borderRadius: width * 0.55,
    borderWidth: 1,
    top: -width * 0.3,
    right: -width * 0.3,
  },
  bgBlobBL: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 130,
    bottom: -70,
    left: -70,
  },

  /* ─── CENTER ─── */
  center: {
    alignItems: "flex-start",
    paddingHorizontal: 36,
    width: "100%",
  },

  topTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: 22,
    alignSelf: "flex-start",
  },
  tagDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  tagText: {
    fontFamily: "GeomMedium",
    fontSize: 11,
    letterSpacing: 1.6,
    textTransform: "uppercase",
  },

  accentLine: {
    width: 52,
    height: 4,
    borderRadius: 2,
    marginBottom: 16,
  },

  mainWord: {
    fontFamily: "GeomBlack",
    fontSize: 76,
    letterSpacing: -4,
    lineHeight: 78,
    marginBottom: 16,
  },

  subWord: {
    fontFamily: "GeomLight",
    fontSize: 15,
    letterSpacing: 0.4,

  },

  /* ─── BOTTOM ─── */
  bottomText: {
    position: "absolute",
    bottom: 48,
    fontFamily: "GeomRegular",
    fontSize: 11,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
});