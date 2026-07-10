import { db } from '@/db';
import migrations from '@/db/migrations/migrations';
import { BarlowSemiCondensed_400Regular, BarlowSemiCondensed_400Regular_Italic, BarlowSemiCondensed_500Medium } from "@expo-google-fonts/barlow-semi-condensed";
import { BebasNeue_400Regular, useFonts } from "@expo-google-fonts/bebas-neue";
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { Text } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

SplashScreen.preventAutoHideAsync();

export const metadata = {
  title: "UpLift",
};

export default function RootLayout() {
  const { success, error: dbError } = useMigrations(db, migrations);
  const [loaded, error] = useFonts({
    BebasNeue: BebasNeue_400Regular,
    italicFont: BarlowSemiCondensed_400Regular_Italic,
    bodyText: BarlowSemiCondensed_400Regular,
    subHeaderText: BarlowSemiCondensed_500Medium
  });

  useEffect(() => {
    if ((loaded || error) && (success || dbError)) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error, success, dbError]);

  if ((!loaded && !error) || !success) return null;

  //db checks
  if (dbError) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Text>Migration error: {dbError.message}</Text>
      </GestureHandlerRootView>
    );
  }
  if (!success) {
    return <GestureHandlerRootView style={{ flex: 1 }} />;
  } // db still running

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        {/* the tabs navigator is one screen in the parent stack */}
        <Stack.Screen name="(tabs)" />

        {/* a bottom‑up presentation for a form/modal */}
        <Stack.Screen
          name="descriptionModal"
          options={{
            presentation: "modal", // or "formSheet" on iOS
            gestureEnabled: true,
            headerShown: true,
            headerTitle: "Description",
          }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}
