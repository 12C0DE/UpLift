import { useEffect } from "react";
import { useFonts, BebasNeue_400Regular } from "@expo-google-fonts/bebas-neue";
import { BarlowSemiCondensed_400Regular_Italic } from "@expo-google-fonts/barlow-semi-condensed";
import { SplashScreen, Stack } from "expo-router";

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
  <Stack screenOptions={{ headerShown: false }}>
    <Stack.Screen name="tabs" />
  </Stack>
  );
}
