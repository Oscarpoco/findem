import { Text, View } from "@/components/Themed";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    ScrollView,
    StatusBar,
    StyleSheet,
    TextInput,
    TouchableOpacity,
} from "react-native";

import { TaskCard } from "@/components/TaskCard";
import { learningTasks } from "@/src/data/learningTasks";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CIRCLE_SIZE = 52;

const FILTERS = ["ALL", "BEGINNER", "INTERMEDIATE", "ADVANCED"];

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

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function ModulesScreen() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL");

  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerTranslateY = useRef(new Animated.Value(-20)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const contentTranslateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerOpacity, {
        toValue: 1,
        duration: 500,
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
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 600,
        delay: 150,
        useNativeDriver: true,
      }),
      Animated.spring(contentTranslateY, {
        toValue: 0,
        delay: 150,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const filtered = learningTasks.filter((t) => {
    const matchSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.subtitle.toLowerCase().includes(search.toLowerCase());
    const matchFilter = activeFilter === "ALL" || t.difficulty === activeFilter;
    return matchSearch && matchFilter;
  });

  const completed = learningTasks.filter((t) => t.progress === 100).length;
  const inProgress = learningTasks.filter(
    (t) => t.progress > 0 && t.progress < 100,
  ).length;

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

      {/* ── Top bar: back + title ── */}
      <Animated.View
        style={[
          styles.topBarWrapper,
          {
            opacity: headerOpacity,
            transform: [{ translateY: headerTranslateY }],
          },
        ]}
      >
        <BlurView intensity={20} tint="light" style={styles.topBar}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
          >
            <BlurView intensity={80} tint="light" style={styles.backBlur}>
              <Ionicons name="chevron-back" size={22} color="#0F172A" />
            </BlurView>
          </TouchableOpacity>

          <View style={styles.topCenter}>
            <Text style={styles.topTitle}>Learning Path</Text>
            <Text style={styles.topSub}>
              {learningTasks.length} modules · 10 weeks
            </Text>
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

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Search + filter row ── */}
        <Animated.View
          style={[
            styles.searchSection,
            {
              opacity: contentOpacity,
              transform: [{ translateY: contentTranslateY }],
            },
          ]}
        >
          <Animated.Text style={styles.heroHeading}>
            Software{"\n"}Development
          </Animated.Text>
          {/* Search bar */}
          <BlurView intensity={20} tint="light" style={styles.searchBar}>
            <Ionicons name="search-outline" size={18} color="#94A3B8" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search modules..."
              placeholderTextColor="#94A3B8"
              value={search}
              onChangeText={setSearch}
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch("")}>
                <Ionicons name="close-circle" size={17} color="#94A3B8" />
              </TouchableOpacity>
            )}
          </BlurView>

          {/* Filter chips — same pill style as stat pills */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterRow}
          >
            {FILTERS.map((f) => (
              <TouchableOpacity
                key={f}
                onPress={() => setActiveFilter(f)}
                style={styles.filterChipWrap}
              >
                {activeFilter === f ? (
                  <LinearGradient
                    colors={["#0EA5E9", "#0284C7"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.filterChipActive}
                  >
                    <Text style={styles.filterChipTextActive}>{f}</Text>
                  </LinearGradient>
                ) : (
                  <BlurView
                    intensity={20}
                    tint="light"
                    style={styles.filterChip}
                  >
                    <Text style={styles.filterChipText}>{f}</Text>
                  </BlurView>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* ── Stat pills — same component style as home ── */}
        <Animated.View
          style={[
            styles.statsRow,
            {
              opacity: contentOpacity,
              transform: [{ translateY: contentTranslateY }],
            },
          ]}
        >
          {[
            { value: `${learningTasks.length}`, label: "TOTAL" },
            { value: `${completed}`, label: "DONE" },
            { value: `${inProgress}`, label: "ACTIVE" },
            {
              value: `${learningTasks.length - completed - inProgress}`,
              label: "LOCKED",
            },
          ].map((s, i) => (
            <View key={i} style={styles.statPill}>
              <BlurView intensity={10} tint="light" style={styles.statPillBlur}>
                <Text style={styles.statValue}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </BlurView>
            </View>
          ))}
        </Animated.View>

        {/* ── Results count ── */}
        <Animated.View style={[{ opacity: contentOpacity }, styles.resultsRow]}>
          <Text style={styles.resultsText}>
            {filtered.length} Module{filtered.length !== 1 ? "s" : ""}
            {activeFilter !== "ALL" ? ` · ${activeFilter}` : ""}
            {search ? ` · "${search}"` : ""}
          </Text>
          {(activeFilter !== "ALL" || search) && (
            <TouchableOpacity
              onPress={() => {
                setActiveFilter("ALL");
                setSearch("");
              }}
            >
              <Text style={styles.clearText}>CLEAR</Text>
            </TouchableOpacity>
          )}
        </Animated.View>

        {/* ── Cards — exact home design ── */}
        {filtered.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyTitle}>No modules found</Text>
            <Text style={styles.emptySub}>
              Try a different search or filter
            </Text>
          </View>
        ) : (
          filtered.map((task, index) => (
            <TaskCard
              key={task.id}
              task={task}
              index={index}
              showMeta={true}
              cardStyle="modules"
              showConnector={index < filtered.length - 1}
              onPress={() => router.push(`/(tabs)/moduleDetails?id=${task.id}`)}
            />
          ))
        )}

        {/* <View style={{ height: 60 }} /> */}
      </ScrollView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F0F4FF" },

  // ── Top bar ──
  topBarWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingTop: 64,
    paddingBottom: 16,
    zIndex: 10,
    width: "100%",
  },
  backBtn: { borderRadius: 38, overflow: "hidden" },
  backBlur: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.6)",
    overflow: "hidden",
  },
  topCenter: { alignItems: "center", backgroundColor: "transparent" },
  topTitle: {
    fontSize: 22,
    fontWeight: "300",
    color: "#0F172A",
    letterSpacing: -0.8,
  },
  topSub: { fontSize: 12, color: "#94A3B8", fontWeight: "200", marginTop: 1 },
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

  // ── Scroll ──
  scroll: { flex: 1, paddingTop: 140 },
  scrollContent: { paddingHorizontal: 15 },

  heroHeading: {
    fontSize: 38,
    fontWeight: "300",
    color: "#0F172A",
    lineHeight: 42,
    letterSpacing: -2,
    marginBottom: 14,
  },

  // ── Search section ──
  searchSection: { marginBottom: 20 },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 28,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "rgba(25, 100, 170, 0.12)",
    overflow: "hidden",
    marginBottom: 14,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: "300",
    color: "#0F172A",
  },

  // Filter chips
  filterRow: { gap: 8, paddingVertical: 2 },
  filterChipWrap: { borderRadius: 28, overflow: "hidden" },
  filterChipActive: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 28,
  },
  filterChip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "rgba(25, 100, 170, 0.12)",
    overflow: "hidden",
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: "300",
    color: "#64748B",
    letterSpacing: 0.5,
  },
  filterChipTextActive: {
    fontSize: 12,
    fontWeight: "500",
    color: "#fff",
    letterSpacing: 0.5,
  },

  // ── Stat pills — identical to home ──
  statsRow: { flexDirection: "row", gap: 10, marginBottom: 20 },
  statPill: {
    flex: 1,
    borderRadius: 28,
    overflow: "hidden",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
    backgroundColor: "transparent",
  },
  statPillBlur: {
    paddingVertical: 16,
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: "rgba(25, 100, 170, 0.12)",
    borderRadius: 28,
    alignItems: "center",
    overflow: "hidden",
  },
  statValue: {
    fontSize: 22,
    fontWeight: "500",
    color: "#0F172A",
    letterSpacing: -1,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 8,
    fontWeight: "400",
    color: "#64748B",
    letterSpacing: 1.5,
  },

  // ── Results row ──
  resultsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  resultsText: { fontSize: 13, fontWeight: "300", color: "#94A3B8" },
  clearText: { fontSize: 14, fontWeight: "400", color: "#0EA5E9" },

  // Empty
  emptyWrap: { alignItems: "center", paddingTop: 80, gap: 8 },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "300",
    color: "#94A3B8",
    letterSpacing: -0.5,
  },
  emptySub: { fontSize: 13, fontWeight: "200", color: "#CBD5E1" },
});
