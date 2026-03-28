import { Text, View } from "@/components/Themed";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import { useRouter } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { useRef, useEffect } from "react";
import { useAuthStore } from "@/src/state/authStore";

export const screenOptions = {
  title: "index",
  headerShown: false,
};

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const learningTasks = [
  {
    id: 1,
    week: "01",
    title: "HTML & CSS",
    subtitle: "Responsive design fundamentals",
    dueDate: "APR 5",
    difficulty: "BEGINNER",
    progress: 65,
    gradient: ["#0EA5E9", "#0284C7"] as [string, string],
    accentColor: "#38BDF8",
  },
  {
    id: 2,
    week: "02",
    title: "JavaScript",
    subtitle: "DOM & async programming",
    dueDate: "APR 12",
    difficulty: "BEGINNER",
    progress: 30,
    gradient: ["#7C3AED", "#5B21B6"] as [string, string],
    accentColor: "#A78BFA",
  },
  {
    id: 3,
    week: "03",
    title: "ES6+ Advanced",
    subtitle: "Modern patterns & APIs",
    dueDate: "APR 19",
    difficulty: "INTERMEDIATE",
    progress: 0,
    gradient: ["#059669", "#047857"] as [string, string],
    accentColor: "#34D399",
  },
  {
    id: 4,
    week: "04",
    title: "React Native",
    subtitle: "Cross-platform mobile dev",
    dueDate: "APR 26",
    difficulty: "INTERMEDIATE",
    progress: 0,
    gradient: ["#DB2777", "#BE185D"] as [string, string],
    accentColor: "#F472B6",
  },
  {
    id: 5,
    week: "05",
    title: "Backend APIs",
    subtitle: "Node.js, Express & databases",
    dueDate: "MAY 3",
    difficulty: "ADVANCED",
    progress: 0,
    gradient: ["#D97706", "#B45309"] as [string, string],
    accentColor: "#FCD34D",
  },
];

// ─── Animated Stat Card ──────────────────────────────────────────────────────
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

  useEffect(() => {
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
  }, []);

  return (
    <Animated.View
      style={[
        styles.statPill,
        { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
      ]}
    >
      <BlurView intensity={10} tint="dark" style={styles.statPillBlur}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
      </BlurView>
    </Animated.View>
  );
};

// ─── Progress Arc SVG-style bar ───────────────────────────────────────────────
const ProgressBar = ({
  progress,
  accentColor,
}: {
  progress: number;
  accentColor: string;
}) => {
  const widthAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: progress,
      duration: 1000,
      delay: 600,
      useNativeDriver: false,
    }).start();
  }, []);

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
      <Text style={[styles.progressLabel, { color: accentColor }]}>
        {progress}%
      </Text>
    </View>
  );
};

// ─── Task Card ────────────────────────────────────────────────────────────────
const TaskCard = ({ task, index }: any) => {
  const translateX = useRef(new Animated.Value(-SCREEN_WIDTH)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const pressScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
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
  }, []);

  const onPressIn = () => {
    Animated.spring(pressScale, {
      toValue: 0.96,
      useNativeDriver: true,
      tension: 100,
      friction: 5,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(pressScale, {
      toValue: 1,
      useNativeDriver: true,
      tension: 80,
      friction: 6,
    }).start();
  };

  const isLocked = task.progress === 0;

  return (
    <Animated.View
      style={[
        styles.cardWrapper,
        {
          opacity,
          transform: [{ translateX }, { scale: pressScale }],
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={styles.cardTouchable}
      >
        <LinearGradient
          colors={task.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.cardGradient}
        >
          {/* Noise overlay for texture */}
          <View style={styles.noiseOverlay} />

          {/* Top row */}
          <View style={styles.cardTopRow}>
            {/* Week circle */}
            <BlurView intensity={20} tint="light" style={styles.weekCircle}>
              <Text style={styles.weekCircleNum}>{task.week}</Text>
            </BlurView>

            {/* Title block */}
            <View style={styles.cardTitleBlock}>
              <View style={styles.weekRow}>
                <Text style={styles.weekLabel}>WEEK</Text>
                <Text style={styles.weekNum}>{task.week}</Text>
              </View>
              <Text style={styles.cardTitle}>{task.title}</Text>
              <Text style={styles.cardSubtitle}>{task.subtitle}</Text>
            </View>

            {/* Right: date + lock */}
            <View style={styles.cardRight}>
              <View style={styles.dateBadge}>
                <Text style={styles.dateText}>{task.dueDate}</Text>
              </View>
              {isLocked && (
                <View style={styles.lockIcon}>
                  <Ionicons name="lock-closed" size={14} color="rgba(255,255,255,0.7)" />
                </View>
              )}
            </View>
          </View>

          {/* Bottom row */}
          <View style={styles.cardBottomRow}>
            <BlurView intensity={20} tint="dark" style={styles.diffBadge}>
              <View
                style={[
                  styles.diffDot,
                  { backgroundColor: task.accentColor },
                ]}
              />
              <Text style={styles.diffText}>{task.difficulty}</Text>
            </BlurView>

            <View style={styles.progressSection}>
              <ProgressBar
                progress={task.progress}
                accentColor={task.accentColor}
              />
            </View>

            <BlurView intensity={25} tint="light" style={styles.arrowBtn}>
              <Ionicons name="chevron-forward" size={18} color="#fff" />
            </BlurView>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

// ─── Floating Orbs ────────────────────────────────────────────────────────────
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
      ])
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

  // Header animation
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerTranslateY = useRef(new Animated.Value(-30)).current;

  // Hero text animation
  const heroOpacity = useRef(new Animated.Value(0)).current;
  const heroTranslateY = useRef(new Animated.Value(30)).current;

  // FAB pulse
  const fabPulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Header slides in
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

    // Hero fades up
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

    // FAB pulse loop
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(fabPulse, {
          toValue: 1.08,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(fabPulse, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  const handleLogout = async () => {
    await logout();
    router.replace("/Login");
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* ── Floating background orbs ── */}
      <FloatingOrb color="#0EA5E9" size={600} top={-180} left={-100} delay={0} />
      {/* <FloatingOrb color="#7C3AED" size={220} top={200} left={SCREEN_WIDTH - 120} delay={500} /> */}
      <FloatingOrb color="#DB2777" size={180} top={500} left={-40} delay={300} />
      <FloatingOrb color="#D97706" size={150} top={800} left={SCREEN_WIDTH - 80} delay={800} />

      {/* ── Header ── */}
      <Animated.View
        style={[
          styles.header,
          {
            opacity: headerOpacity,
            transform: [{ translateY: headerTranslateY }],
          },
        ]}
      >
        <TouchableOpacity style={styles.avatarBtn}>
          <BlurView intensity={50} tint="light" style={styles.avatarBlur}>
            <Ionicons name="person-outline" size={26} color="#0F172A" />
          </BlurView>
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerLogo}>Findem</Text>
        </View>

        <TouchableOpacity style={styles.notifBtn}>
          <BlurView intensity={50} tint="light" style={styles.notifBlur}>
            <View style={styles.notifDot} />
            <Ionicons name="notifications-outline" size={26} color="#0F172A" />
          </BlurView>
        </TouchableOpacity>
      </Animated.View>

      {/* ── Scrollable Content ── */}
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Hero ── */}
        <Animated.View
          style={[
            styles.hero,
            {
              opacity: heroOpacity,
              transform: [{ translateY: heroTranslateY }],
            },
          ]}
        >
          <Text style={styles.heroEyebrow}>YOUR JOURNEY</Text>
          <Text style={styles.heroHeading}>Software{"\n"}Development</Text>
          <Text style={styles.heroDesc}>
            Master full-stack engineering from fundamentals to production deployment.
          </Text>

          {/* Stats row */}
          <View style={styles.statsRow}>
            <StatPill value="5" label="MODULES" delay={300} />
            <StatPill value="2" label="ACTIVE" delay={420} />
            <StatPill value="47%" label="DONE" delay={540} />
          </View>
        </Animated.View>

        {/* ── Section header ── */}
        <Animated.View
          style={[
            styles.sectionHeader,
            { opacity: heroOpacity },
          ]}
        >
          <View style={{ backgroundColor: 'transparent'}}>
            <Text style={styles.sectionTitle}>Learning Path</Text>
            <Text style={styles.sectionSub}>5 modules · 10 weeks</Text>
          </View>
          <TouchableOpacity style={styles.seeAllBtn}>
            <Text style={styles.seeAllText}>See All</Text>
            <Ionicons name="chevron-forward" size={14} color="#0EA5E9" />
          </TouchableOpacity>
        </Animated.View>

        {/* ── Cards ── */}
        {learningTasks.map((task, index) => (
          <TaskCard key={task.id} task={task} index={index} />
        ))}

        {/* <View style={{ height: 120 }} /> */}
      </ScrollView>

      {/* ── AI FAB ── */}
   
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F4FF",
  },

  // ── Header ──
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingTop: 64,
    paddingBottom: 16,
    zIndex: 10,
  },
  avatarBtn: {
    borderRadius: 22,
    overflow: "hidden",
    shadowColor: "#0EA5E9",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  avatarBlur: {
    width: 50,
    height: 50,
    borderRadius: 38,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.6)",
    overflow: "hidden",
  },
  headerCenter: {
    alignItems: "center",
    backgroundColor: "transparent",
  },
  headerLogo: {
    fontSize: 32,
    fontWeight: "900",
    color: "#0F172A",
    letterSpacing: -1,
  },
  notifBtn: {
    borderRadius: 22,
    overflow: "hidden",
  },
  notifBlur: {
    width: 50,
    height: 50,
    borderRadius: 38,
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

  // ── Scroll ──
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 15 },

  // ── Hero ──
  hero: {
    marginTop: 8,
    marginBottom: 36,
    backgroundColor: "transparent",
  },
  heroEyebrow: {
    fontSize: 11,
    fontWeight: "700",
    color: "#0EA5E9",
    letterSpacing: 3,
    marginBottom: 10,
  },
  heroHeading: {
    fontSize: 46,
    fontWeight: "900",
    color: "#0F172A",
    lineHeight: 52,
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
  statsRow: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: "transparent",
  },
  statPill: {
    flex: 1,
    borderRadius: 18,
    overflow: "hidden",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
  statPillBlur: {
    paddingVertical: 18,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.7)",
    borderRadius: 28,
    alignItems: "center",
    overflow: "hidden",
  },
  statValue: {
    fontSize: 26,
    fontWeight: "900",
    color: "#0F172A",
    letterSpacing: -1,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: "#64748B",
    letterSpacing: 1.5,
  },

  // ── Section header ──
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "none",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.8,
    marginBottom: 2,
  },
  sectionSub: {
    fontSize: 13,
    color: "#94A3B8",
    fontWeight: "500",
  },
  seeAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(14,165,233,0.1)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0EA5E9",
  },

  // ── Cards ──
  cardWrapper: {
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 8,
  },
  cardTouchable: {
    borderRadius: 24,
    overflow: "hidden",
  },
  cardGradient: {
    borderRadius: 24,
    padding: 20,
    paddingBottom: 16,
  },
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
    marginBottom: 16,
    gap: 14,
    backgroundColor: "transparent",
  },
  weekCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.5)",
    backgroundColor: "rgba(255,255,255,0.2)",
    overflow: "hidden",
  },
  weekCircleNum: {
    fontSize: 18,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: -0.5,
  },
  cardTitleBlock: {
    flex: 1,
    backgroundColor: "transparent",
  },
  weekRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
    backgroundColor: "transparent",
  },
  weekLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "rgba(255,255,255,0.6)",
    letterSpacing: 1.5,
  },
  weekNum: {
    fontSize: 10,
    fontWeight: "900",
    color: "rgba(255,255,255,0.95)",
    letterSpacing: 0.5,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: -0.8,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: "rgba(255,255,255,0.75)",
    lineHeight: 18,
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
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 0.5,
  },
  lockIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
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
    paddingTop: 14,
  },
  diffBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    overflow: "hidden",
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  diffDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  diffText: {
    fontSize: 10,
    fontWeight: "800",
    color: "rgba(255,255,255,0.9)",
    letterSpacing: 0.8,
  },
  progressSection: {
    flex: 1,
    backgroundColor: "transparent",
  },
  progressBarTrack: {
    height: 6,
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: 4,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 4,
  },
  progressLabel: {
    position: "absolute",
    right: -32,
    fontSize: 10,
    fontWeight: "800",
  },
  arrowBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.15)",
  },

  // ── FAB ──
 
});