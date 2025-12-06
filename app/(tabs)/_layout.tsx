import PlatformIcon from "@/components/PlatformIcon";
import { useThemedColors } from "@/styles/globalStyles";
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
        headerStyle: { backgroundColor: colors.headerBackground },
        headerTintColor: colors.headerText,
        tabBarActiveTintColor: colors.tabActive,
        tabBarInactiveTintColor: colors.tabInactive,

        // Make the tab bar glassy on iOS
        tabBarBackground: () =>
          Platform.OS === "ios" ? (
            <BlurView tint={isDark ? "dark" : "light"} intensity={80} style={{ flex: 1 }} />
          ) : null,
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
        },
      }}
    >
      <Tabs.Screen
        name="index"
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
          headerShown: false,
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
              iosName="wrench.adjustable"
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
