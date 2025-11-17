import { StyleSheet, Text, View } from "react-native";

export default function MaintainScreen() {
  return (
    <View style={styles.container}>
      <Text>Tab [MAINTAIN]</Text>
      <Text>Create a dashboard at the top</Text>
      <Text>Display tools needing maintenance</Text>
      <Text>Show upcoming maintenance</Text>
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
