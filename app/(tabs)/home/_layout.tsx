import { useThemedColors } from "@/src/styles/globalStyles";
import { Stack } from "expo-router";

export default function HomeLayout() {
  const colors = useThemedColors();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.headerBackground },
        headerTintColor: colors.headerText,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Home",
        }}
      />
    </Stack>
  );
}
