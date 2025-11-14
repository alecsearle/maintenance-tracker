import PlatformIcon from "@/src/components/PlatformIcon";
import { useThemedColors } from "@/src/styles/globalStyles";
import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";
import { Platform, useColorScheme } from "react-native";

export default function TabLayout() {
  const colors = useThemedColors();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.tabActive,
        tabBarInactiveTintColor: colors.tabInactive,

        // Make the tab bar glassy on iOS
        tabBarBackground: () =>
          Platform.OS === "ios" ? (
            <BlurView tint={isDark ? "dark" : "light"} intensity={80} style={{ flex: 1 }} />
          ) : null,

        // Make tab bar translucent
        tabBarStyle: {
          position: "absolute",
          backgroundColor:
            Platform.OS === "ios"
              ? isDark
                ? "rgba(44, 44, 44, 0.3)"
                : "rgba(255, 255, 255, 0.3)"
              : isDark
              ? "#2C2C2C"
              : "#FFFFFF",
          borderTopWidth: 0,
          elevation: 0,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <PlatformIcon
              iosName="house"
              androidName="home"
              name="home"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="inventory"
        options={{
          title: "Inventory",
          tabBarIcon: ({ color, size }) => (
            <PlatformIcon
              iosName="shippingbox"
              androidName="construct"
              name="construct"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="maintain"
        options={{
          title: "Maintain",
          tabBarIcon: ({ color, size }) => (
            <PlatformIcon
              iosName="hammer"
              androidName="build"
              name="build"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => (
            <PlatformIcon
              iosName="gear"
              androidName="settings"
              name="settings"
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Tabs>
  );
}
