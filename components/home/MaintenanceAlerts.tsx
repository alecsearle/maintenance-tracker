import PlatformIcon from "@/components/PlatformIcon";
import { useThemedColors } from "@/styles/globalStyles";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface MaintenanceAlert {
  id: string;
  toolName: string;
  type: "overdue" | "due_soon";
  message: string;
  daysOverdue?: number;
}

// Sample data - replace with actual data from storage
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

const MaintenanceAlerts = () => {
  const colors = useThemedColors();
  const [alerts] = useState<MaintenanceAlert[]>(SAMPLE_ALERTS);

  if (alerts.length === 0) {
    return null;
  }

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Maintenance Alerts</Text>

      {alerts.map((alert) => (
        <Pressable
          key={alert.id}
          style={[
            styles.alertCard,
            {
              // backgroundColor: alert.type === "overdue" ? colors.redBg : colors.yellowBg,
              borderColor: alert.type === "overdue" ? colors.red : colors.yellow,
            },
          ]}
          onPress={() => {
            // Navigate to tool maintenance tab
          }}
        >
          <View style={styles.alertContent}>
            <PlatformIcon
              iosName={alert.type === "overdue" ? "exclamationmark.circle.fill" : "clock.fill"}
              androidName="warning"
              name="warning"
              color={alert.type === "overdue" ? colors.red : colors.yellow}
              size={20}
            />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text
                style={[
                  styles.alertToolName,
                  { color: alert.type === "overdue" ? colors.red : colors.yellow },
                ]}
              >
                {alert.toolName}
              </Text>
              <Text
                style={[
                  styles.alertMessage,
                  { color: alert.type === "overdue" ? colors.red : colors.yellow },
                ]}
              >
                {alert.message}
              </Text>
            </View>
            <PlatformIcon
              iosName="chevron.right"
              androidName="chevron-right"
              name="chevron-right"
              color={alert.type === "overdue" ? colors.red : colors.yellow}
              size={20}
            />
          </View>
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
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
});

export default MaintenanceAlerts;
