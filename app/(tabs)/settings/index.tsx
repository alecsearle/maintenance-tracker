import { StyleSheet, Text, View } from "react-native";

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text>Tab [SETTINGS]</Text>
      <Text>Create user settings</Text>
      <Text>Manage preferences</Text>
      <Text>Account information</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
