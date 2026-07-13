import { Stack } from "expo-router";

export default function ProgramsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen
        name="edit"
        options={{
          headerShown: true,
          headerBackTitle: "Programs",
          headerStyle: {
            backgroundColor: "#0a0a0a",
          },
          headerTintColor: "white",
          headerTitleStyle: {
            color: "white",
          },
        }}
      />
    </Stack>
  );
}
