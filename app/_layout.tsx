// Polyfills for JS runtime environments (Hermes)
import { ActiveWorkoutProvider } from '@/context/ActiveWorkoutContext';
import { db } from '@/db';
import migrations from '@/db/migrations/migrations';
import { BarlowSemiCondensed_400Regular, BarlowSemiCondensed_400Regular_Italic, BarlowSemiCondensed_500Medium } from "@expo-google-fonts/barlow-semi-condensed";
import { BebasNeue_400Regular, useFonts } from "@expo-google-fonts/bebas-neue";
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { useKeepAwake } from 'expo-keep-awake';
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { ActivityIndicator, Text } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

if (!Array.prototype.toReversed) {
  Object.defineProperty(Array.prototype, "toReversed", {
    value: function toReversedPolyfill() {
      return this.slice().reverse();
    },
    writable: true,
    configurable: true,
  });
}

if (!Array.prototype.toSorted) {
  Object.defineProperty(Array.prototype, "toSorted", {
    value: function toSortedPolyfill(compareFn?: (a: any, b: any) => number) {
      return this.slice().sort(compareFn);
    },
    writable: true,
    configurable: true,
  });
}

SplashScreen.preventAutoHideAsync().catch(() => {});

export const metadata = {
  title: "MaxxOut",
};

export default function RootLayout() {
  useKeepAwake();
  const { success, error: dbError } = useMigrations(db, migrations);
  const [loaded, fontError] = useFonts({
    BebasNeue: BebasNeue_400Regular,
    italicFont: BarlowSemiCondensed_400Regular_Italic,
    bodyText: BarlowSemiCondensed_400Regular,
    subHeaderText: BarlowSemiCondensed_500Medium,
  });

  // Always hide splash screen as soon as fonts are ready
  useEffect(() => {
    if (loaded || fontError) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [loaded, fontError]);

  // Safety fallback timer to hide splash screen no matter what
  useEffect(() => {
    const timeout = setTimeout(() => {
      SplashScreen.hideAsync().catch(() => {});
    }, 1500);
    return () => clearTimeout(timeout);
  }, []);

  // Block rendering until fonts are loaded
  if (!loaded && !fontError) {
    return null;
  }

  // DB Migration Error
  if (dbError) {
    return (
      <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#0a0a0a", justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "#ff8a8a", padding: 20, textAlign: "center" }}>
          Database migration error: {dbError.message}
        </Text>
      </GestureHandlerRootView>
    );
  }

  // DB Migration in progress
  if (!success) {
    return (
      <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#0a0a0a", justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#f6a800" />
        <Text style={{ color: "#929292", marginTop: 12, fontSize: 16 }}>
          Initializing database...
        </Text>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ActiveWorkoutProvider>
        <StatusBar style="light" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="descriptionModal"
            options={{
              presentation: "modal",
              gestureEnabled: true,
              headerShown: true,
              headerTitle: "Description",
              headerTitleStyle: {
                color: "white",
                fontSize: 20,
              },
              headerStyle: {
                backgroundColor: "#0a0a0a",
              },
            }}
          />
        </Stack>
      </ActiveWorkoutProvider>
    </GestureHandlerRootView>
  );
}
