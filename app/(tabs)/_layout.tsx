import { Ionicons } from "@expo/vector-icons";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import * as Haptics from "expo-haptics";
import { Tabs } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, { FadeIn, LinearTransition } from "react-native-reanimated";

interface TabConfig {
  name: string;
  label: string;
  renderIcon: (focused: boolean) => React.ReactNode;
}

const TAB_CONFIGS: Record<string, TabConfig> = {
  index: {
    name: "index",
    label: "Home",
    renderIcon: (focused) => (
      <Ionicons
        name={focused ? "home" : "home-outline"}
        size={20}
        color={focused ? "#0a0a0a" : "#9e9e9e"}
      />
    ),
  },
  programs: {
    name: "programs",
    label: "Programs",
    renderIcon: (focused) => (
      <SimpleLineIcons
        name="notebook"
        size={18}
        color={focused ? "#0a0a0a" : "#9e9e9e"}
      />
    ),
  },
  currentlift: {
    name: "currentlift",
    label: "Lift",
    renderIcon: (focused) => (
      <Ionicons
        name={focused ? "barbell" : "barbell-outline"}
        size={20}
        color={focused ? "#0a0a0a" : "#9e9e9e"}
      />
    ),
  },
  logs: {
    name: "logs",
    label: "Logs",
    renderIcon: (focused) => (
      <Ionicons
        name={focused ? "calendar" : "calendar-outline"}
        size={20}
        color={focused ? "#0a0a0a" : "#9e9e9e"}
      />
    ),
  },
};

function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <View style={styles.floatingContainer}>
      <View style={styles.barPill}>
        {state.routes.map((route, index) => {
          const config = TAB_CONFIGS[route.name];
          if (!config) return null;

          const isFocused = state.index === index;

          const onPress = () => {
            void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              style={styles.tabItem}
              hitSlop={8}
            >
              <Animated.View
                layout={LinearTransition.springify().mass(0.7).damping(48)}
                style={isFocused ? styles.activePill : styles.inactiveItem}
              >
                {config.renderIcon(isFocused)}
                {isFocused && (
                  <Animated.Text
                    entering={FadeIn.duration(150)}
                    style={styles.activeLabel}
                  >
                    {config.label}
                  </Animated.Text>
                )}
              </Animated.View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="programs" />
      <Tabs.Screen name="currentlift" />
      <Tabs.Screen name="logs" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  floatingContainer: {
    position: "absolute",
    bottom: 24,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: "box-none",
  },
  barPill: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    width: 330,
    height: 56,
    paddingHorizontal: 12,
    borderRadius: 28,
    backgroundColor: "#161616",
    borderWidth: 1,
    borderColor: "#2c2c2c",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
  },
  activePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#f6a800",
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 18,
  },
  activeLabel: {
    fontFamily: "BebasNeue",
    fontSize: 15,
    color: "#0a0a0a",
    letterSpacing: 0.5,
  },
  inactiveItem: {
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
  },
});
