import { StyleSheet, useColorScheme } from "react-native";

export const lightColors = {
  primary: "#3A3A3A",
  secondary: "#E5E5E5",
  background: "#F8F8F8",
  text: "#1A1A1A",
  softText: "#c4c4c4",
  card: "#FFFFFF",
  accent: "#8BBBBA",
  accentMinimal: "#D6F0F0",
  border: "#E0E0E0",
  headerBackground: "#FFFFFF",
  headerText: "#1A1A1A",
  tabActive: "#1A1A1A",
  tabInactive: "rgba(0, 0, 0, 0.5)",
  // Session button colors
  green: "#7CB342",
  greenBg: "#F1F8E9",
  yellow: "#FFA726",
  yellowBg: "#FFF8E1",
  red: "#E57373",
  redBg: "#FFF5F5",
};

export const darkColors = {
  primary: "#E5E5E5",
  secondary: "#3A3A3A",
  background: "#1A1A1A",
  text: "#FFFFFF",
  softText: "#c4c4c4",
  card: "#2C2C2C",
  accent: "#8BBBBA",
  accentMinimal: "#D6F0F0",
  border: "#333333",
  headerBackground: "#2C2C2C",
  headerText: "#FFFFFF",
  tabActive: "#FFFFFF",
  tabInactive: "rgba(255, 255, 255, 0.6)",
  // Session button colors
  green: "#2E7D32",
  greenBg: "#A5D6A7",
  yellow: "#F57C00",
  yellowBg: "#FFCC80",
  red: "#C62828",
  redBg: "#EF9A9A",
};

export const useThemedColors = () => {
  const scheme = useColorScheme();
  return scheme === "dark" ? darkColors : lightColors;
};

interface Colors {
  primary: string;
  background: string;
  text: string;
  card: string;
  accent: string;
  border: string;
  headerBackground: string;
  headerText: string;
  tabActive: string;
  tabInactive: string;
}

export const globalStyles = (colors: Colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 16,
    },
    title: {
      fontSize: 24,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 8,
    },
    subTitle: {
      fontSize: 18,
      fontWeight: "500",
      color: colors.text,
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
    },
    text: {
      fontSize: 16,
      color: colors.text,
      marginBottom: 12,
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 10,
      padding: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    button: {
      backgroundColor: colors.primary,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: "center",
    },
    buttonText: {
      color: colors.text,
      fontWeight: "600",
    },
  });
