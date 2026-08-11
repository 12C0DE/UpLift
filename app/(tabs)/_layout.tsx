import { Ionicons } from "@expo/vector-icons";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { Tabs } from "expo-router";
import { View } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
} from "react-native-reanimated";

const AnimatedView = Animated.createAnimatedComponent(View);

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          bottom: 15,
          left: 0,
          right: 0,
          marginHorizontal: 50,
          justifyContent: "center",
          alignItems: "center",
          height: 58,
          paddingHorizontal: 30,
          paddingVertical: 16,
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
          maxWidth: 400
        },
        tabBarItemStyle: {
          flex: 1,
          justifyContent: "center",
          alignItems: "flex-start",
          flexDirection: "row",
          marginHorizontal: 0,
        },
        tabBarInactiveTintColor: "#999",
        tabBarActiveTintColor: "white",
        tabBarLabel: ({ focused, color }) => {
          if (!focused) return null;
          let title = route.name;
          if (route.name === "index") title = "Home";
          else if (route.name === "currentlift") title = "Lift";
          else if (route.name === "logs") title = "Logs";
          else if (route.name === "programs") title = "Programs";
          return (
            <Animated.Text
              entering={FadeIn.duration(200)}
              exiting={FadeOut.duration(200)}
              style={{ color, fontSize: 10, fontWeight: 500 }}
            >
              {title}
            </Animated.Text>
          );
        },
      })}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <AnimatedView key="index">
              <Ionicons name="home" size={focused ? size : 20} style={{ paddingTop: 0 }} color={color} />
            </AnimatedView>
          ),
        }}
      />
      <Tabs.Screen
        name="programs"
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <AnimatedView key="settings">
              <SimpleLineIcons name="notebook" size={focused ? size : 20} style={{ paddingTop: 0 }} color={color} />
            </AnimatedView>
          ),
        }}
      />
      <Tabs.Screen
        name="currentlift"
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <AnimatedView key="cLift">
              <Ionicons name="barbell" size={focused ? size : 20} style={{ paddingTop: 0 }} color={color} />
            </AnimatedView>
          ),
        }}
      />
      <Tabs.Screen
        name="logs"
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <AnimatedView key="logs">
              <Ionicons name="calendar-outline" size={focused ? size : 20} style={{ paddingTop: 0 }} color={color} />
            </AnimatedView>
          ),
        }}
      />
    </Tabs>
  );
}
