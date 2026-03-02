import { BarlowSemiCondensed_400Regular_Italic } from "@expo-google-fonts/barlow-semi-condensed";
import { BebasNeue_400Regular, useFonts } from "@expo-google-fonts/bebas-neue";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

SplashScreen.preventAutoHideAsync();

export const metadata = {
  title: "UpLift",
};

export default function RootLayout() {
  const [loaded, error] = useFonts({
    BebasNeue: BebasNeue_400Regular,
    italicFont: BarlowSemiCondensed_400Regular_Italic,
  });

  useEffect(() => {
    if (loaded || error) SplashScreen.hideAsync();
  }, [loaded, error]);

  if (!loaded && !error) return null;

  return (
    // <Stack screenOptions={{ headerShown: false }}>
    //   <Stack.Screen name="(tabs)" />
    //   <Stack.Screen name="descriptionModal" options={{
    //     presentation: "formSheet",
    //     headerShown: true,
    //     headerTitle: "Description"
    //   }} />
    // </Stack>
     <Tabs screenOptions={{
            headerShown: false
        }}>
            <Tabs.Screen name="index" options={{title: "Home", tabBarIcon: ({ color, size }) => (
                <Ionicons name="home" size={size} color={color} />
            )}} />
            <Tabs.Screen name="currentlift" options={{title: "Current Lift", tabBarIcon: ({ color, size}) => (
                <Ionicons name="barbell" size={size} color={color} />
            )}} />
            <Tabs.Screen name="logs" options={{title: "Logs", tabBarIcon: ({ color, size }) => (
                <Ionicons name="calendar-outline" size={size} color={color} />
            )}} />
            <Tabs.Screen name="settings" options={{title: "Settings", tabBarIcon: ({ color, size}) => (
                <Ionicons name="settings" size={size} color={color} />
            )}} />
        </Tabs>
  );
}
