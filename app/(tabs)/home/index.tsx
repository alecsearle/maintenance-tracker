import ActiveSessions from "@/src/components/home/ActiveSessions";
import MaintenanceAlerts from "@/src/components/home/MaintenanceAlerts";
import StatsCard from "@/src/components/home/StatsCard";
import PlatformIcon from "@/src/components/PlatformIcon";
import { globalStyles, useThemedColors } from "@/src/styles/globalStyles";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  const colors = useThemedColors();
  const styles = globalStyles(colors);

  return (
    <ScrollView
      style={[styles.container, { padding: 0 }]}
      contentContainerStyle={{ paddingBottom: 100 }}
      contentInsetAdjustmentBehavior="automatic"
    >
      <View style={{ padding: 16 }}>
        <StatsCard />

        <ActiveSessions />

        <MaintenanceAlerts />

        {/* Empty State */}
        <View style={localStyles.emptyState}>
          <PlatformIcon
            iosName="checkmark.circle"
            androidName="check-circle"
            name="check-circle"
            color={colors.green}
            size={64}
          />
          <Text style={[localStyles.emptyTitle, { color: colors.text }]}>All Caught Up!</Text>
          <Text style={[localStyles.emptyMessage, { color: colors.softText }]}>
            No maintenance alerts
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const localStyles = StyleSheet.create({
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    textAlign: "center",
  },
});
