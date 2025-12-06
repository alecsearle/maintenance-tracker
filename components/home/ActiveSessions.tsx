import PlatformIcon from "@/components/PlatformIcon";
import { globalStyles, useThemedColors } from "@/styles/globalStyles";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface Tool {
  id: string;
  name: string;
  brand: string;
  model: string;
  serialNumber: string;
  category: string;
  purchaseDate: string;
  nfcTag: string;
  manualUri: string;
  manualName: string;
}

interface ActiveSession {
  toolId: string;
  elapsedTime: string;
  isRunning: boolean;
}

interface ActiveSessionsProps {
  tools: Tool[];
  activeSessions: ActiveSession[];
}

const ActiveSessions = ({ tools, activeSessions }: ActiveSessionsProps) => {
  const colors = useThemedColors();
  const styles = globalStyles(colors);
  const router = useRouter();

  // Filter tools to only show those with active sessions
  const activeTools = tools.filter((tool) =>
    activeSessions.some((session) => session.toolId === tool.id)
  );

  // Get session data for a tool
  const getSessionForTool = (toolId: string) => {
    return activeSessions.find((session) => session.toolId === toolId);
  };

  const handleToolPress = (toolId: string, tool: Tool) => {
    router.push({
      pathname: "/inventory/[id]",
      params: {
        id: toolId,
        name: tool.name,
        brand: tool.brand,
        model: tool.model,
        serialNumber: tool.serialNumber,
        category: tool.category,
        purchaseDate: tool.purchaseDate,
        nfcTag: tool.nfcTag,
        manualUri: tool.manualUri,
        manualName: tool.manualName,
      },
    } as any);
  };

  const handleViewAllActive = () => {
    router.push("/inventory");
  };

  if (activeTools.length === 0) {
    return null;
  }

  return (
    <>
      {activeTools.length > 0 && (
        <View style={localStyles.section}>
          <View style={localStyles.sectionHeader}>
            <Text style={[localStyles.sectionTitle, { color: colors.text }]}>Active Sessions</Text>
            <Pressable onPress={handleViewAllActive}>
              <Text style={[localStyles.viewAllText, { color: colors.accent }]}>View All</Text>
            </Pressable>
          </View>

          {activeTools.map((tool) => {
            const session = getSessionForTool(tool.id);
            if (!session) return null;

            return (
              <Pressable
                key={tool.id}
                style={[
                  localStyles.sessionCard,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
                onPress={() => handleToolPress(tool.id, tool)}
              >
                <View style={localStyles.sessionHeader}>
                  <View style={{ flex: 1 }}>
                    <View style={localStyles.sessionTitleRow}>
                      <Text style={[localStyles.sessionToolName, { color: colors.text }]}>
                        {tool.name}
                      </Text>
                      {session.isRunning && (
                        <View
                          style={[localStyles.runningIndicator, { backgroundColor: colors.green }]}
                        />
                      )}
                    </View>
                    <Text style={[localStyles.sessionBrand, { color: colors.softText }]}>
                      {tool.brand} • {tool.category}
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
                          backgroundColor: session.isRunning
                            ? colors.yellowBg
                            : colors.accentMinimal,
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
            );
          })}
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
