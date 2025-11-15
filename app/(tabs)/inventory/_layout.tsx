import { useThemedColors } from "@/src/styles/globalStyles";
import { Stack } from "expo-router";

export default function InventoryLayout() {
  const colors = useThemedColors();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.headerBackground },
        headerTintColor: colors.headerText,
        headerTitleAlign: "left",
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Inventory",
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          headerTitle: "",
          headerBackTitle: "",
        }}
      />
    </Stack>
  );
}
