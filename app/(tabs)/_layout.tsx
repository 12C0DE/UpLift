import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { View } from "react-native";
import Animated, { FadeIn, FadeOut, LinearTransition } from "react-native-reanimated";

const AnimatedView = Animated.createAnimatedComponent(View);

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          bottom: 25,
          justifyContent: "center",
          alignSelf: "center",
          height: 60,
          minWidth: 250,
          maxWidth: 500,
          width: "40%",
          marginHorizontal: "auto",
          paddingHorizontal: 30,
          paddingVertical: 8,
          borderRadius: 40,
          borderWidth: 1,
          borderTopWidth: 1,
          borderColor: "#333",
          borderTopColor: "#333",
          backgroundColor: "#0a0a0a",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.3,
          shadowRadius: 5,
        },
        tabBarItemStyle: {
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          marginHorizontal: 10
        },
        tabBarInactiveTintColor: "#999",
        tabBarActiveTintColor: "white",
        tabBarLabel: ({ focused, color }) => {
          if (!focused) return null;
          let title = route.name;
          if (route.name === "index") title = "Home";
          else if (route.name === "currentlift") title = "Current Lift";
          else if (route.name === "logs") title = "Logs";
          else if (route.name === "settings") title = "Settings";
          return (
            <Animated.Text entering={FadeIn.duration(200)} exiting={FadeOut.duration(200)} style={{ color, fontSize: 12, fontWeight: 500, textWrap: "nowrap" }}>
              {title}
            </Animated.Text>
          );
        },
      })}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, size }) => (
            <AnimatedView
              layout={LinearTransition.springify().mass(0.8)}
              key="index"
            >
              <Ionicons name="home" size={size} color={color} />
            </AnimatedView>
          ),
        }}
      />
      <Tabs.Screen
        name="currentlift"
        options={{
          tabBarIcon: ({ color, size }) => (
            <AnimatedView
              layout={LinearTransition.springify().mass(0.8)}
              key="cLift"
            >
              <Ionicons name="barbell" size={size} color={color} />
            </AnimatedView>
          ),
        }}
      />
      <Tabs.Screen
        name="logs"
        options={{
          tabBarIcon: ({ color, size }) => (
            <AnimatedView
              layout={LinearTransition.springify().mass(0.8)}
              key="logs"
            >
              <Ionicons name="calendar-outline" size={size} color={color} />
            </AnimatedView>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ color, size }) => (
            <AnimatedView
              layout={LinearTransition.springify().mass(0.8)}
              key="settings"
            >
              <Ionicons name="settings" size={size} color={color} />
            </AnimatedView>
          ),
        }}
      />
    </Tabs>
  );
}
