import React, { useMemo } from "react";
import { Platform, StyleSheet, View } from "react-native";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";

type ToastRenderProps = {
  text1?: string;
  text2?: string;
  onPress?: () => void;
} & Record<string, unknown>;

const ACCENTS = {
  success: "#22c55e",
  error: "#ef4444",
  info: "#3b82f6",
} as const;

function CardToast({
  kind,
  props,
  surface,
  titleColor,
  messageColor,
}: {
  kind: keyof typeof ACCENTS;
  props: ToastRenderProps;
  surface: string;
  titleColor: string;
  messageColor: string;
}) {
  const accent = ACCENTS[kind];

  const shared = {
    ...props,
    style: [
      styles.toastBase,
      { backgroundColor: surface, borderColor: `${accent}10` },
    ],
    contentContainerStyle: styles.content,
    text1Style: [styles.title, { color: titleColor }],
    text2Style: [styles.message, { color: messageColor }],
    text2NumberOfLines: 2 as const,
    renderLeadingIcon: () => <View style={[styles.dot, { backgroundColor: accent }]} />,
  };

  return kind === "error" ? <ErrorToast {...shared} /> : <BaseToast {...shared} />;
}

export function ToastHost() {
  const scheme = useColorScheme();
  const palette = Colors[scheme ?? "light"];

  // A slightly “lifted” surface that reads well on both themes.
  const surface =
    scheme === "dark" ? "#0b0b10" : "rgba(255,255,255,1)";

  const config = useMemo(
    () => ({
      success: (props: ToastRenderProps) => (
        <CardToast
          kind="success"
          props={props}
          surface={surface}
          titleColor={palette.text}
          messageColor={palette.textSecondary ?? palette.text}
        />
      ),
      error: (props: ToastRenderProps) => (
        <CardToast
          kind="error"
          props={props}
          surface={surface}
          titleColor={palette.text}
          messageColor={palette.textSecondary ?? palette.text}
        />
      ),
      info: (props: ToastRenderProps) => (
        <CardToast
          kind="info"
          props={props}
          surface={surface}
          titleColor={palette.text}
          messageColor={palette.textSecondary ?? palette.text}
        />
      ),
    }),
    [palette.text, palette.textSecondary, surface]
  );

  return <Toast config={config as any} />;
}

const styles = StyleSheet.create({
  toastBase: {
    borderLeftWidth: 0,
    borderWidth: 1,
    borderRadius: 28,
    minHeight: 64,
    paddingVertical: 10,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.14,
        shadowRadius: 18,
      },
      android: { elevation: 10 },
      default: {},
    }),
  },
  content: {
    paddingHorizontal: 14,
    gap: 3,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 10,
    marginLeft: 4,
    marginRight: 8,
    alignSelf: "center",
  },
  title: {
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: -0.2,
  },
  message: {
    fontSize: 13,
    fontWeight: "500",
    opacity: 0.85,
    lineHeight: 18,
  },
});