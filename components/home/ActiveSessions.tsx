import PlatformIcon from "@/components/PlatformIcon";
import { globalStyles, useThemedColors } from "@/styles/globalStyles";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface ActiveSession {
  toolId: string;
  toolName: string;
  brand: string;
  category: string;
  elapsedTime: string;
  isRunning: boolean;
}

interface MaintenanceAlert {
  id: string;
  toolName: string;
  type: "overdue" | "due_soon";
  message: string;
  daysOverdue?: number;
}

// Sample data - replace with actual data from storage
const SAMPLE_ACTIVE_SESSIONS: ActiveSession[] = [
  {
    toolId: "1",
    toolName: "Chainsaw",
    brand: "Stihl",
    category: "Gas Powered Tools",
    elapsedTime: "02:34:12",
    isRunning: true,
  },
  {
    toolId: "3",
    toolName: "Mulcher",
    brand: "Fecon",
    category: "Gas Powered Tools",
    elapsedTime: "00:45:30",
    isRunning: false,
  },
];

const SAMPLE_ALERTS: MaintenanceAlert[] = [
  {
    id: "1",
    toolName: "Chainsaw",
    type: "overdue",
    message: "Maintenance overdue by 15 days",
    daysOverdue: 15,
  },
  {
    id: "2",
    toolName: "Wood Chipper",
    type: "due_soon",
    message: "Maintenance due in 3 days",
  },
  {
    id: "3",
    toolName: "Hydraulic Jack",
    type: "overdue",
    message: "Safety inspection overdue by 7 days",
    daysOverdue: 7,
  },
];

const ActiveSessions = () => {
  const colors = useThemedColors();
  const styles = globalStyles(colors);
  const router = useRouter();
  const [activeSessions] = useState<ActiveSession[]>(SAMPLE_ACTIVE_SESSIONS);
  const [alerts] = useState<MaintenanceAlert[]>(SAMPLE_ALERTS);

  // Sample stats - replace with actual data
  const totalTools = 12;
  const dueSoon = 3;
  const overdue = 2;

  const handleToolPress = (toolId: string) => {
    router.push(`/inventory/${toolId}` as any);
  };

  const handleViewAllActive = () => {
    // Navigate to a view of all active sessions or inventory filtered by active
    router.push("/inventory");
  };

  return (
    <>
      {activeSessions.length > 0 && (
        <View style={localStyles.section}>
          <View style={localStyles.sectionHeader}>
            <Text style={[localStyles.sectionTitle, { color: colors.text }]}>Active Sessions</Text>
            <Pressable onPress={handleViewAllActive}>
              <Text style={[localStyles.viewAllText, { color: colors.accent }]}>View All</Text>
            </Pressable>
          </View>

          {activeSessions.map((session) => (
            <Pressable
              key={session.toolId}
              style={[
                localStyles.sessionCard,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
              onPress={() => handleToolPress(session.toolId)}
            >
              <View style={localStyles.sessionHeader}>
                <View style={{ flex: 1 }}>
                  <View style={localStyles.sessionTitleRow}>
                    <Text style={[localStyles.sessionToolName, { color: colors.text }]}>
                      {session.toolName}
                    </Text>
                    {session.isRunning && (
                      <View
                        style={[localStyles.runningIndicator, { backgroundColor: colors.green }]}
                      />
                    )}
                  </View>
                  <Text style={[localStyles.sessionBrand, { color: colors.softText }]}>
                    {session.brand} • {session.category}
                  </Text>
                </View>
                <PlatformIcon
                  iosName="chevron.right"
                  androidName="chevron-right"
                  name="chevron-right"
                  color={colors.softText}
                  size={20}
                />
              </View>

              <View style={localStyles.sessionFooter}>
                <View style={localStyles.timeContainer}>
                  <PlatformIcon
                    iosName="clock"
                    androidName="schedule"
                    name="clock"
                    color={colors.accent}
                    size={16}
                  />
                  <Text style={[localStyles.sessionTime, { color: colors.accent }]}>
                    {session.elapsedTime}
                  </Text>
                </View>

                <View style={localStyles.quickActions}>
                  <Pressable
                    style={[
                      localStyles.quickActionButton,
                      {
                        backgroundColor: session.isRunning ? colors.yellowBg : colors.accentMinimal,
                        borderColor: session.isRunning ? colors.yellow : colors.accent,
                      },
                    ]}
                    onPress={(e) => {
                      e.stopPropagation();
                      // Handle pause/resume
                    }}
                  >
                    <PlatformIcon
                      iosName={session.isRunning ? "pause.fill" : "play.fill"}
                      androidName={session.isRunning ? "pause" : "play-arrow"}
                      name={session.isRunning ? "pause" : "play"}
                      color={session.isRunning ? colors.yellow : colors.accent}
                      size={16}
                    />
                  </Pressable>
                  <Pressable
                    style={[
                      localStyles.quickActionButton,
                      { backgroundColor: colors.redBg, borderColor: colors.red },
                    ]}
                    onPress={(e) => {
                      e.stopPropagation();
                      // Handle stop
                    }}
                  >
                    <PlatformIcon
                      iosName="stop.fill"
                      androidName="stop"
                      name="stop"
                      color={colors.red}
                      size={16}
                    />
                  </Pressable>
                </View>
              </View>
            </Pressable>
          ))}
        </View>
      )}
    </>
  );
};

const localStyles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: "600",
  },
  sessionCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  sessionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sessionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  sessionToolName: {
    fontSize: 16,
    fontWeight: "600",
  },
  runningIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  sessionBrand: {
    fontSize: 13,
  },
  sessionFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  sessionTime: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "monospace",
  },
  quickActions: {
    flexDirection: "row",
    gap: 8,
  },
  quickActionButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  alertCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    marginBottom: 12,
  },
  alertContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  alertToolName: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 2,
  },
  alertMessage: {
    fontSize: 13,
    fontWeight: "500",
  },
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

export default ActiveSessions;
