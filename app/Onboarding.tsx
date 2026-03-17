import OnboardingSteps from "@/components/OnboardingSteps";
import { View } from "@/components/Themed";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StyleSheet } from "react-native";

export const screenOptions = {
  title: "Onboarding",
  headerShown: false,
};

export default function Onboarding() {
  const router = useRouter();

  const colorScheme = useColorScheme();

  const handleDone = async () => {
    try {
      await AsyncStorage.setItem("findem_onboarding_completed", "true");
    } catch (error) {
      if (__DEV__) console.warn("Failed to persist onboarding flag:", error);
    }
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
