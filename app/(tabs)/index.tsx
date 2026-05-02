import { Text, View } from "@/components/Themed";
import { useAuthStore } from "@/src/state/authStore";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import { useCallback, useEffect, useMemo, useRef } from "react";
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
import { FindemLoader } from "@/components/FindemLoader";
import { useLearningModuleList } from "@/src/hooks/useLearningModuleList";

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


// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function Home() {
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);
  const careerPathLabel = useAuthStore((s) => s.careerPathLabel);
  const careerCategoryId = useAuthStore((s) => s.careerCategoryId);
  const { tasks, loadingRemote } = useLearningModuleList();

  const completed = tasks.filter((t) => t.progress === 100).length;
  const inProgress = tasks.filter(
    (t) => t.progress > 0 && t.progress < 100,
  ).length;
  const donePct =
    tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;

  const heroTitle = (careerPathLabel || "Software Development")
    .split(/\s+/)
    .slice(0, 3)
    .join("\n");

  const incompleteForHome = useMemo(
    () => tasks.filter((t) => t.progress < 100),
    [tasks],
  );
  const homePreviewTasks = incompleteForHome.slice(0, 2);
  const allModulesCompleted =
    tasks.length > 0 && incompleteForHome.length === 0;

  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerTranslateY = useRef(new Animated.Value(-30)).current;
  const heroOpacity = useRef(new Animated.Value(0)).current;
  const heroTranslateY = useRef(new Animated.Value(30)).current;

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
          <TouchableOpacity
            style={styles.avatarBtn}
            onPress={logout}
            accessibilityRole="button"
            accessibilityLabel="Sign out"
          >
            <BlurView intensity={80} tint="light" style={styles.avatarBlur}>
              <Ionicons name="person-outline" size={24} color="#0F172A" />
            </BlurView>
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.headerLogo}>Findem</Text>
          </View>

          <TouchableOpacity
            style={styles.notifBtn}
            accessibilityRole="button"
            accessibilityLabel="Notifications"
          >
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
          <Text style={styles.heroHeading}>{heroTitle}</Text>
          <Text style={styles.heroDesc}>
            Master your track from fundamentals to job-ready projects.
          </Text>
          <View style={styles.statsRow}>
            <StatPill
              value={`${tasks.length}`}
              label="MODULES"
              delay={300}
            />
            <StatPill
              value={`${inProgress}`}
              label="ACTIVE"
              delay={420}
            />
            <StatPill value={`${donePct}%`} label="DONE" delay={540} />
          </View>
        </Animated.View>

        {/* Section header */}
        <Animated.View style={[styles.sectionHeader, { opacity: heroOpacity }]}>
          <View
            lightColor="transparent"
            darkColor="transparent"
            style={styles.sectionHeaderTextCol}
          >
            <Text style={styles.sectionTitle}>Learning Path</Text>
            {careerCategoryId && loadingRemote ? (
              <FindemLoader
                variant="inline"
                message="Fetching your path…"
                style={{ marginTop: 4 }}
              />
            ) : (
              <Text style={styles.sectionSub}>
                {!careerCategoryId
                  ? "Pick a track to load modules"
                  : tasks.length === 0
                    ? "No modules for your track yet"
                    : `${tasks.length} module${tasks.length !== 1 ? "s" : ""}`}
              </Text>
            )}
          </View>
          <TouchableOpacity
            style={styles.seeAllBtn}
            onPress={() => router.navigate("/(tabs)/modules")}
            accessibilityRole="button"
            accessibilityLabel="See all learning modules"
          >
            <Text style={styles.seeAllText}>See All</Text>
            <Ionicons name="chevron-forward" size={14} color="#0EA5E9" />
          </TouchableOpacity>
        </Animated.View>

        {/* Learning path preview: up to 2 incomplete modules, or celebration when all done */}
        {allModulesCompleted ? (
          <View
            lightColor="transparent"
            darkColor="transparent"
            style={styles.completedLottieBlock}
          >
            <LottieView
              source={require("@/assets/animations/completed.json")}
              autoPlay
              loop={false}
              style={styles.completedLottie}
            />
            <Text style={styles.completedTitle}>You're all caught up</Text>
            <Text style={styles.completedSub}>
              Every module on your path is complete. Review anytime from See All.
            </Text>
          </View>
        ) : homePreviewTasks.length > 0 ? (
          homePreviewTasks.map((task, index, array) => (
            <TaskCard
              key={task.id}
              task={task}
              index={index}
              showMeta={false}
              cardStyle="index"
              showConnector={index < array.length - 1}
              onPress={() =>
                router.navigate(
                  `/(tabs)/moduleDetails?id=${encodeURIComponent(task.id)}`,
                )
              }
            />
          ))
        ) : (
          <View
            lightColor="transparent"
            darkColor="transparent"
            style={styles.pathEmptyWrap}
          >
            {!careerCategoryId ? (
              <Text style={styles.pathEmptyHint}>
                Finish career setup to see modules on your path.
              </Text>
            ) : loadingRemote ? (
              <FindemLoader variant="card" message="Loading your modules…" />
            ) : (
              <Text style={styles.pathEmptyHint}>
                No modules published for your track yet.
              </Text>
            )}
          </View>
        )}

        {/* <View style={{ height: 140 }} /> */}
      </ScrollView>

      {/* Unlock Opportunities */}
      {/* <UnlockButton /> */}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
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
  sectionHeaderTextCol: {
    backgroundColor: "transparent",
    flexShrink: 1,
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

  completedLottieBlock: {
    alignItems: "center",
    marginBottom: 24,
    backgroundColor: "transparent",
  },
  completedLottie: {
    width: SCREEN_WIDTH * 0.62,
    height: SCREEN_WIDTH * 0.62,
    maxWidth: 280,
    maxHeight: 280,
    backgroundColor: "transparent",
  },
  completedTitle: {
    fontSize: 20,
    fontWeight: "500",
    color: "#0F172A",
    letterSpacing: -0.4,
    marginTop: 4,
    textAlign: "center",
  },
  completedSub: {
    fontSize: 14,
    fontWeight: "300",
    color: "#64748B",
    textAlign: "center",
    marginTop: 8,
    paddingHorizontal: 12,
    lineHeight: 20,
    maxWidth: 320,
  },
  pathEmptyWrap: {
    alignSelf: "stretch",
    backgroundColor: "transparent",
  },
  pathEmptyHint: {
    fontSize: 14,
    fontWeight: "300",
    color: "#94A3B8",
    textAlign: "center",
    paddingVertical: 28,
    paddingHorizontal: 16,
    lineHeight: 21,
  },
});
