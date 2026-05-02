import { Text } from "@/components/Themed";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useCallback, useRef } from "react";
import {
    Animated,
    Dimensions,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import { pacingLabelFromDue } from "@/src/utils/duePacing";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface LearningTask {
  id: string;
  week: string;
  title: string;
  subtitle: string;
  dueDate?: string;
  difficulty: string;
  progress: number;
  gradient: [string, string];
  accentColor: string;
  lessons: number;
  duration: string;
}

interface TaskCardProps {
  task: LearningTask;
  index: number;
  showMeta?: boolean;
  onPress?: () => void;
  cardStyle?: "index" | "modules";
  showConnector?: boolean;
}

// ─── Dotted Connector ──────────────────────────────────────────────────────────
const DottedConnector = ({
  isRight,
  gradient,
}: {
  isRight: boolean;
  gradient: [string, string];
}) => {
  return (
    <View style={[styles.connector, isRight && styles.connectorRight]}>
      {Array.from({ length: 10 }).map((_, i) => (
        <View
          key={i}
          style={[styles.connectorDot, { backgroundColor: gradient[0] + "40" }]}
        />
      ))}
    </View>
  );
};
export const ProgressBar = ({
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
export const TaskCard = ({
  task,
  index,
  showMeta = false,
  onPress,
  cardStyle = "modules",
  showConnector = false,
}: TaskCardProps) => {
  const translateX = useRef(
    new Animated.Value(index % 2 === 0 ? -SCREEN_WIDTH : SCREEN_WIDTH),
  ).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const pressScale = useRef(new Animated.Value(1)).current;

  const isRight = index % 2 !== 0;
  const isLocked = task.progress === 0;
  const isComplete = task.progress === 100;

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
      {!isRight && <WeekCircle />}

      <TouchableOpacity
        activeOpacity={1}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={onPress}
        style={[
          styles.cardTouchable,
          cardStyle === "index" && styles.cardTouchableIndex,
        ]}
      >
        <LinearGradient
          colors={task.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.cardGradient,
            cardStyle === "index" && styles.cardGradientIndex,
          ]}
        >
          <View
            style={[
              styles.noiseOverlay,
              cardStyle === "index" && styles.noiseOverlayIndex,
            ]}
          />

          {/* Top row */}
          <View style={styles.cardTopRow}>
            <View style={styles.cardTitleBlock}>
              <Text style={styles.cardTitle}>{task.title}</Text>
              <Text style={styles.cardSubtitle}>{task.subtitle}</Text>
              {showMeta && (
                <View style={styles.cardMeta}>
                  <Ionicons
                    name="play-circle-outline"
                    size={11}
                    color="rgba(255,255,255,0.65)"
                  />
                  <Text style={styles.cardMetaText}>
                    {task.lessons} lessons
                  </Text>
                  <Text style={styles.cardMetaDot}>·</Text>
                  <Ionicons
                    name="time-outline"
                    size={11}
                    color="rgba(255,255,255,0.65)"
                  />
                  <Text style={styles.cardMetaText}>{task.duration}</Text>
                </View>
              )}
            </View>

            <View style={styles.cardRight}>
              <View style={styles.dateBadge}>
                <Text style={styles.dateText}>{pacingLabelFromDue(task.dueDate)}</Text>
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

          {/* Bottom row */}
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

      {isRight && <WeekCircle />}

      {showConnector && (
        <DottedConnector isRight={isRight} gradient={task.gradient} />
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardRowWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    width: "100%",
    gap: 10,
  },
  cardTouchable: {
    flex: 1,
    borderRadius: 38,
    overflow: "hidden",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  cardTouchableIndex: {
    borderRadius: 38,
  },
  cardGradient: {
    borderRadius: 38,
    padding: 20,
    paddingBottom: 18,
  },
  cardGradientIndex: {
    borderRadius: 38,
    padding: 18,
    paddingBottom: 14,
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
  noiseOverlayIndex: {
    borderRadius: 38,
  },
  cardTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
    marginBottom: 16,
    backgroundColor: "transparent",
  },
  cardTitleBlock: {
    flex: 1,
    backgroundColor: "transparent",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "300",
    color: "#fff",
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12,
    color: "rgba(255,255,255,0.75)",
    lineHeight: 18,
    fontWeight: 300,
  },
  cardMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    backgroundColor: "transparent",
  },
  cardMetaText: {
    fontSize: 11,
    color: "rgba(255,255,255,0.65)",
    marginLeft: 4,
  },
  cardMetaDot: {
    fontSize: 11,
    color: "rgba(255,255,255,0.65)",
    marginHorizontal: 6,
  },
  cardRight: {
    alignItems: "flex-end",
    backgroundColor: "transparent",
  },
  dateBadge: {
    backgroundColor: "rgba(255,255,255,0.25)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    marginBottom: 8,
  },
  dateText: {
    fontSize: 11,
    fontWeight: "300",
    color: "#fff",
    letterSpacing: 0.5,
  },
  lockIcon: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  cardBottomRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "transparent",
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
    letterSpacing: 0.5,
  },
  progressSection: {
    flex: 1,
    gap: 6,
    backgroundColor: "transparent",
  },
  progressBarTrack: {
    height: 4,
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressBarFill: { height: "100%", borderRadius: 2 },
  progressPct: { fontSize: 10, fontWeight: "800" },
  arrowBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  weekWrapper: {
    alignItems: "center",
  },
  weekLabel: {
    fontSize: 14,
    fontWeight: "300",
    color: "#64748be3",
    letterSpacing: 1,
    marginBottom: 8,
  },
  weekCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(48, 45, 45, 0.2)",
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  weekCircleNum: {
    fontSize: 18,
    fontWeight: "900",
    color: "#0303038c",
    letterSpacing: -0.5,
  },
  connector: {
    position: "absolute",
    left: 24,
    top: "75%",
    alignItems: "center",
    zIndex: -1,
  },
  connectorRight: {
    left: undefined,
    right: 24,
  },
  connectorDot: {
    width: 5,
    height: 4,
    marginVertical: 1,
    borderRadius: 1,
  },
});