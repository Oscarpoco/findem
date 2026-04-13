import { Text, View } from "@/components/Themed";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import { useAuthStore } from "@/src/state/authStore";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    ScrollView,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
} from "react-native";

export const screenOptions = {
  title: "index",
  headerShown: false,
};

import { TaskCard } from "@/components/TaskCard";
import { getLearningTasks, LearningTask } from "@/src/data/learningTasks";
import { useProgressStore } from "@/src/state/progressStore";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// ─── Stat Pill ────────────────────────────────────────────────────────────────
const StatPill = ({
  value,
  label,
  delay,
}: {
  value: string;
  label: string;
  delay: number;
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.7)).current;

  useFocusEffect(
    useCallback(() => {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.7);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          delay,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          delay,
          tension: 60,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();

      return () => {
        fadeAnim.stopAnimation();
      };
    }, [delay]),
  );

  return (
    <Animated.View
      style={[
        styles.statPill,
        { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
      ]}
    >
      <BlurView intensity={10} tint="light" style={styles.statPillBlur}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
      </BlurView>
    </Animated.View>
  );
};

// ─── Floating Orb ─────────────────────────────────────────────────────────────
const FloatingOrb = ({
  color,
  size,
  top,
  left,
  delay,
}: {
  color: string;
  size: number;
  top: number;
  left: number;
  delay: number;
}) => {
  const floatAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      delay,
      useNativeDriver: true,
    }).start();
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 3000 + delay * 0.5,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 3000 + delay * 0.5,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, []);

  return (
    <Animated.View
      style={{
        position: "absolute",
        top,
        left,
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        opacity: fadeAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 0.12],
        }),
        transform: [
          {
            translateY: floatAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, -20],
            }),
          },
        ],
      }}
    />
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function Home() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const logout = useAuthStore((s) => s.logout);
  const progress = useProgressStore((state) => state.progress);
  const [tasks, setTasks] = useState<LearningTask[]>([]);

  // Initialize tasks after store is hydrated
  useEffect(() => {
    setTasks(getLearningTasks(progress));
  }, [progress]);

  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerTranslateY = useRef(new Animated.Value(-30)).current;
  const heroOpacity = useRef(new Animated.Value(0)).current;
  const heroTranslateY = useRef(new Animated.Value(30)).current;

  useFocusEffect(
    useCallback(() => {
      setTasks(getLearningTasks(progress));
    }, [progress]),
  );

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(headerTranslateY, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.parallel([
      Animated.timing(heroOpacity, {
        toValue: 1,
        duration: 700,
        delay: 200,
        useNativeDriver: true,
      }),
      Animated.spring(heroTranslateY, {
        toValue: 0,
        delay: 200,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <FloatingOrb
        color="#0EA5E9"
        size={600}
        top={-180}
        left={-100}
        delay={0}
      />

      {/* Header */}
      <Animated.View
        style={[
          styles.headerWrapper,
          {
            opacity: headerOpacity,
            transform: [{ translateY: headerTranslateY }],
          },
        ]}
      >
        <BlurView intensity={10} tint="light" style={styles.header}>
          <TouchableOpacity style={styles.avatarBtn}>
            <BlurView intensity={80} tint="light" style={styles.avatarBlur}>
              <Ionicons name="person-outline" size={24} color="#0F172A" />
            </BlurView>
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.headerLogo}>Findem</Text>
          </View>

          <TouchableOpacity style={styles.notifBtn}>
            <BlurView intensity={80} tint="light" style={styles.notifBlur}>
              <View style={styles.notifDot} />
              <Ionicons
                name="notifications-outline"
                size={24}
                color="#0F172A"
              />
            </BlurView>
          </TouchableOpacity>
        </BlurView>
      </Animated.View>

      {/* Scroll */}
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero */}
        <Animated.View
          style={[
            styles.hero,
            {
              opacity: heroOpacity,
              transform: [{ translateY: heroTranslateY }],
            },
          ]}
        >
          <Text style={styles.heroHeading}>Software{"\n"}Development</Text>
          <Text style={styles.heroDesc}>
            Master full-stack engineering from fundamentals to production
            deployment.
          </Text>
          <View style={styles.statsRow}>
            <StatPill value="5" label="MODULES" delay={300} />
            <StatPill value="2" label="ACTIVE" delay={420} />
            <StatPill value="47%" label="DONE" delay={540} />
          </View>
        </Animated.View>

        {/* Section header */}
        <Animated.View style={[styles.sectionHeader, { opacity: heroOpacity }]}>
          <View style={{ backgroundColor: "transparent" }}>
            <Text style={styles.sectionTitle}>Learning Path</Text>
            <Text style={styles.sectionSub}>5 modules · 10 weeks</Text>
          </View>
          <TouchableOpacity
            style={styles.seeAllBtn}
            onPress={() => router.navigate("/(tabs)/modules")}
          >
            <Text style={styles.seeAllText}>See All</Text>
            <Ionicons name="chevron-forward" size={14} color="#0EA5E9" />
          </TouchableOpacity>
        </Animated.View>

        {/* Cards */}
        {tasks
          .filter((task) => task.progress < 100)
          .slice(0, 2)
          .map((task, index, array) => (
            <TaskCard
              key={task.id}
              task={task}
              index={index}
              showMeta={false}
              cardStyle="index"
              showConnector={index < array.length - 1}
              onPress={() =>
                router.navigate(`/(tabs)/moduleDetails?id=${task.id}`)
              }
            />
          ))}

        {/* <View style={{ height: 140 }} /> */}
      </ScrollView>

      {/* Unlock Opportunities */}
      {/* <UnlockButton /> */}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const CIRCLE_SIZE = 52;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F0F4FF" },

  // Header
  headerWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingTop: 64,
    paddingBottom: 16,
    zIndex: 10,
  },
  avatarBtn: { borderRadius: 25, overflow: "hidden" },
  avatarBlur: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.6)",
    overflow: "hidden",
  },
  headerCenter: { alignItems: "center", backgroundColor: "transparent" },
  headerLogo: {
    fontSize: 32,
    color: "#0F172A",
    letterSpacing: -1,
    fontFamily: "GeomSemiBold",
  },
  notifBtn: { borderRadius: 25, overflow: "hidden" },
  notifBlur: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.6)",
    overflow: "hidden",
  },
  notifDot: {
    position: "absolute",
    top: 9,
    right: 9,
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: "#EF4444",
    borderWidth: 2,
    borderColor: "#fff",
    zIndex: 1,
  },

  // Scroll
  scroll: { flex: 1, paddingTop: 140 },
  scrollContent: { paddingHorizontal: 15 },

  // Hero
  hero: { marginTop: 8, marginBottom: 36, backgroundColor: "transparent" },
  heroHeading: {
    fontSize: 38,
    fontWeight: "300",
    color: "#0F172A",
    lineHeight: 42,
    letterSpacing: -2,
    marginBottom: 14,
  },
  heroDesc: {
    fontSize: 15,
    color: "#64748B",
    lineHeight: 22,
    marginBottom: 28,
    maxWidth: "85%",
  },
  statsRow: { flexDirection: "row", gap: 12, backgroundColor: "transparent" },
  statPill: {
    flex: 1,
    borderRadius: 28,
    overflow: "hidden",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  statPillBlur: {
    paddingVertical: 18,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "rgba(25, 100, 170, 0.12)",
    borderRadius: 28,
    alignItems: "center",
    overflow: "hidden",
  },
  statValue: {
    fontSize: 26,
    fontWeight: "500",
    color: "#0F172A",
    letterSpacing: -1,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 9,
    fontWeight: "400",
    color: "#64748B",
    letterSpacing: 1.5,
  },

  // Section header
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "transparent",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "300",
    color: "#0F172A",
    letterSpacing: -0.8,
    marginBottom: 2,
  },
  sectionSub: { fontSize: 13, color: "#94A3B8", fontWeight: "200" },
  seeAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(14,165,233,0.1)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  seeAllText: { fontSize: 13, fontWeight: "300", color: "#0EA5E9" },
});
