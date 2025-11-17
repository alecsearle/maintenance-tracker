import { useThemedColors } from "@/src/styles/globalStyles";
import { StyleSheet, Text, View } from "react-native";
import ManualSession from "./ManualSession";
import StopWatch from "./StopWatch";

interface SessionManagementProps {
  toolId: string;
  onSessionSave?: (sessionData: any) => void;
}

const SessionManagement = ({ toolId, onSessionSave }: SessionManagementProps) => {
  const colors = useThemedColors();

  const handleStopWatchUpdate = (seconds: number) => {
    // Handle real-time updates from stopwatch if needed
    console.log("Stopwatch time:", seconds);
  };

  const handleManualSessionSave = (sessionData: {
    date: string;
    hours: number;
    minutes: number;
    seconds: number;
    totalSeconds: number;
    note: string;
  }) => {
    if (onSessionSave) {
      onSessionSave(sessionData);
    }
    console.log("Manual session saved:", sessionData);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerText, { color: colors.text }]}>Session Tracking</Text>
        <Text style={[styles.subText, { color: colors.softText }]}>Track your tool usage time</Text>
      </View>

      {/* Stopwatch Section with Manual Session Button */}
      <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <StopWatch toolId={toolId} onTimeUpdate={handleStopWatchUpdate} />

        {/* Discrete Manual Session Button */}
        <View style={[styles.manualButtonContainer, { borderTopColor: colors.border }]}>
          <ManualSession onSave={handleManualSessionSave} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  header: {
    marginBottom: 16,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
  },
  subText: {
    fontSize: 14,
    fontWeight: "400",
  },
  section: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 20,
  },
  manualButtonContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
  },
});

export default SessionManagement;
