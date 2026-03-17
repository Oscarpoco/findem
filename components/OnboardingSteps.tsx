import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Dimensions, StyleSheet, TouchableOpacity } from "react-native";
import { Text, View } from "./Themed";
import { useColorScheme } from "./useColorScheme";

const { width } = Dimensions.get("window");

const steps = [
  {
    title: "Welcome to Findem",
    description:
      "Findem is a smart digital platform for monitoring personal health and career guidance. Designed for youth in Northern Cape to help you stay focused, motivated, and healthy on your career journey.",
  },
  {
    title: "Track Your Achievements",
    description:
      "Choose your career path and track your progress. The app monitors your achievements, helping you stay on course and build confidence in your chosen field.",
  },
  {
    title: "Boost Your Mental Health",
    description:
      "When you feel down, Findem suggests lightweight tasks to regain confidence. Receive daily push notifications with motivation quotes to boost productivity and keep you healthy.",
  },
  {
    title: "Earn Points & Climb the Leaderboard",
    description:
      "Complete tasks faster to earn points and rank on the leaderboard. Top performers get priority recommendations for learnerships and internships in Northern Cape.",
  },
  {
    title: "Job Portal & Future Hope",
    description:
      "Access exclusive job opportunities for learnerships and internships. By staying focused and healthy, you gain hope for the future, reducing stress and promoting overall well-being.",
  },
];

type Props = {
  onDone: () => void;
};

export default function OnboardingSteps({ onDone }: Props) {
  const [index, setIndex] = useState(0);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const TINT = Colors.light.tint;

  const next = () => {
    if (index + 1 < steps.length) {
      setIndex(index + 1);
    } else {
      onDone();
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* PROGRESS INDICATOR */}
      <View style={styles.progressContainer}>
        {steps.map((_, i) => (
          <View
            key={i}
            style={[
              styles.progressDot,
              i === index && styles.activeDot,
              {
                backgroundColor: i <= index ? TINT : colors.border,
              },
            ]}
          />
        ))}
      </View>

      {/* CONTENT */}
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>
          {steps[index].title}
        </Text>
        <Text style={[styles.description, { color: colors.text }]}>
          {steps[index].description}
        </Text>
      </View>

      {/* BUTTON */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: TINT }]}
        onPress={next}
        activeOpacity={0.85}
      >
        <Text style={styles.buttonText}>
          {index + 1 === steps.length ? "Get Started" : "Next"}
        </Text>
        <View style={styles.buttonArrow}>
          <Ionicons name="chevron-forward" size={20} color={TINT} />
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 100,
    paddingHorizontal: 20,
    paddingBottom: 48,
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 60,
    alignItems: "center",
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeDot: {
    width: 20,
    height: 20,
    borderRadius: 12,

  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  title: {
    fontFamily: "GeomBlack",
    fontSize: 32,
    letterSpacing: -1,
    marginBottom: 20,
    textAlign: "center",
  },
  description: {
    fontFamily: "GeomRegular",
    fontSize: 18,
    opacity: 0.7,
    textAlign: "center",
    lineHeight: 26,
    paddingHorizontal: 10,
  },
  button: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingLeft: 32,
    paddingRight: 12,
    borderRadius: 50,
    marginTop: 40,
    shadowColor: Colors.light.tint,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
    minWidth: width * 0.8,
  },
  buttonText: {
    fontFamily: "GeomBold",
    color: "#fff",
    fontSize: 18,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  buttonArrow: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
});
