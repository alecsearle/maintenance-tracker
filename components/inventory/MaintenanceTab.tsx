import PlatformIcon from "@/components/PlatformIcon";
import { useThemedColors } from "@/styles/globalStyles";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

interface MaintenanceLog {
  id: string;
  date: string;
  type: "service" | "repair" | "inspection";
  description: string;
  cost?: string;
}

interface MaintenanceTabProps {
  toolId: string;
  manualName?: string;
}

// Sample data - replace with actual data from storage
const SAMPLE_LOGS: MaintenanceLog[] = [
  {
    id: "1",
    date: "Nov 1, 2025",
    type: "service",
    description: "Oil change and blade sharpening",
    cost: "$45.00",
  },
  {
    id: "2",
    date: "Sep 15, 2025",
    type: "inspection",
    description: "Safety check and calibration",
  },
  {
    id: "3",
    date: "Jul 20, 2025",
    type: "repair",
    description: "Replaced worn motor brushes",
    cost: "$28.50",
  },
];

const MaintenanceTab = ({ toolId, manualName }: MaintenanceTabProps) => {
  const colors = useThemedColors();
  const [logs] = useState<MaintenanceLog[]>(SAMPLE_LOGS);
  const [showOverdueAlert] = useState(true);

  const getTypeColor = (type: MaintenanceLog["type"]) => {
    switch (type) {
      case "service":
        return colors.green;
      case "repair":
        return colors.yellow;
      case "inspection":
        return colors.accent;
      default:
        return colors.softText;
    }
  };

  const getTypeLabel = (type: MaintenanceLog["type"]) => {
    switch (type) {
      case "service":
        return "Service";
      case "repair":
        return "Repair";
      case "inspection":
        return "Inspection";
      default:
        return type;
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Maintenance Overdue Alert */}
      {showOverdueAlert && (
        <View
          style={[styles.alertCard, { backgroundColor: colors.redBg, borderColor: colors.red }]}
        >
          <View style={styles.alertHeader}>
            <PlatformIcon
              iosName="exclamationmark.circle.fill"
              androidName="warning"
              name="warning"
              color={colors.red}
              size={20}
            />
            <Text style={[styles.alertText, { color: colors.red }]}>Maintenance Overdue</Text>
          </View>
        </View>
      )}

      {/* Basic Information */}
      {/* <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.cardHeader}>
          <PlatformIcon
            iosName="info.circle"
            androidName="info"
            name="info"
            color={colors.accent}
            size={20}
          />
          <Text style={[styles.cardTitle, { color: colors.text }]}>Basic Information</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: colors.softText }]}>Category</Text>
          <Text style={[styles.infoValue, { color: colors.text }]}>Power Tools</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: colors.softText }]}>Serial Number</Text>
          <Text style={[styles.infoValue, { color: colors.text }]}>DW20240001</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: colors.softText }]}>Purchase Date</Text>
          <Text style={[styles.infoValue, { color: colors.text }]}>Oct 7, 2025</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: colors.softText }]}>NFC Tag ID</Text>
          <Text style={[styles.infoValue, { color: colors.text }]}>nfc-001</Text>
        </View>
      </View> */}

      {/* Maintenance History */}
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.cardHeader}>
          <PlatformIcon
            iosName="clock.fill"
            androidName="history"
            name="history"
            color={colors.accent}
            size={20}
          />
          <Text style={[styles.cardTitle, { color: colors.text }]}>Maintenance History</Text>
        </View>
        {logs.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: colors.softText }]}>
              No maintenance logs yet
            </Text>
          </View>
        ) : (
          logs.map((log) => (
            <View key={log.id} style={[styles.logItem, { borderColor: colors.border }]}>
              <View style={styles.logHeader}>
                <View
                  style={[styles.typeBadge, { backgroundColor: getTypeColor(log.type) + "20" }]}
                >
                  <Text style={[styles.typeText, { color: getTypeColor(log.type) }]}>
                    {getTypeLabel(log.type)}
                  </Text>
                </View>
                <Text style={[styles.logDate, { color: colors.softText }]}>{log.date}</Text>
              </View>
              <Text style={[styles.logDescription, { color: colors.text }]}>{log.description}</Text>
              {log.cost && (
                <Text style={[styles.logCost, { color: colors.softText }]}>Cost: {log.cost}</Text>
              )}
            </View>
          ))
        )}
        <Pressable style={[styles.addLogButton, { borderColor: colors.border }]}>
          <Text style={[styles.addLogButtonText, { color: colors.accent }]}>
            + Add Maintenance Log
          </Text>
        </Pressable>
      </View>

      {/* Maintenance Schedule */}
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.cardHeader}>
          <PlatformIcon
            iosName="calendar"
            androidName="calendar"
            name="calendar"
            color={colors.accent}
            size={20}
          />
          <Text style={[styles.cardTitle, { color: colors.text }]}>Maintenance Schedule</Text>
        </View>
        <Text style={[styles.scheduleText, { color: colors.softText }]}>
          Set up maintenance reminders and schedules
        </Text>
        <Pressable
          style={[
            styles.scheduleButton,
            { backgroundColor: colors.background, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.scheduleButtonText, { color: colors.accent }]}>
            Configure Schedule
          </Text>
        </Pressable>
      </View>

      {/* Maintenance Manual */}
      {manualName && (
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.cardHeader}>
            <PlatformIcon
              iosName="doc.text.fill"
              androidName="book"
              name="book"
              color={colors.accent}
              size={20}
            />
            <Text style={[styles.cardTitle, { color: colors.text }]}>Maintenance Manual</Text>
          </View>
          <Pressable
            style={[
              styles.manualButton,
              { backgroundColor: colors.background, borderColor: colors.border },
            ]}
          >
            <PlatformIcon
              iosName="doc.text"
              androidName="file"
              name="file"
              color={colors.accent}
              size={18}
            />
            <Text style={[styles.manualButtonText, { color: colors.accent }]}>
              View Manual (PDF)
            </Text>
            <PlatformIcon
              iosName="arrow.up.right"
              androidName="open-in-new"
              name="external-link"
              color={colors.accent}
              size={16}
            />
          </Pressable>
        </View>
      )}

      {/* Standard Operating Procedure */}
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.cardHeader}>
          <PlatformIcon
            iosName="list.clipboard"
            androidName="clipboard"
            name="clipboard"
            color={colors.accent}
            size={20}
          />
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            Standard Operating Procedure
          </Text>
        </View>
        <Pressable style={styles.sopButton}>
          <Text style={[styles.sopButtonText, { color: colors.accent }]}>+ Add SOP</Text>
        </Pressable>
      </View>

      {/* Warranty Information */}
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.cardHeader}>
          <PlatformIcon
            iosName="checkmark.seal.fill"
            androidName="verified"
            name="shield"
            color={colors.accent}
            size={20}
          />
          <Text style={[styles.cardTitle, { color: colors.text }]}>Warranty Information</Text>
        </View>
        <Text style={[styles.warrantyText, { color: colors.softText }]}>
          Add warranty details and expiration dates
        </Text>
        <Pressable style={styles.warrantyButton}>
          <Text style={[styles.warrantyButtonText, { color: colors.accent }]}>
            + Add Warranty Info
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 100,
  },
  alertCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  alertHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  alertText: {
    fontSize: 16,
    fontWeight: "600",
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "600",
  },
  manualButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  manualButtonText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
  },
  sopButton: {
    paddingVertical: 8,
  },
  sopButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  scheduleText: {
    fontSize: 13,
    marginBottom: 12,
  },
  scheduleButton: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
  },
  scheduleButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  logItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  logHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  typeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  logDate: {
    fontSize: 12,
    fontWeight: "500",
  },
  logDescription: {
    fontSize: 14,
    marginBottom: 4,
  },
  logCost: {
    fontSize: 13,
  },
  addLogButton: {
    marginTop: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 8,
    borderStyle: "dashed",
    alignItems: "center",
  },
  addLogButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 20,
  },
  emptyText: {
    fontSize: 14,
  },
  warrantyText: {
    fontSize: 13,
    marginBottom: 12,
  },
  warrantyButton: {
    paddingVertical: 8,
  },
  warrantyButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
});

export default MaintenanceTab;
