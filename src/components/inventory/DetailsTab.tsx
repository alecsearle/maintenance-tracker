import UsageStatistics from "@/src/components/inventory/UsageStatistics";
import SessionManagement from "@/src/components/session/SessionManagement";
import { useThemedColors } from "@/src/styles/globalStyles";
import { ScrollView, StyleSheet, Text, View } from "react-native";

interface DetailsTabProps {
  toolId: string;
}

const DetailsTab = ({ toolId }: DetailsTabProps) => {
  const colors = useThemedColors();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Session Tracking */}
      <SessionManagement toolId={toolId} />

      {/* Quick Stats */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Stats</Text>
        <UsageStatistics
          totalHours={0}
          hoursSinceService={0}
          totalSessions={0}
          avgHoursPerSession={0}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
  },
});

export default DetailsTab;
