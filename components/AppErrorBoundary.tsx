import { captureException, initSentry } from "@/src/lib/sentry";
import React, { type ErrorInfo, type ReactNode } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = { children: ReactNode };

type State = { error: Error | null };

export class AppErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    initSentry();
    captureException(error, { componentStack: info.componentStack });
    if (__DEV__) console.error(error, info.componentStack);
  }

  reset = (): void => {
    this.setState({ error: null });
  };

  render() {
    if (this.state.error) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Something went wrong</Text>
          <Text style={styles.body}>
            The app hit an unexpected error. You can try again.
          </Text>
          <TouchableOpacity onPress={this.reset} style={styles.button}>
            <Text style={styles.buttonText}>Try again</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#F0F4FF",
  },
  title: {
    fontSize: 20,
    fontFamily: "GeomSemiBold",
    color: "#0F172A",
    marginBottom: 8,
    textAlign: "center",
  },
  body: {
    fontSize: 15,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
    maxWidth: 320,
  },
  button: {
    backgroundColor: "#0EA5E9",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 24,
  },
  buttonText: {
    color: "#fff",
    fontFamily: "GeomSemiBold",
    fontSize: 16,
  },
});
