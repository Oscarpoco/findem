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
import AsyncStorage from "@react-native-async-storage/async-storage";

export const screenOptions = {
  title: "Register",
  headerShown: false,
};

/* ─── ONLINE AVATAR URL ─── */
const AVATAR_URL =
  "https://api.dicebear.com/7.x/avataaars/png?seed=NorthHealth&backgroundColor=ffffff";
const AUTH_KEY = "findem_is_authenticated";

export default function Register() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const TINT = Colors.light.tint;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);

  /* ─── HANDLERS ─── */
  const handleSignUp = async () => {
    try {
      await AsyncStorage.setItem(AUTH_KEY, "true");
    } catch (error) {
      if (__DEV__) console.warn("Failed to persist auth flag on sign-up:", error);
    }
    router.replace("/(tabs)");
  };

  const handleGoogleSignUp = () => {
    // TODO: CONNECT GOOGLE AUTH
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
        {/* ─── HEADER ─── */}
        <View style={styles.headers}>
          {/* LEFT PILL WITH ONLINE AVATAR */}
          <View style={[styles.leftHeader, { backgroundColor: TINT }]}>
            <Image source={{ uri: AVATAR_URL }} style={styles.avatar} />
            <View style={[styles.appNameWrapper, { backgroundColor: TINT }]}>
              <Text style={styles.appNameMain}>Findem</Text>
            </View>
          </View>
          <View style={[styles.headerDivider, { backgroundColor: TINT }]} />
          {/* LOGIN ICON BUTTON */}
          <TouchableOpacity
            style={[styles.loginBtn, { backgroundColor: TINT }]}
            onPress={() => router.replace("/Login")}
            activeOpacity={0.8}
          >
            <Ionicons
              name="log-in-outline"
              size={20}
              color={colors.background}
            />
          </TouchableOpacity>
        </View>
        {/* ─── HEADER END ─── */}

        {/* ─── WELCOME BLOCK ─── */}
        <View style={styles.welcomeBlock}>
          <Text style={[styles.welcomeTitle, { color: colors.text }]}>
            Create Account
          </Text>
          <Text style={[styles.welcomeSub, { color: colors.text }]}>
            Join us to get started
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

          {/* PASSWORD FIELD */}
          <View style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, { color: colors.text }]}>
              Password
            </Text>
            <View
              style={[
                styles.inputWrapper,
                {
                  borderColor: passwordFocused ? TINT : "transparent",
                  backgroundColor:
                    colorScheme === "dark" ? "#1e1e1e" : "#f2f2f2",
                },
              ]}
            >
              <Ionicons
                name="lock-closed-outline"
                size={22}
                color={passwordFocused ? TINT : "#999"}
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="••••••••"
                placeholderTextColor="#aaa"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeBtn}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={22}
                  color="#999"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* CONFIRM PASSWORD FIELD */}
          <View style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, { color: colors.text }]}>
              Confirm Password
            </Text>
            <View
              style={[
                styles.inputWrapper,
                {
                  borderColor: confirmPasswordFocused ? TINT : "transparent",
                  backgroundColor:
                    colorScheme === "dark" ? "#1e1e1e" : "#f2f2f2",
                },
              ]}
            >
              <Ionicons
                name="lock-closed-outline"
                size={22}
                color={confirmPasswordFocused ? TINT : "#999"}
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="••••••••"
                placeholderTextColor="#aaa"
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                onFocus={() => setConfirmPasswordFocused(true)}
                onBlur={() => setConfirmPasswordFocused(false)}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeBtn}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
                  size={22}
                  color="#999"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* SIGN UP BUTTON */}
          <TouchableOpacity
            style={[styles.signupBtn, { backgroundColor: TINT }]}
            onPress={handleSignUp}
            activeOpacity={0.85}
          >
            <Text style={styles.signupBtnText}>Sign Up</Text>
            <View style={styles.signupArrow}>
              <Ionicons name="chevron-forward" size={20} color={TINT} />
            </View>
          </TouchableOpacity>

          {/* DIVIDER */}
          <View style={styles.dividerRow}>
            <View
              style={[
                styles.dividerLine,
                {
                  backgroundColor: colorScheme === "dark" ? "#333" : "#e0e0e0",
                },
              ]}
            />
            <Text style={[styles.dividerText, { color: colors.text }]}>or</Text>
            <View
              style={[
                styles.dividerLine,
                {
                  backgroundColor: colorScheme === "dark" ? "#333" : "#e0e0e0",
                },
              ]}
            />
          </View>

          {/* SIGN UP WITH GOOGLE */}
          <TouchableOpacity
            style={[
              styles.googleBtn,
              {
                backgroundColor: colorScheme === "dark" ? "#1e1e1e" : "#f2f2f2",
                borderColor: colorScheme === "dark" ? "#333" : "#e8e8e8",
              },
            ]}
            onPress={handleGoogleSignUp}
            activeOpacity={0.8}
          >
            <View style={styles.googleIconWrapper}>
              <Text style={styles.googleIconText}>G</Text>
            </View>
            <Text style={[styles.googleBtnText, { color: colors.text }]}>
              Continue with Google
            </Text>
          </TouchableOpacity>
        </View>
        {/* ─── FORM END ─── */}

        {/* ─── LOGIN LINK ─── */}
        <View style={styles.loginRow}>
          <Text style={[styles.loginPrompt, { color: colors.text }]}>
            Already have an account?{"  "}
          </Text>
          <TouchableOpacity
            onPress={() => router.replace("/Login")}
            activeOpacity={0.7}
          >
            <Text style={[styles.loginLink, { color: TINT }]}>Login</Text>
          </TouchableOpacity>
        </View>
        {/* ─── LOGIN LINK END ─── */}
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

  /* ─── HEADER ─── */
  headers: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 48,
    position: "relative",
  },
  headerDivider: {
    position: "absolute",
    width: "95%",
    height: 22,
    backgroundColor: "red",
    left: 5,
    zIndex: 1,
  },
  leftHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    width: "85%",
    borderRadius: 50,
    paddingVertical: 6,
    paddingHorizontal: 6,
    height: 60,
    zIndex: 2,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 25,
    backgroundColor: "#fff",
  },
  appNameWrapper: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 1,
    flexShrink: 1,
    width: "100%",
  },
  appNameMain: {
     fontFamily: "GeomExtraBold",
    fontSize: 30,
    color: "#000",
    letterSpacing: -0.3,
  },
  appNameAt: {
    fontFamily: "GeomLight",
    fontSize: 16,
    color: "rgba(255,255,255,0.7)",
    textTransform: "uppercase",
  },
  appNameSub: {
    fontFamily: "GeomMedium",
    fontSize: 17,
    color: "rgba(255,255,255,0.88)",
    letterSpacing: -0.2,
    textTransform: "uppercase",
  },
  loginBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
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
  eyeBtn: {
    padding: 6,
  },

  /* ─── SIGN UP BUTTON ─── */
  signupBtn: {
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
  signupBtnText: {
    fontFamily: "GeomBold",
    color: "#fff",
    fontSize: 17,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  signupArrow: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },

  /* ─── DIVIDER ─── */
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginVertical: -4,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontFamily: "GeomRegular",
    fontSize: 13,
    opacity: 0.4,
  },

  /* ─── GOOGLE BUTTON ─── */
  googleBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 32,
    borderWidth: 1.5,
    paddingHorizontal: 18,
    paddingVertical: 14,
    minHeight: 64,
  },
  googleIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  googleIconText: {
    fontFamily: "GeomBlack",
    fontSize: 16,
    color: "#4285F4",
  },
  googleBtnText: {
    fontFamily: "GeomSemiBold",
    fontSize: 15,
    paddingLeft: 14,
    textTransform: "uppercase",
  },

  /* ─── LOGIN LINK ─── */
  loginRow: {
    flexDirection: "row",
    marginTop: 40,
    alignItems: "center",
  },
  loginPrompt: {
    fontFamily: "GeomRegular",
    fontSize: 15,
    opacity: 0.5,
  },
  loginLink: {
    fontFamily: "GeomBold",
    fontSize: 15,
  },
});
