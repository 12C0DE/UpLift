import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

const TabsLayout = () => {
    return (
        <Tabs screenOptions={{
            headerShown: false
        }}>
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
    )
}

export default TabsLayout;