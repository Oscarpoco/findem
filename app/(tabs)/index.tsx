import { Text, View } from "@/components/Themed";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import { useAuthStore } from "@/src/state/authStore";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useRef } from "react";
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

import { learningTasks } from "@/src/data/learningTasks";

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

// ─── Progress Bar ─────────────────────────────────────────────────────────────
const ProgressBar = ({
  progress,
  accentColor,
}: {
  progress: number;
  accentColor: string;
}) => {
  const widthAnim = useRef(new Animated.Value(0)).current;

  useFocusEffect(
    useCallback(() => {
      widthAnim.setValue(0);
      Animated.timing(widthAnim, {
        toValue: progress,
        duration: 1000,
        delay: 600,
        useNativeDriver: false,
      }).start();

      return () => {
        widthAnim.stopAnimation();
      };
    }, [progress]),
  );

  if (progress === 0) return null;

  return (
    <View style={styles.progressBarTrack}>
      <Animated.View
        style={[
          styles.progressBarFill,
          {
            backgroundColor: accentColor,
            width: widthAnim.interpolate({
              inputRange: [0, 100],
              outputRange: ["0%", "100%"],
            }),
          },
        ]}
      />
    </View>
  );
};

// ─── Task Card ────────────────────────────────────────────────────────────────
const TaskCard = ({ task, index }: any) => {
  const translateX = useRef(
    new Animated.Value(index % 2 === 0 ? -SCREEN_WIDTH : SCREEN_WIDTH),
  ).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const pressScale = useRef(new Animated.Value(1)).current;

  const isRight = index % 2 !== 0;
  const isLocked = task.progress === 0;
  const isComplete = task.progress === 100;
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      translateX.setValue(index % 2 === 0 ? -SCREEN_WIDTH : SCREEN_WIDTH);
      opacity.setValue(0);
      pressScale.setValue(1);

      Animated.parallel([
        Animated.spring(translateX, {
          toValue: 0,
          delay: index * 120,
          tension: 55,
          friction: 9,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 400,
          delay: index * 120,
          useNativeDriver: true,
        }),
      ]).start();

      return () => {
        translateX.stopAnimation();
        opacity.stopAnimation();
      };
    }, [index, SCREEN_WIDTH]),
  );

  const onPressIn = () =>
    Animated.spring(pressScale, {
      toValue: 0.97,
      useNativeDriver: true,
      tension: 100,
      friction: 5,
    }).start();
  const onPressOut = () =>
    Animated.spring(pressScale, {
      toValue: 1,
      useNativeDriver: true,
      tension: 80,
      friction: 6,
    }).start();

  const WeekCircle = () => (
    <Animated.View style={styles.weekWrapper}>
      <Text style={styles.weekLabel}>WEEK</Text>

      <BlurView intensity={20} tint="light" style={styles.weekCircle}>
        <Text style={styles.weekCircleNum}>
          {isComplete ? (
            <Ionicons name="checkmark-done" size={32} color="#10B981" />
          ) : (
            task.week
          )}
        </Text>
      </BlurView>
    </Animated.View>
  );

  return (
    <Animated.View
      style={[
        styles.cardRowWrapper,
        { opacity, transform: [{ translateX }, { scale: pressScale }] },
      ]}
    >
      {/* Week circle on LEFT for even cards */}
      {!isRight && <WeekCircle />}

      <TouchableOpacity
        activeOpacity={1}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={() => router.navigate(`/(tabs)/moduleDetails?id=${task.id}`)}
        style={styles.cardTouchable}
      >
        <LinearGradient
          colors={task.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.cardGradient}
        >
          <View style={styles.noiseOverlay} />

          {/* Top: title + date/lock */}
          <View style={styles.cardTopRow}>
            <View style={styles.cardTitleBlock}>
              <Text style={styles.cardTitle}>{task.title}</Text>
              <Text style={styles.cardSubtitle}>{task.subtitle}</Text>
            </View>

            <View style={styles.cardRight}>
              <View style={styles.dateBadge}>
                <Text style={styles.dateText}>{task.dueDate}</Text>
              </View>
              {isLocked && (
                <View style={styles.lockIcon}>
                  <Ionicons
                    name="lock-closed"
                    size={13}
                    color="rgba(255,255,255,0.7)"
                  />
                </View>
              )}
            </View>
          </View>

          {/* Bottom: difficulty + progress + chevron */}
          <View style={styles.cardBottomRow}>
            <BlurView intensity={20} tint="dark" style={styles.diffBadge}>
              <View
                style={[styles.diffDot, { backgroundColor: task.accentColor }]}
              />
              <Text style={styles.diffText}>{task.difficulty}</Text>
            </BlurView>

            <View style={styles.progressSection}>
              <ProgressBar
                progress={task.progress}
                accentColor={task.accentColor}
              />
              {task.progress > 0 && (
                <Text style={[styles.progressPct, { color: task.accentColor }]}>
                  {task.progress}%
                </Text>
              )}
            </View>

            <BlurView intensity={25} tint="light" style={styles.arrowBtn}>
              <Ionicons name="chevron-forward" size={18} color="#fff" />
            </BlurView>
          </View>
        </LinearGradient>
      </TouchableOpacity>

      {/* Week circle on RIGHT for odd cards */}
      {isRight && <WeekCircle />}
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

// ─── Unlock Button ────────────────────────────────────────────────────────────
const UnlockButton = () => {
  const allComplete = learningTasks.every((t) => t.progress === 100);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!allComplete) return;
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.03,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  const onPressIn = () => {
    if (!allComplete) return;
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
      tension: 100,
      friction: 5,
    }).start();
  };
  const onPressOut = () => {
    if (!allComplete) return;
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 80,
      friction: 6,
    }).start();
  };

  return (
    <Animated.View
      style={[styles.unlockWrap, { transform: [{ scale: scaleAnim }] }]}
    >
      <TouchableOpacity
        activeOpacity={allComplete ? 0.85 : 1}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        disabled={!allComplete}
        style={styles.unlockTouchable}
      >
        <LinearGradient
          colors={allComplete ? ["#EF4444", "#B91C1C"] : ["#CBD5E1", "#94A3B8"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.unlockGradient}
        >
          <View style={styles.unlockInner}>
            <Ionicons
              name={allComplete ? "rocket-outline" : "lock-closed-outline"}
              size={22}
              color={allComplete ? "#fff" : "rgba(255,255,255,0.7)"}
              style={{ marginRight: 10 }}
            />
            <Text style={[styles.unlockText, !allComplete && { opacity: 0.7 }]}>
              {allComplete
                ? "Unlock Opportunities"
                : "Complete All Modules to Unlock"}
            </Text>
            {allComplete && (
              <Ionicons
                name="chevron-forward"
                size={20}
                color="#fff"
                style={{ marginLeft: 8 }}
              />
            )}
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function Home() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const logout = useAuthStore((s) => s.logout);

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
        {learningTasks.slice(0, 2).map((task, index) => (
          <TaskCard key={task.id} task={task} index={index} />
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

  // ── Card row wrapper (circle + card) ──
  cardRowWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  // Week circle — sits outside the card
  weekCircle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.7)",
    backgroundColor: "rgba(200,210,255,0.25)",
    overflow: "hidden",
    marginHorizontal: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  weekCircleNum: {
    fontSize: 18,
    fontWeight: "900",
    color: "#0F172A",
    letterSpacing: -0.5,
  },
  weekWrapper: { justifyContent: "center", alignItems: "center", gap: 10 },

  // Card
  cardTouchable: { flex: 1, borderRadius: 38, overflow: "hidden" },
  cardGradient: { borderRadius: 38, padding: 18, paddingBottom: 14 },
  noiseOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },

  cardTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 14,
    backgroundColor: "transparent",
  },
  cardTitleBlock: { flex: 1, backgroundColor: "transparent" },
  weekRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
    backgroundColor: "transparent",
  },
  weekLabel: {
    fontSize: 15,
    fontWeight: "500",
    color: "rgba(7, 7, 7, 0.6)",
    letterSpacing: 0.5,
  },
  weekNum: {
    fontSize: 10,
    fontWeight: "900",
    color: "rgba(255,255,255,0.95)",
    letterSpacing: 0.5,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "300",
    color: "#fff",
    letterSpacing: -0.8,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12,
    color: "rgba(255,255,255,0.75)",
    lineHeight: 17,
  },

  cardRight: {
    alignItems: "flex-end",
    gap: 10,
    backgroundColor: "transparent",
  },
  dateBadge: {
    backgroundColor: "rgba(255,255,255,0.25)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  dateText: {
    fontSize: 11,
    fontWeight: "300",
    color: "#fff",
    letterSpacing: 0.5,
  },
  lockIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },

  cardBottomRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "transparent",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.15)",
    paddingTop: 12,
  },
  diffBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    overflow: "hidden",
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  diffDot: { width: 6, height: 6, borderRadius: 3 },
  diffText: {
    fontSize: 10,
    fontWeight: "300",
    color: "rgba(255,255,255,0.9)",
    letterSpacing: 0.8,
  },

  progressSection: { flex: 1, backgroundColor: "transparent", gap: 4 },
  progressBarTrack: {
    height: 5,
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: { height: "100%", borderRadius: 4 },
  progressPct: { fontSize: 10, fontWeight: "800" },

  arrowBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.15)",
  },

  // ── Unlock Button ──
  unlockWrap: {
    position: "absolute",
    bottom: -50,
    left: 0,
    right: 0,
    borderRadius: 28,
    shadowColor: "#EF4444",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 20,
    elevation: 14,
  },
  unlockTouchable: { borderRadius: 28, overflow: "hidden" },
  unlockGradient: { borderRadius: 28 },
  unlockInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    paddingHorizontal: 24,
  },
  unlockText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: -0.3,
  },
});
