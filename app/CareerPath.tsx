import { Text, View } from "@/components/Themed";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import { createCareerPath } from "../src/api/career";
import { api } from "../src/api/client";
import { useAuthStore } from "@/src/state/authStore";
import { toastError, toastSuccess, toastInfo } from "@/src/ui/toast";
import { FindemButtonSpinner } from "@/components/FindemLoader";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";

export const screenOptions = {
  title: "Career Path",
  headerShown: false,
};

export default function CareerPath() {
  const router = useRouter();
  const scheme = useColorScheme();
  const colors = Colors[scheme ?? "light"];
  const TINT = Colors.light.tint;
  const uid = useAuthStore((s) => s.user?.id);

  const accessToken = useAuthStore((s) => s.accessToken);
  const setCareerAfterSetup = useAuthStore((s) => s.setCareerAfterSetup);

  const [pickerOpen, setPickerOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selected, setSelected] = useState<string>("");
  const [custom, setCustom] = useState("");
  const [techCategory, setTechCategory] = useState<
    { id: string; name: string; description: string }[]
  >([]);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (!accessToken) {
        toastError("Session expired", "Please sign in again.");
        router.replace("/Login");
        return;
      }
      await useAuthStore.getState().syncCareerFromApi();
      if (cancelled) return;

      const { profileCompleted: profileDone, careerCompleted: careerDone } =
        useAuthStore.getState();

      if (!profileDone) {
        router.replace("/ProfileUpdate");
        return;
      }
      if (careerDone) {
        router.replace("/(tabs)");
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [accessToken, router]);


  // FETCH CAREER CATEGORIES
  const fetchCategories = async () => {
    try {
      const { data } = await api.get<{ data: typeof techCategory }>(
        "/api/career/categories",
      );
      setTechCategory(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      toastError("Failed to fetch categories", String(error));
    }
  };

useEffect(() => {
  fetchCategories();
}, []);

// ENDS

  const finalPath = useMemo(() => {
    const c = custom.trim();
    if (c.length > 0) return c;
    return selected.trim();
  }, [custom, selected]);

  const mutation = useMutation({
    mutationFn: async () => {
      if (!uid) throw new Error("No UID");
      return createCareerPath({
        uid,
        path: finalPath,
        ...(selectedCategoryId ? { categoryId: selectedCategoryId } : {}),
      });
    },
    onSuccess: async () => {
      setCareerAfterSetup({
        categoryId: selectedCategoryId,
        pathLabel: finalPath,
      });
      toastSuccess("Career saved", "Welcome to Findem.");
      router.replace("/(tabs)");
    },
    onError: (error: any) => {
      const msg =
        error?.response?.data?.message ??
        error?.message ??
        "Could not save career path. Try again.";
      toastError("Career update failed", String(msg));
    },
  });

  const submit = () => {
    if (!finalPath) {
      toastInfo("Choose a path", "Select a tech career or type your own.");
      return;
    }
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
            Career Path
          </Text>
          <Text style={[styles.welcomeSub, { color: colors.text }]}>
            Choose a tech career to personalize your journey
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, { color: colors.text }]}>
              Select from list
            </Text>

            <Pressable
              onPress={() => setPickerOpen(true)}
              style={[
                styles.inputWrapper,
                {
                  backgroundColor: inputBg,
                  borderColor: selected ? TINT : "transparent",
                },
              ]}
            >
              <Ionicons
                name="briefcase-outline"
                size={22}
                color={selected ? TINT : "#999"}
                style={styles.inputIcon}
              />
              <Text
                style={[
                  styles.dropdownText,
                  { color: selected ? colors.text : "#999" },
                ]}
                numberOfLines={1}
              >
                {selected || "Tap to choose a career"}
              </Text>
              <Ionicons name="chevron-down" size={18} color="#999" />
            </Pressable>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, { color: colors.text }]}>
              Or type your own
            </Text>
            <View
              style={[
                styles.inputWrapper,
                {
                  borderColor: custom.length > 0 ? TINT : "transparent",
                  backgroundColor: inputBg,
                },
              ]}
            >
              <Ionicons
                name="create-outline"
                size={22}
                color={custom.length > 0 ? TINT : "#999"}
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="e.g. Blockchain Developer"
                placeholderTextColor="#aaa"
                value={custom}
                onChangeText={(t) => {
                  setCustom(t);
                  if (t.trim().length > 0) {
                    setSelectedCategoryId(null);
                    setSelected("");
                  }
                }}
              />
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.primaryBtn,
              { backgroundColor: TINT, opacity: mutation.isPending ? 0.7 : 1 },
            ]}
            onPress={submit}
            activeOpacity={0.85}
            disabled={mutation.isPending}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              {mutation.isPending ? <FindemButtonSpinner color="#fff" /> : null}
              <Text style={styles.primaryBtnText}>
                {mutation.isPending ? "Saving..." : "Finish Setup"}
              </Text>
            </View>
            <View style={styles.primaryArrow}>
              <Ionicons name="chevron-forward" size={20} color={TINT} />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        visible={pickerOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setPickerOpen(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setPickerOpen(false)}
        />
        <View
          style={[styles.modalSheet, { backgroundColor: colors.background }]}
        >
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.tint }]}>
              Tech careers
            </Text>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {techCategory.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.modalItem,
                  {
                    borderColor: colors.border,
                    backgroundColor:
                      selected === item.name
                        ? scheme === "dark"
                          ? "#1e1e1e"
                          : "#f2f2f2"
                        : "transparent",
                  },
                ]}
                onPress={() => {
                  setSelectedCategoryId(item.id);
                  setSelected(item.name);
                  setCustom("");
                  setPickerOpen(false);
                }}
                activeOpacity={0.75}
              >
                <Text style={[styles.modalItemText, { color: colors.text }]}>
                  {item.name}
                </Text>
                {selected === item.name && (
                  <Ionicons name="checkmark-done" size={22} color={TINT} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Modal>
    </KeyboardAvoidingView>
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
  dropdownText: {
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
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  modalSheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    maxHeight: "70%",
    borderTopLeftRadius: 38,
    borderTopRightRadius: 38,
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    paddingVertical: 8,
  },
  modalTitle: {
    fontFamily: "GeomBold",
    fontSize: 26,
  },
  modalItem: {
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 24,
    borderWidth: .5,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  modalItemText: {
    fontFamily: "GeomMedium",
    fontSize: 15,
  },
});
