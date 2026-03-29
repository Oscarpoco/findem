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
    TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { useRef, useEffect, useState } from "react";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CIRCLE_SIZE = 52;

const learningTasks = [
    {
        id: 1,
        week: "01",
        title: "HTML & CSS",
        subtitle: "Responsive design fundamentals",
        dueDate: "APR 5",
        difficulty: "BEGINNER",
        progress: 100,
        gradient: ["#0EA5E9", "#0284C7"] as [string, string],
        accentColor: "#38BDF8",
        lessons: 12,
        duration: "8h 30m",
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
        lessons: 15,
        duration: "10h 00m",
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
        lessons: 10,
        duration: "7h 45m",
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
        lessons: 20,
        duration: "14h 00m",
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
        lessons: 18,
        duration: "12h 15m",
    },
    {
        id: 6,
        week: "06",
        title: "TypeScript",
        subtitle: "Static typing & advanced types",
        dueDate: "MAY 10",
        difficulty: "INTERMEDIATE",
        progress: 0,
        gradient: ["#0891B2", "#0E7490"] as [string, string],
        accentColor: "#22D3EE",
        lessons: 13,
        duration: "9h 00m",
    },
    {
        id: 7,
        week: "07",
        title: "Databases",
        subtitle: "SQL, NoSQL & data modelling",
        dueDate: "MAY 17",
        difficulty: "ADVANCED",
        progress: 0,
        gradient: ["#EA580C", "#C2410C"] as [string, string],
        accentColor: "#FB923C",
        lessons: 16,
        duration: "11h 30m",
    },
    {
        id: 8,
        week: "08",
        title: "DevOps & CI/CD",
        subtitle: "Docker, pipelines & deployment",
        dueDate: "MAY 24",
        difficulty: "ADVANCED",
        progress: 0,
        gradient: ["#4F46E5", "#4338CA"] as [string, string],
        accentColor: "#818CF8",
        lessons: 17,
        duration: "13h 00m",
    },
];

const FILTERS = ["ALL", "BEGINNER", "INTERMEDIATE", "ADVANCED"];

// ─── Progress Bar — exact match from home ─────────────────────────────────────
const ProgressBar = ({ progress, accentColor }: { progress: number; accentColor: string }) => {
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
                        width: widthAnim.interpolate({ inputRange: [0, 100], outputRange: ["0%", "100%"] }),
                    },
                ]}
            />
        </View>
    );
};

// ─── Task Card — mirrors home screen exactly ──────────────────────────────────
const TaskCard = ({ task, index }: any) => {
    const translateX = useRef(new Animated.Value(index % 2 === 0 ? -SCREEN_WIDTH : SCREEN_WIDTH)).current;
    const opacity = useRef(new Animated.Value(0)).current;
    const pressScale = useRef(new Animated.Value(1)).current;

    const isRight = index % 2 !== 0;
    const isLocked = task.progress === 0;
    const isComplete = task.progress === 100;

    useEffect(() => {
        Animated.parallel([
            Animated.spring(translateX, {
                toValue: 0,
                delay: index * 100,
                tension: 55,
                friction: 9,
                useNativeDriver: true,
            }),
            Animated.timing(opacity, {
                toValue: 1,
                duration: 400,
                delay: index * 100,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const onPressIn = () =>
        Animated.spring(pressScale, { toValue: 0.97, useNativeDriver: true, tension: 100, friction: 5 }).start();
    const onPressOut = () =>
        Animated.spring(pressScale, { toValue: 1, useNativeDriver: true, tension: 80, friction: 6 }).start();

    const WeekCircle = () => (
        <Animated.View style={styles.weekWrapper}>
            <Text style={styles.weekLabel}>WEEK</Text>
            <BlurView intensity={20} tint="light" style={styles.weekCircle}>
                <Text style={styles.weekCircleNum}>{isComplete ? <Ionicons name="checkmark-done" size={32} color="#10B981" /> : task.week}</Text>
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
            {!isRight && <WeekCircle />}

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
                    <View style={styles.noiseOverlay} />


                    {/* Top row */}
                    <View style={styles.cardTopRow}>
                        <View style={styles.cardTitleBlock}>
                            <Text style={styles.cardTitle}>{task.title}</Text>
                            <Text style={styles.cardSubtitle}>{task.subtitle}</Text>
                            {/* Lesson + duration meta */}
                            <View style={styles.cardMeta}>
                                <Ionicons name="play-circle-outline" size={11} color="rgba(255,255,255,0.65)" />
                                <Text style={styles.cardMetaText}>{task.lessons} lessons</Text>
                                <Text style={styles.cardMetaDot}>·</Text>
                                <Ionicons name="time-outline" size={11} color="rgba(255,255,255,0.65)" />
                                <Text style={styles.cardMetaText}>{task.duration}</Text>
                            </View>
                        </View>

                        <View style={styles.cardRight}>
                            <View style={styles.dateBadge}>
                                <Text style={styles.dateText}>{task.dueDate}</Text>
                            </View>
                            {isLocked && (
                                <View style={styles.lockIcon}>
                                    <Ionicons name="lock-closed" size={13} color="rgba(255,255,255,0.7)" />
                                </View>
                            )}
                        </View>
                    </View>

                    {/* Bottom row */}
                    <View style={styles.cardBottomRow}>
                        <BlurView intensity={20} tint="dark" style={styles.diffBadge}>
                            <View style={[styles.diffDot, { backgroundColor: task.accentColor }]} />
                            <Text style={styles.diffText}>{task.difficulty}</Text>
                        </BlurView>

                        <View style={styles.progressSection}>
                            <ProgressBar progress={task.progress} accentColor={task.accentColor} />
                            {task.progress > 0 && (
                                <Text style={[styles.progressPct, { color: task.accentColor }]}>{task.progress}%</Text>
                            )}
                        </View>

                        <BlurView intensity={25} tint="light" style={styles.arrowBtn}>
                            <Ionicons name="chevron-forward" size={18} color="#fff" />
                        </BlurView>
                    </View>
                </LinearGradient>
            </TouchableOpacity>

            {isRight && <WeekCircle />}
        </Animated.View>
    );
};

// ─── Floating Orb — exact from home ──────────────────────────────────────────
const FloatingOrb = ({
    color, size, top, left, delay,
}: { color: string; size: number; top: number; left: number; delay: number }) => {
    const floatAnim = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, { toValue: 1, duration: 800, delay, useNativeDriver: true }).start();
        const loop = Animated.loop(
            Animated.sequence([
                Animated.timing(floatAnim, { toValue: 1, duration: 3000 + delay * 0.5, useNativeDriver: true }),
                Animated.timing(floatAnim, { toValue: 0, duration: 3000 + delay * 0.5, useNativeDriver: true }),
            ])
        );
        loop.start();
        return () => loop.stop();
    }, []);

    return (
        <Animated.View
            style={{
                position: "absolute",
                top, left,
                width: size, height: size,
                borderRadius: size / 2,
                backgroundColor: color,
                opacity: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 0.12] }),
                transform: [{ translateY: floatAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -20] }) }],
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
            Animated.timing(headerOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
            Animated.spring(headerTranslateY, { toValue: 0, tension: 50, friction: 8, useNativeDriver: true }),
        ]).start();

        Animated.parallel([
            Animated.timing(contentOpacity, { toValue: 1, duration: 600, delay: 150, useNativeDriver: true }),
            Animated.spring(contentTranslateY, { toValue: 0, delay: 150, tension: 50, friction: 8, useNativeDriver: true }),
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
    const inProgress = learningTasks.filter((t) => t.progress > 0 && t.progress < 100).length;

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />

            <FloatingOrb color="#0EA5E9" size={600} top={-180} left={-100} delay={0} />

            {/* ── Top bar: back + title ── */}
            <Animated.View
                style={[
                    styles.topBarWrapper,
                    {
                        opacity: headerOpacity,
                        transform: [{ translateY: headerTranslateY }]
                    }
                ]}
            >
                <BlurView
                    intensity={20}
                    tint="light"
                    style={styles.topBar}
                >
                    <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                        <BlurView
                            intensity={80}
                            tint="light"
                            style={styles.backBlur}
                        >
                            <Ionicons name="chevron-back" size={22} color="#0F172A" />
                        </BlurView>
                    </TouchableOpacity>

                    <View style={styles.topCenter}>
                        <Text style={styles.topTitle}>Learning Path</Text>
                        <Text style={styles.topSub}>{learningTasks.length} modules · 10 weeks</Text>
                    </View>

                    <TouchableOpacity style={styles.notifBtn}>
                        <BlurView intensity={80} tint="light" style={styles.notifBlur}>
                            <View style={styles.notifDot} />
                            <Ionicons name="notifications-outline" size={24} color="#0F172A" />
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
                    style={[styles.searchSection, { opacity: contentOpacity, transform: [{ translateY: contentTranslateY }] }]}
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
                                    <BlurView intensity={20} tint="light" style={styles.filterChip}>
                                        <Text style={styles.filterChipText}>{f}</Text>
                                    </BlurView>
                                )}
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </Animated.View>

                {/* ── Stat pills — same component style as home ── */}
                <Animated.View
                    style={[styles.statsRow, { opacity: contentOpacity, transform: [{ translateY: contentTranslateY }] }]}
                >
                    {[
                        { value: `${learningTasks.length}`, label: "TOTAL" },
                        { value: `${completed}`, label: "DONE" },
                        { value: `${inProgress}`, label: "ACTIVE" },
                        { value: `${learningTasks.length - completed - inProgress}`, label: "LOCKED" },
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
                        <TouchableOpacity onPress={() => { setActiveFilter("ALL"); setSearch(""); }}>
                            <Text style={styles.clearText}>CLEAR</Text>
                        </TouchableOpacity>
                    )}
                </Animated.View>

                {/* ── Cards — exact home design ── */}
                {filtered.length === 0 ? (
                    <View style={styles.emptyWrap}>
                        <Text style={styles.emptyTitle}>No modules found</Text>
                        <Text style={styles.emptySub}>Try a different search or filter</Text>
                    </View>
                ) : (
                    filtered.map((task, index) => (
                        <TaskCard key={task.id} task={task} index={index} />
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
        position: 'absolute',
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
        width: '100%'
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

    heroHeading: { fontSize: 38, fontWeight: "300", color: "#0F172A", lineHeight: 42, letterSpacing: -2, marginBottom: 14 },

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
    filterChipText: { fontSize: 12, fontWeight: "300", color: "#64748B", letterSpacing: 0.5 },
    filterChipTextActive: { fontSize: 12, fontWeight: "500", color: "#fff", letterSpacing: 0.5 },

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
        backgroundColor: 'transparent'
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
    statValue: { fontSize: 22, fontWeight: "500", color: "#0F172A", letterSpacing: -1, marginBottom: 2 },
    statLabel: { fontSize: 8, fontWeight: "400", color: "#64748B", letterSpacing: 1.5 },

    // ── Results row ──
    resultsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    resultsText: { fontSize: 13, fontWeight: "300", color: "#94A3B8" },
    clearText: { fontSize: 14, fontWeight: "400", color: "#0EA5E9" },

    // ── Cards — exact home layout ──
    cardRowWrapper: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    weekWrapper: { justifyContent: "center", alignItems: "center", gap: 10 },
    weekLabel: { fontSize: 15, fontWeight: "500", color: "rgba(7,7,7,0.6)", letterSpacing: 0.5 },
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
    weekCircleNum: { fontSize: 18, fontWeight: "900", color: "#0F172A", letterSpacing: -0.5 },

    cardTouchable: { flex: 1, borderRadius: 38, overflow: "hidden" },
    cardGradient: { borderRadius: 38, padding: 18, paddingBottom: 14 },
    noiseOverlay: {
        position: "absolute",
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: "rgba(255,255,255,0.08)",
        borderRadius: 38,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.2)",
    },

    completeBadge: {
        alignSelf: "flex-start",
        backgroundColor: "rgba(255,255,255,0.25)",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.35)",
    },
    completeBadgeText: { fontSize: 9, fontWeight: "500", color: "#fff", letterSpacing: 1.2 },

    cardTopRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 14,
        backgroundColor: "transparent",
    },
    cardTitleBlock: { flex: 1, backgroundColor: "transparent" },
    cardTitle: { fontSize: 20, fontWeight: "300", color: "#fff", letterSpacing: -0.8, marginBottom: 4 },
    cardSubtitle: { fontSize: 12, color: "rgba(255,255,255,0.75)", lineHeight: 17, marginBottom: 8 },
    cardMeta: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        backgroundColor: "transparent",
    },
    cardMetaText: { fontSize: 11, fontWeight: "300", color: "rgba(255,255,255,0.65)" },
    cardMetaDot: { fontSize: 11, color: "rgba(255,255,255,0.4)" },

    cardRight: { alignItems: "flex-end", gap: 10, backgroundColor: "transparent" },
    dateBadge: {
        backgroundColor: "rgba(255,255,255,0.25)",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.3)",
    },
    dateText: { fontSize: 11, fontWeight: "300", color: "#fff", letterSpacing: 0.5 },
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
    diffText: { fontSize: 10, fontWeight: "300", color: "rgba(255,255,255,0.9)", letterSpacing: 0.8 },

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

    // Empty
    emptyWrap: { alignItems: "center", paddingTop: 80, gap: 8 },
    emptyTitle: { fontSize: 18, fontWeight: "300", color: "#94A3B8", letterSpacing: -0.5 },
    emptySub: { fontSize: 13, fontWeight: "200", color: "#CBD5E1" },
});