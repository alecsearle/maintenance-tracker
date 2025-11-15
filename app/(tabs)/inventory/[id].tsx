import ToolDetails from "@/src/components/inventory/ToolDetails";
import { globalStyles, useThemedColors } from "@/src/styles/globalStyles";
import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";

export default function ToolDetailScreen() {
  const colors = useThemedColors();
  const styles = globalStyles(colors);
  const params = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <ToolDetails params={params} />
    </View>
  );
}
