import Entypo from "@expo/vector-icons/Entypo";
import { router, Stack } from "expo-router";
import { Pressable } from "react-native";

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
          headerBackVisible: false,
          headerLeft: () => (
            <Pressable
              onPress={() => router.back()}
              hitSlop={16}
            >
              <Entypo name="chevron-left" size={30} color="white" />
            </Pressable>
          ),
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
