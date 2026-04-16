import { Text, View } from "@/components/Themed";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    TextInput,
    TouchableOpacity,
} from "react-native";

export const screenOptions = {
  title: "Reset Password",
  headerShown: false,
};

/* ─── ONLINE AVATAR URL ─── */
const AVATAR_URL =
  "https://api.dicebear.com/7.x/avataaars/png?seed=NorthHealth&backgroundColor=ffffff";

export default function ResetPassword() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const TINT = Colors.light.tint;

  const [email, setEmail] = useState("");
  const [emailFocused, setEmailFocused] = useState(false);

  /* ─── HANDLERS ─── */
  const handleReset = () => {
    // TODO: SEND RESET EMAIL
    router.replace("/Login");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar
        barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
      />

      <ScrollView
        contentContainerStyle={[
          styles.container,
          { backgroundColor: colors.background },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
      

        {/* ─── WELCOME BLOCK ─── */}
        <View style={styles.welcomeBlock}>
          <Text style={[styles.welcomeTitle, { color: colors.text }]}>
            Reset Password
          </Text>
          <Text style={[styles.welcomeSub, { color: colors.text }]}>
            Enter your email to receive a reset link
          </Text>
        </View>
        {/* ─── WELCOME END ─── */}

        {/* ─── FORM ─── */}
        <View style={styles.form}>
          {/* EMAIL FIELD */}
          <View style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, { color: colors.text }]}>
              Email
            </Text>
            <View
              style={[
                styles.inputWrapper,
                {
                  borderColor: emailFocused ? TINT : "transparent",
                  backgroundColor:
                    colorScheme === "dark" ? "#1e1e1e" : "#f2f2f2",
                },
              ]}
            >
              <Ionicons
                name="mail-outline"
                size={22}
                color={emailFocused ? TINT : "#999"}
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="your@email.com"
                placeholderTextColor="#aaa"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
              />
            </View>
          </View>

          {/* SEND RESET LINK BUTTON */}
          <TouchableOpacity
            style={[styles.resetBtn, { backgroundColor: TINT }]}
            onPress={handleReset}
            activeOpacity={0.85}
          >
            <Text style={styles.resetBtnText}>Send Reset Link</Text>
            <View style={styles.resetArrow}>
              <Ionicons name="chevron-forward" size={20} color={TINT} />
            </View>
          </TouchableOpacity>
        </View>
        {/* ─── FORM END ─── */}

        {/* ─── BACK TO LOGIN LINK ─── */}
        <View style={styles.backLoginRow}>
          <Text style={[styles.backLoginPrompt, { color: colors.text }]}>
            Remember your password?{"  "}
          </Text>
          <TouchableOpacity
            onPress={() => router.replace("/Login")}
            activeOpacity={0.7}
          >
            <Text style={[styles.backLoginLink, { color: TINT }]}>Login</Text>
          </TouchableOpacity>
        </View>
        {/* ─── BACK TO LOGIN LINK END ─── */}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  /* ─── LAYOUT ─── */
  container: {
    flexGrow: 1,
    alignItems: "center",
    paddingTop: 80,
    paddingHorizontal: 20,
    paddingBottom: 48,
  },

  /* ─── WELCOME ─── */
  welcomeBlock: {
    width: "100%",
    marginBottom: 40,
  },
  welcomeTitle: {
    fontFamily: "GeomBlack",
    fontSize: 36,
    letterSpacing: -1,
    marginBottom: 6,
  },
  welcomeSub: {
    fontFamily: "GeomRegular",
    fontSize: 16,
    opacity: 0.45,
  },

  /* ─── FORM ─── */
  form: {
    width: "100%",
    gap: 20,
  },
  fieldGroup: {
    gap: 8,
  },
  fieldLabel: {
    fontFamily: "GeomSemiBold",
    fontSize: 12,
    letterSpacing: 1,
    textTransform: "uppercase",
    opacity: 0.5,
    paddingLeft: 6,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 32,
    borderWidth: 2,
    paddingHorizontal: 18,
    paddingVertical: 6,
    minHeight: 64,
  },
  inputIcon: {
    marginRight: 14,
  },
  input: {
    flex: 1,
    fontFamily: "GeomMedium",
    fontSize: 16,
    paddingVertical: 14,
  },

  /* ─── RESET BUTTON ─── */
  resetBtn: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingLeft: 28,
    paddingRight: 10,
    borderRadius: 50,
    marginTop: 4,
    shadowColor: Colors.light.tint,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  resetBtnText: {
    fontFamily: "GeomBold",
    color: "#fff",
    fontSize: 17,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  resetArrow: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },

  /* ─── BACK TO LOGIN LINK ─── */
  backLoginRow: {
    flexDirection: "row",
    marginTop: 40,
    alignItems: "center",
  },
  backLoginPrompt: {
    fontFamily: "GeomRegular",
    fontSize: 15,
    opacity: 0.5,
  },
  backLoginLink: {
    fontFamily: "GeomBold",
    fontSize: 15,
  },
});
