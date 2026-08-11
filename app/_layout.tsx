// Polyfills for JS runtime environments (Hermes)
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

import { ActiveWorkoutProvider } from '@/context/ActiveWorkoutContext';
import { db } from '@/db';
import migrations from '@/db/migrations/migrations';
import { BarlowSemiCondensed_400Regular, BarlowSemiCondensed_400Regular_Italic, BarlowSemiCondensed_500Medium } from "@expo-google-fonts/barlow-semi-condensed";
import { BebasNeue_400Regular, useFonts } from "@expo-google-fonts/bebas-neue";
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Text } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

SplashScreen.preventAutoHideAsync().catch(() => {});

export const metadata = {
  title: "UpLift",
};

export default function RootLayout() {
  const { success, error: dbError } = useMigrations(db, migrations);
  const [loaded, error] = useFonts({
    BebasNeue: BebasNeue_400Regular,
    italicFont: BarlowSemiCondensed_400Regular_Italic,
    bodyText: BarlowSemiCondensed_400Regular,
    subHeaderText: BarlowSemiCondensed_500Medium,
  });

  useEffect(() => {
    if ((loaded || error) && (success || dbError)) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [loaded, error, success, dbError]);

  // Safety fallback: ensure splash screen always hides after 3 seconds max
  useEffect(() => {
    const timeout = setTimeout(() => {
      SplashScreen.hideAsync().catch(() => {});
    }, 3000);
    return () => clearTimeout(timeout);
  }, []);

  if ((!loaded && !error) || !success) return null;

  // DB checks
  if (dbError) {
    return (
      <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#0a0a0a", justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "#ff8a8a", padding: 20 }}>Migration error: {dbError.message}</Text>
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
