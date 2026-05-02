import { BlurView } from "expo-blur";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

const DEFAULT_ACCENT = "#0EA5E9";

type Props = {
  message?: string;
  /** Horizontal row for subtitles; frosted card for empty states; centered overlay for full screen. */
  variant?: "inline" | "card" | "fullscreen";
  indicatorColor?: string;
  style?: StyleProp<ViewStyle>;
};

/**
 * Branded loading UI: blur + accent spinner, consistent with home / modules.
 */
export function FindemLoader({
  message = "",
  variant = "card",
  indicatorColor = DEFAULT_ACCENT,
  style,
}: Props) {
  if (variant === "inline") {
    return (
      <View style={[styles.inline, style]}>
        <ActivityIndicator size="small" color={indicatorColor} />
        {message ? <Text style={styles.inlineMessage}>{message}</Text> : null}
      </View>
    );
  }

  if (variant === "fullscreen") {
    return (
      <View style={[styles.fullscreenOuter, style]}>
        <BlurView intensity={28} tint="light" style={styles.cardBlur}>
          <ActivityIndicator size="large" color={indicatorColor} />
          {message ? (
            <Text style={styles.cardMessage}>{message}</Text>
          ) : null}
        </BlurView>
      </View>
    );
  }

  return (
    <View style={[styles.cardWrap, style]}>
      <BlurView intensity={28} tint="light" style={styles.cardBlur}>
        <ActivityIndicator size="large" color={indicatorColor} />
        {message ? <Text style={styles.cardMessage}>{message}</Text> : null}
      </BlurView>
    </View>
  );
}

/** Small spinner for primary-colored submit buttons (white on brand). */
export function FindemButtonSpinner({ color = "#FFFFFF" }: { color?: string }) {
  return <ActivityIndicator size="small" color={color} />;
}

const styles = StyleSheet.create({
  inline: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "transparent",
  },
  inlineMessage: {
    fontSize: 14,
    fontWeight: "400",
    flexShrink: 1,
    color: "#64748B",
  },
  cardWrap: {
    alignSelf: "stretch",
    alignItems: "center",
    paddingVertical: 8,
    backgroundColor: "transparent",
  },
  cardBlur: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 28,
    paddingHorizontal: 32,
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(14, 165, 233, 0.18)",
    minWidth: 200,
    gap: 14,
  },
  cardMessage: {
    fontSize: 15,
    fontWeight: "400",
    color: "#475569",
    textAlign: "center",
    lineHeight: 21,
  },
  fullscreenOuter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "transparent",
  },
});
