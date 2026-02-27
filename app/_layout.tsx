import { BarlowSemiCondensed_400Regular_Italic } from "@expo-google-fonts/barlow-semi-condensed";
import { BebasNeue_400Regular, useFonts } from "@expo-google-fonts/bebas-neue";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";

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
