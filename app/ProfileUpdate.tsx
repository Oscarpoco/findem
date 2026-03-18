import { Text, View } from "@/components/Themed";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import { updateUserProfile } from "../src/api/user";
import { useAuthStore } from "@/src/state/authStore";
import { toastError, toastSuccess } from "@/src/ui/toast";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";

export const screenOptions = {
  title: "Profile Update",
  headerShown: false,
};

export default function ProfileUpdate() {
  const router = useRouter();
  const scheme = useColorScheme();
  const colors = Colors[scheme ?? "light"];
  const TINT = Colors.light.tint;

  const accessToken = useAuthStore((s) => s.accessToken);
  const uid = useAuthStore((s) => s.user?.id);
  const profileCompleted = useAuthStore((s) => s.profileCompleted);
  const setProfileCompleted = useAuthStore((s) => s.setProfileCompleted);

  const [displayName, setDisplayName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [identityNumber, setIdentityNumber] = useState("");

  const [focused, setFocused] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!accessToken || !uid) {
      toastError("Session expired", "Please sign in again.");
      router.replace("/Login");
      return;
    }
    if (profileCompleted) {
      router.replace("/CareerPath");
    }
  }, [accessToken, profileCompleted, router, uid]);

  const mutation = useMutation({
    mutationFn: async () =>
      updateUserProfile({
        uid: uid ?? "",
        displayName: displayName.trim(),
        phoneNumber: phoneNumber.trim(),
        province: province.trim(),
        city: city.trim(),
        identityNumber: identityNumber.trim(),
      }),
    onSuccess: async () => {
      setProfileCompleted(true);
      toastSuccess("Profile updated", "Next: choose your career path.");
      router.replace("/CareerPath");
    },
    onError: (error: any) => {
      const msg =
        error?.response?.data?.message ??
        error?.message ??
        "Could not update profile. Try again.";
      toastError("Profile update failed", String(msg));
    },
  });

  const submit = () => {
    if (!displayName.trim()) return toastError("Missing display name", "Enter your name.");
    if (!phoneNumber.trim()) return toastError("Missing phone number", "Enter your phone number.");
    if (!province.trim()) return toastError("Missing province", "Enter your province.");
    if (!city.trim()) return toastError("Missing city", "Enter your city.");
    if (!identityNumber.trim())
      return toastError("Missing ID number", "Enter your identity number.");

    mutation.mutate();
  };

  const inputBg = scheme === "dark" ? "#1e1e1e" : "#f2f2f2";

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar
        barStyle={scheme === "dark" ? "light-content" : "dark-content"}
      />

      <ScrollView
        contentContainerStyle={[
          styles.container,
          { backgroundColor: colors.background },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.welcomeBlock}>
          <Text style={[styles.welcomeTitle, { color: colors.text }]}>
            Update Profile
          </Text>
          <Text style={[styles.welcomeSub, { color: colors.text }]}>
            Complete your details to continue
          </Text>
        </View>

        <View style={styles.form}>
          {renderField({
            label: "Display Name",
            icon: "person-outline",
            value: displayName,
            onChange: setDisplayName,
            placeholder: "Your name",
            focused: focused.displayName,
            onFocus: () => setFocused((s) => ({ ...s, displayName: true })),
            onBlur: () => setFocused((s) => ({ ...s, displayName: false })),
            TINT,
            inputBg,
            colors,
          })}

          {renderField({
            label: "Phone Number",
            icon: "call-outline",
            value: phoneNumber,
            onChange: setPhoneNumber,
            placeholder: "e.g. 0712345678",
            focused: focused.phoneNumber,
            onFocus: () => setFocused((s) => ({ ...s, phoneNumber: true })),
            onBlur: () => setFocused((s) => ({ ...s, phoneNumber: false })),
            keyboardType: "phone-pad",
            TINT,
            inputBg,
            colors,
          })}

          {renderField({
            label: "Province",
            icon: "map-outline",
            value: province,
            onChange: setProvince,
            placeholder: "Province",
            focused: focused.province,
            onFocus: () => setFocused((s) => ({ ...s, province: true })),
            onBlur: () => setFocused((s) => ({ ...s, province: false })),
            TINT,
            inputBg,
            colors,
          })}

          {renderField({
            label: "City",
            icon: "location-outline",
            value: city,
            onChange: setCity,
            placeholder: "City",
            focused: focused.city,
            onFocus: () => setFocused((s) => ({ ...s, city: true })),
            onBlur: () => setFocused((s) => ({ ...s, city: false })),
            TINT,
            inputBg,
            colors,
          })}

          {renderField({
            label: "Identity Number",
            icon: "card-outline",
            value: identityNumber,
            onChange: setIdentityNumber,
            placeholder: "ID number",
            focused: focused.identityNumber,
            onFocus: () => setFocused((s) => ({ ...s, identityNumber: true })),
            onBlur: () => setFocused((s) => ({ ...s, identityNumber: false })),
            keyboardType: "number-pad",
            TINT,
            inputBg,
            colors,
          })}

          <TouchableOpacity
            style={[
              styles.primaryBtn,
              { backgroundColor: TINT, opacity: mutation.isPending ? 0.7 : 1 },
            ]}
            onPress={submit}
            activeOpacity={0.85}
            disabled={mutation.isPending}
          >
            <Text style={styles.primaryBtnText}>
              {mutation.isPending ? "Saving..." : "Continue"}
            </Text>
            <View style={styles.primaryArrow}>
              <Ionicons name="chevron-forward" size={20} color={TINT} />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function renderField(opts: {
  label: string;
  icon: any;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  focused?: boolean;
  onFocus: () => void;
  onBlur: () => void;
  keyboardType?: any;
  TINT: string;
  inputBg: string;
  colors: any;
}) {
  const {
    label,
    icon,
    value,
    onChange,
    placeholder,
    focused,
    onFocus,
    onBlur,
    keyboardType,
    TINT,
    inputBg,
    colors,
  } = opts;

  return (
    <View style={styles.fieldGroup}>
      <Text style={[styles.fieldLabel, { color: colors.text }]}>{label}</Text>
      <View
        style={[
          styles.inputWrapper,
          {
            borderColor: focused ? TINT : "transparent",
            backgroundColor: inputBg,
          },
        ]}
      >
        <Ionicons
          name={icon}
          size={22}
          color={focused ? TINT : "#999"}
          style={styles.inputIcon}
        />
        <TextInput
          style={[styles.input, { color: colors.text }]}
          placeholder={placeholder}
          placeholderTextColor="#aaa"
          value={value}
          onChangeText={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          keyboardType={keyboardType}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    paddingTop: 80,
    paddingHorizontal: 20,
    paddingBottom: 48,
  },
  welcomeBlock: {
    width: "100%",
    marginBottom: 32,
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
  form: {
    width: "100%",
    gap: 18,
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
  primaryBtn: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingLeft: 28,
    paddingRight: 10,
    borderRadius: 50,
    marginTop: 6,
    shadowColor: Colors.light.tint,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  primaryBtnText: {
    fontFamily: "GeomBold",
    color: "#fff",
    fontSize: 17,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  primaryArrow: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
});

