import { useThemedColors } from "@/styles/globalStyles";
import { StyleSheet, Text, TextStyle } from "react-native";

interface SubTitleProps {
  children: React.ReactNode;
  fontSize?: number;
  marginBottom?: number;
  color?: string;
  style?: TextStyle | TextStyle[];
}

export default function SubTitle({
  children,
  fontSize = 14,
  marginBottom = 0,
  color,
  style,
}: SubTitleProps) {
  const colors = useThemedColors();

  return (
    <Text
      style={[styles.subtitle, { fontSize, marginBottom, color: color || colors.softText }, style]}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  subtitle: {
    fontWeight: "400",
  },
});
