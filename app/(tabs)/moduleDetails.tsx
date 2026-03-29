import { Text, View } from "@/components/Themed";
import { learningTasks } from "@/src/data/learningTasks";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// ─── Floating Orb — exact from home ──────────────────────────────────────────
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

// ─── Animated list item ───────────────────────────────────────────────────────
const ListItem = ({
  text,
  index,
  accentColor,
}: {
  text: string;
  index: number;
  accentColor: string;
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateAnim = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 350,
        delay: 300 + index * 80,
        useNativeDriver: true,
      }),
      Animated.timing(translateAnim, {
        toValue: 0,
        duration: 350,
        delay: 300 + index * 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.listItem,
        { opacity: fadeAnim, transform: [{ translateY: translateAnim }] },
      ]}
    >
      <View style={[styles.listDot, { backgroundColor: accentColor }]} />
      <Text style={styles.listText}>{text}</Text>
    </Animated.View>
  );
};

// ─── Topic tag ────────────────────────────────────────────────────────────────
const TopicTag = ({
  label,
  accentColor,
  index,
}: {
  label: string;
  accentColor: string;
  index: number;
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        delay: 250 + index * 60,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        delay: 250 + index * 60,
        tension: 60,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.topicTag,
        {
          borderColor: `${accentColor}33`,
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <Text style={[styles.topicText, { color: accentColor }]}>{label}</Text>
    </Animated.View>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function ModuleDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const moduleId = typeof params.id === "string" ? parseInt(params.id) : 1;
  const task = learningTasks.find((t) => t.id === moduleId) || learningTasks[0];

  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    setIsCompleted(task.progress === 100);
  }, [task.id, task.progress]);

  const headerAnim = useRef(new Animated.Value(0)).current;
  const headerY = useRef(new Animated.Value(-20)).current;
  const heroAnim = useRef(new Animated.Value(0)).current;
  const heroY = useRef(new Animated.Value(24)).current;
  const contentAnim = useRef(new Animated.Value(0)).current;
  const btnScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(headerY, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.parallel([
      Animated.timing(heroAnim, {
        toValue: 1,
        duration: 600,
        delay: 100,
        useNativeDriver: true,
      }),
      Animated.spring(heroY, {
        toValue: 0,
        delay: 100,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.timing(contentAnim, {
      toValue: 1,
      duration: 500,
      delay: 250,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleComplete = () => {
    Animated.sequence([
      Animated.spring(btnScale, {
        toValue: 0.95,
        useNativeDriver: true,
        tension: 100,
        friction: 5,
      }),
      Animated.spring(btnScale, {
        toValue: 1,
        useNativeDriver: true,
        tension: 80,
        friction: 6,
      }),
    ]).start(() => {
      setIsCompleted(true);
      const idx = learningTasks.findIndex((item) => item.id === task.id);
      if (idx >= 0) {
        learningTasks[idx].progress = 100;
      }
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Orbs */}
      <FloatingOrb
        color={task.accentColor}
        size={500}
        top={-160}
        left={-80}
        delay={0}
      />
      <FloatingOrb
        color={task.gradient[1]}
        size={220}
        top={400}
        left={SCREEN_WIDTH - 100}
        delay={400}
      />

      {/* ── Sticky header ── */}
      <Animated.View
        style={[
          styles.headerWrapper,
          {
            opacity: headerAnim,
            transform: [{ translateY: headerY }],
          },
        ]}
      >
        <BlurView intensity={10} tint="light" style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.headerBtn}
          >
            <BlurView intensity={80} tint="light" style={styles.headerBtnBlur}>
              <Ionicons name="chevron-back" size={22} color="#0F172A" />
            </BlurView>
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>{task.title}</Text>
            <Text style={styles.headerSub}>Week {task.week}</Text>
          </View>

          <TouchableOpacity style={styles.headerBtn}>
            <BlurView intensity={80} tint="light" style={styles.headerBtnBlur}>
              <Ionicons name="bookmark-outline" size={20} color="#0F172A" />
            </BlurView>
          </TouchableOpacity>
        </BlurView>
      </Animated.View>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Hero card — same gradient card as home ── */}
        <Animated.View
          style={[
            styles.heroCardWrap,
            { opacity: heroAnim, transform: [{ translateY: heroY }] },
          ]}
        >
          <LinearGradient
            colors={task.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroCard}
          >
            <View style={styles.noiseOverlay} />

            {/* Week label + title */}
            <View style={styles.heroTopRow}>
              <BlurView intensity={20} tint="light" style={styles.weekCircle}>
                <Text style={styles.weekCircleNum}>{task.week}</Text>
              </BlurView>

              <View style={{ flex: 1, backgroundColor: "transparent" }}>
                <Text style={styles.heroTitle}>{task.title}</Text>
                <Text style={styles.heroSub}>{task.subtitle}</Text>
              </View>

              {/* Due date badge */}
              <View style={styles.dateBadge}>
                <Text style={styles.dateText}>{task.dueDate}</Text>
              </View>
            </View>

            {/* Meta row */}
            <View style={styles.heroMeta}>
              <BlurView intensity={20} tint="dark" style={styles.metaChip}>
                <Ionicons
                  name="play-circle-outline"
                  size={13}
                  color="rgba(255,255,255,0.85)"
                />
                <Text style={styles.metaChipText}>{task.lessons} lessons</Text>
              </BlurView>
              <BlurView intensity={20} tint="dark" style={styles.metaChip}>
                <Ionicons
                  name="time-outline"
                  size={13}
                  color="rgba(255,255,255,0.85)"
                />
                <Text style={styles.metaChipText}>{task.duration}</Text>
              </BlurView>
              <BlurView intensity={20} tint="dark" style={styles.metaChip}>
                <View
                  style={[
                    styles.diffDot,
                    { backgroundColor: task.accentColor },
                  ]}
                />
                <Text style={styles.metaChipText}>{task.difficulty}</Text>
              </BlurView>
            </View>

            {/* Progress bar — same as home */}
            {task.progress > 0 && (
              <View style={styles.heroProgress}>
                <View style={styles.progressTrack}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${task.progress}%` as any,
                        backgroundColor: "rgba(255,255,255,0.85)",
                      },
                    ]}
                  />
                </View>
                <Text
                  style={[
                    styles.progressPct,
                    { color: "rgba(255,255,255,0.85)" },
                  ]}
                >
                  {task.progress}%
                </Text>
              </View>
            )}
          </LinearGradient>
        </Animated.View>

        {/* ── Topics Covered ── */}
        <Animated.View
          style={[
            styles.section,
            { opacity: contentAnim, backgroundColor: "transparent" },
          ]}
        >
          <View
            style={[styles.sectionHeader, { backgroundColor: "transparent" }]}
          >
            <Text style={styles.sectionTitle}>Topics Covered</Text>
            <Text style={styles.sectionCount}>
              {task.content.topics.length} topics
            </Text>
          </View>
          <View style={[styles.topicsWrap, { backgroundColor: "transparent" }]}>
            {task.content.topics.map((topic, idx) => (
              <TopicTag
                key={idx}
                label={topic}
                accentColor={task.accentColor}
                index={idx}
              />
            ))}
          </View>
        </Animated.View>

        {/* ── What You'll Learn ── */}
        <Animated.View style={[styles.section, { opacity: contentAnim }]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>What You'll Learn</Text>
          </View>
          <BlurView intensity={15} tint="light" style={styles.explanationBox}>
            <Text style={styles.explanationText}>
              {task.content.explanations}
            </Text>
          </BlurView>
        </Animated.View>

        {/* ── Real-World Examples ── */}
        <Animated.View style={[styles.section, { opacity: contentAnim }]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Real-World Examples</Text>
            <Text style={styles.sectionCount}>
              {task.content.examples.length} examples
            </Text>
          </View>
          {task.content.examples.map((ex, idx) => (
            <ListItem
              key={idx}
              text={ex}
              index={idx}
              accentColor={task.accentColor}
            />
          ))}
        </Animated.View>

        {/* ── Key Takeaways ── */}
        <Animated.View style={[styles.section, { opacity: contentAnim }]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Key Takeaways</Text>
          </View>
          {task.content.keyTakeaways.map((t, idx) => (
            <ListItem
              key={idx}
              text={t}
              index={idx}
              accentColor={task.accentColor}
            />
          ))}
        </Animated.View>

        {/* ── Practice Projects ── */}
        <Animated.View style={[styles.section, { opacity: contentAnim }]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Practice Projects</Text>
            <Text style={styles.sectionCount}>
              {task.content.practiceProjects.length} projects
            </Text>
          </View>
          {task.content.practiceProjects.map((p, idx) => (
            <ListItem
              key={idx}
              text={p}
              index={idx}
              accentColor={task.accentColor}
            />
          ))}
        </Animated.View>

        {/* ── Mark as Complete Button (not floating) ── */}
        {!isCompleted && (
          <Animated.View
            style={[
              styles.completeButtonContainer,
              { transform: [{ scale: btnScale }] },
            ]}
          >
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleComplete}
              style={styles.ctaTouchable}
            >
              <LinearGradient
                colors={["#10B981", "#059669"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.ctaGradient}
              >
                <Ionicons
                  name="checkmark-circle-outline"
                  size={22}
                  color="#fff"
                  style={{ marginRight: 10 }}
                />
                <Text style={styles.ctaText}>MARK AS COMPLETE</Text>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color="#fff"
                  style={{ marginLeft: 8 }}
                />
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        )}
      </ScrollView>

      {/* ── Take Assessment Button (floating) ── */}
      {isCompleted && (
        <Animated.View
          style={[styles.bottomBar, { transform: [{ scale: btnScale }] }]}
        >
          <TouchableOpacity activeOpacity={0.85} style={styles.ctaTouchable}>
            <BlurView intensity={20} tint="dark" style={styles.ctaGradient}>
              {/* <View style={styles.ctaInner}> */}
              <Ionicons
                name="clipboard-outline"
                size={22}
                color="#1b1a1a"
                style={{ marginRight: 10 }}
              />
              <Text style={styles.ctaText}>TAKE ASSESSMENT</Text>
              <Ionicons
                name="chevron-forward"
                size={20}
                color="#1b1a1a"
                style={{ marginLeft: 8 }}
              />
              {/* </View> */}
            </BlurView>
          </TouchableOpacity>

          <LinearGradient
            colors={["rgba(16,185,129,0.1)", "rgba(16,185,129,0.05)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.completedPillGradient}
          >
            <BlurView intensity={20} tint="light" style={styles.completedPill}>
              <Ionicons name="checkmark-done" size={15} color="#10B981" />
              <Text style={styles.completedText}>MODULE COMPLETED</Text>
            </BlurView>
          </LinearGradient>
        </Animated.View>
      )}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const CIRCLE_SIZE = 52;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F0F4FF" },

  // ── Header — same as home/modules ──

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
  headerBtn: { borderRadius: 25, overflow: "hidden" },
  headerBtnBlur: {
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
  headerTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "#0F172A",
    letterSpacing: -0.5,
  },
  headerSub: {
    fontSize: 12,
    fontWeight: "300",
    color: "#94A3B8",
    marginTop: 2,
  },

  // ── Scroll ──
  scroll: { flex: 1, paddingTop: 140 },
  scrollContent: { paddingHorizontal: 15 },

  // ── Hero card — same radii + noiseOverlay as home cards ──
  heroCardWrap: {
    marginBottom: 28,
    borderRadius: 38,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 6,
  },
  heroCard: {
    borderRadius: 38,
    padding: 20,
    paddingBottom: 18,
  },
  noiseOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 38,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },

  heroTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
    marginBottom: 16,
    backgroundColor: "transparent",
  },
  weekCircle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.5)",
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  weekCircleNum: {
    fontSize: 18,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: -0.5,
  },

  heroTitle: {
    fontSize: 22,
    fontWeight: "300",
    color: "#fff",
    letterSpacing: -0.8,
    marginBottom: 4,
  },
  heroSub: { fontSize: 13, color: "rgba(255,255,255,0.75)", lineHeight: 18 },

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

  // Meta chips — same as card diffBadge
  heroMeta: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
    backgroundColor: "transparent",
  },
  metaChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    overflow: "hidden",
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  metaChipText: {
    fontSize: 10,
    fontWeight: "300",
    color: "rgba(255,255,255,0.9)",
    letterSpacing: 0.5,
  },
  diffDot: { width: 6, height: 6, borderRadius: 3 },

  // Progress — same as home cards
  heroProgress: {
    gap: 6,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.15)",
    paddingTop: 14,
    backgroundColor: "transparent",
  },
  progressTrack: {
    height: 5,
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: { height: "100%", borderRadius: 4 },
  progressPct: { fontSize: 10, fontWeight: "800" },

  // ── Sections ──
  section: { marginBottom: 28 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
    backgroundColor: "transparent",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "300",
    color: "#0F172A",
    letterSpacing: -0.5,
  },
  sectionCount: { fontSize: 12, fontWeight: "300", color: "#94A3B8" },

  // Topics
  topicsWrap: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  topicTag: {
    backgroundColor: "rgba(14,165,233,0.08)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 28,
    borderWidth: 1,
  },
  topicText: { fontSize: 12, fontWeight: "400", letterSpacing: -0.2 },

  // Explanation box
  explanationBox: {
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.6)",
    overflow: "hidden",
  },
  explanationText: {
    fontSize: 14,
    fontWeight: "300",
    color: "#475569",
    lineHeight: 22,
  },

  // List items
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
    backgroundColor: "transparent",
  },
  listDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    marginTop: 7,
    marginRight: 12,
    flexShrink: 0,
  },
  listText: {
    flex: 1,
    fontSize: 13,
    fontWeight: "300",
    color: "#334155",
    lineHeight: 20,
  },

  // ── Bottom CTA — same pattern as UnlockButton ──
  bottomBar: {
    position: "absolute",
    bottom: 10,
    left: 15,
    right: 15,
    gap: 10,
  },
  completeButtonContainer: {
    marginTop: 0,
    marginBottom: 20,
  },
  ctaTouchable: {
    borderRadius: 28,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
  ctaGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 28,
  },
  ctaText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1b1a1a",
    letterSpacing: -0.3,
  },

  completedPill: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(16,185,129,0.2)",
    overflow: "hidden",
  },
  completedPillGradient: {
    borderRadius: 20,
    overflow: "hidden",
  },
  completedText: { fontSize: 13, fontWeight: "400", color: "#10B981" },
});
