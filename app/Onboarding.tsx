import OnboardingSteps from "@/components/OnboardingSteps";
import { View } from "@/components/Themed";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import { useRouter } from "expo-router";
import { StyleSheet } from "react-native";
import { useOnboardingStore } from "@/src/state/onboardingStore";

export const screenOptions = {
  title: "Onboarding",
  headerShown: false,
};

export default function Onboarding() {
  const router = useRouter();

  const colorScheme = useColorScheme();
  const completeOnboarding = useOnboardingStore((s) => s.complete);

  const handleDone = async () => {
    completeOnboarding();
    router.replace("/Login");
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: Colors[colorScheme ?? "light"].background },
      ]}
    >
      <OnboardingSteps onDone={handleDone} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
