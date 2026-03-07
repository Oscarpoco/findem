import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/components/useColorScheme';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    GeomBlack: require('../assets/fonts/Geom-Black.ttf'),
    GeomBlackItalic: require('../assets/fonts/Geom-BlackItalic.ttf'),
    GeomBold: require('../assets/fonts/Geom-Bold.ttf'),
    GeomBoldItalic: require('../assets/fonts/Geom-BoldItalic.ttf'),
    GeomExtraBold: require('../assets/fonts/Geom-ExtraBold.ttf'),
    GeomExtraBoldItalic: require('../assets/fonts/Geom-ExtraBoldItalic.ttf'),
    GeomItalic: require('../assets/fonts/Geom-Italic.ttf'),
    GeomLight: require('../assets/fonts/Geom-Light.ttf'),
    GeomLightItalic: require('../assets/fonts/Geom-LightItalic.ttf'),
    GeomMedium: require('../assets/fonts/Geom-Medium.ttf'),
    GeomMediumItalic: require('../assets/fonts/Geom-MediumItalic.ttf'),
    GeomRegular: require('../assets/fonts/Geom-Regular.ttf'),
    GeomSemiBold: require('../assets/fonts/Geom-SemiBold.ttf'),
    GeomSemiBoldItalic: require('../assets/fonts/Geom-SemiBoldItalic.ttf'),
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
    </ThemeProvider>
  );
}
