import { useThemedColors } from "@/styles/globalStyles";
import { StyleSheet, Text, TextStyle } from "react-native";

interface TitleProps {
  children: React.ReactNode;
  fontSize?: number;
  marginBottom?: number;
  color?: string;
  style?: TextStyle | TextStyle[];
}

export default function Title({
  children,
  fontSize = 18,
  marginBottom = 0,
  color,
  style,
}: TitleProps) {
  const colors = useThemedColors();

  return (
    <Text style={[styles.title, { fontSize, marginBottom, color: color || colors.text }, style]}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  title: {
    fontWeight: "700",
  },
});
