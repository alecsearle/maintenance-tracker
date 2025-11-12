import { StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text>Tab [HOME]</Text>
      <Text>Create a dashboard at the top</Text>
      <Text>Display key metrics and insights</Text>
      <Text>Show all tools</Text>
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
