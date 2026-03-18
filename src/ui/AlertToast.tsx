import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "@/components/Themed";
import {
  useAlertStore,
  type Alert,
  type AlertType,
} from "@/src/state/alertStore";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export function AlertToast() {
  const alerts = useAlertStore((s) => s.alerts);
  const remove = useAlertStore((s) => s.remove);
  const insets = useSafeAreaInsets();

  if (alerts.length === 0) return null;

  return (
    <View
      style={[styles.container, { top: insets.top + 10 }]}
      pointerEvents="box-none"
    >
      {alerts.map((alert) => (
        <AlertItem key={alert.id} alert={alert} onRemove={remove} />
      ))}
    </View>
  );
}

function getConfig(type: AlertType, isDark: boolean, colors: any) {
  const surface = isDark ? "rgba(10,10,10,0.90)" : "rgba(255,255,255,0.90)";
  switch (type) {
    case "success":
      return {
        bg: surface,
        tint: isDark ? "#10b9812a" : "#10b98120",
        border: colors.success,
        icon: "checkmark-circle",
        iconColor: colors.success,
      };
    case "error":
      return {
        bg: surface,
        tint: isDark ? "#ef44442a" : "#ef444420",
        border: colors.error,
        icon: "warning",
        iconColor: colors.error,
      };
    case "warning":
      return {
        bg: surface,
        tint: isDark ? "#f59e0b2a" : "#f59e0b20",
        border: colors.warning,
        icon: "warning",
        iconColor: colors.warning,
      };
    case "info":
    default:
      return {
        bg: surface,
        tint: isDark ? "#3b82f62a" : "#3b82f620",
        border: colors.info,
        icon: "information-circle",
        iconColor: colors.info,
      };
  }
}

function AlertItem({
  alert,
  onRemove,
}: {
  alert: Alert;
  onRemove: (id: string) => void;
}) {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  const colors = Colors[scheme ?? "light"];

  const slideAnim = useRef(new Animated.Value(-SCREEN_WIDTH)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const config = getConfig(alert.type, isDark, colors);
  const textColor = isDark ? "#ffffff" : "#000000";

  const dismiss = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -SCREEN_WIDTH,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start(() => onRemove(alert.id));
  };

  useEffect(() => {
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 8,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start();

    const duration = alert.durationMs ?? 3500;
    const timer = setTimeout(dismiss, duration);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View
      style={[
        styles.alertContainer,
        {
          backgroundColor: config.bg,
          borderColor: config.border,
          transform: [{ translateX: slideAnim }],
          opacity: fadeAnim,
        },
      ]}
    >
      <View style={styles.alertContent}>
        <View style={[styles.iconContainer, { backgroundColor: config.tint }]}>
          <Ionicons name={config.icon as any} size={20} color={config.iconColor} />
        </View>

        <View style={styles.messageContainer}>
          <Text style={[styles.message, { color: textColor }]} numberOfLines={3}>
            {alert.message}
          </Text>
        </View>

        <TouchableOpacity
          onPress={dismiss}
          style={styles.closeButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons
            name="add"
            size={18}
            color={textColor}
            style={{ opacity: 0.55, transform: [{ rotate: "45deg" }] }}
          />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 10000,
    alignItems: "center",
    paddingHorizontal: 10,
  } as ViewStyle,
  alertContainer: {
    width: SCREEN_WIDTH - 20,
    borderRadius: 20,
    borderWidth: 1.5,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
    overflow: "hidden",
  } as ViewStyle,
  alertContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
  } as ViewStyle,
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  } as ViewStyle,
  messageContainer: {
    flex: 1,
  } as ViewStyle,
  message: {
    fontSize: 15,
    fontFamily: "GeomMedium",
    lineHeight: 20,
  },
  closeButton: {
    padding: 4,
    justifyContent: "center",
    alignItems: "center",
  } as ViewStyle,
});

