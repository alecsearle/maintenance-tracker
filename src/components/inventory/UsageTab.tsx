import { useThemedColors } from "@/src/styles/globalStyles";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

interface UsageSession {
  id: string;
  date: string;
  duration: string;
  hours: number;
  note?: string;
}

interface UsageTabProps {
  toolId: string;
}

// Sample data - replace with actual data from storage
const SAMPLE_SESSIONS: UsageSession[] = [
  {
    id: "1",
    date: "Nov 14, 2025",
    duration: "2h 30m",
    hours: 2.5,
    note: "Deck construction project",
  },
  {
    id: "2",
    date: "Nov 12, 2025",
    duration: "1h 15m",
    hours: 1.25,
    note: "Cabinet installation",
  },
  {
    id: "3",
    date: "Nov 10, 2025",
    duration: "3h 45m",
    hours: 3.75,
  },
  {
    id: "4",
    date: "Nov 8, 2025",
    duration: "0h 45m",
    hours: 0.75,
    note: "Quick repair work",
  },
];

const UsageTab = ({ toolId }: UsageTabProps) => {
  const colors = useThemedColors();
  const [sessions] = useState<UsageSession[]>(SAMPLE_SESSIONS);
  const [selectedFilter, setSelectedFilter] = useState<"all" | "week" | "month">("all");

  const totalHours = sessions.reduce((sum, session) => sum + session.hours, 0);

  return (
    <View style={styles.container}>
      {/* Summary Card */}
      <View
        style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.border }]}
      >
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryValue, { color: colors.text }]}>{sessions.length}</Text>
            <Text style={[styles.summaryLabel, { color: colors.softText }]}>Sessions</Text>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryValue, { color: colors.text }]}>
              {totalHours.toFixed(1)}h
            </Text>
            <Text style={[styles.summaryLabel, { color: colors.softText }]}>Total Time</Text>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryValue, { color: colors.text }]}>
              {(totalHours / sessions.length).toFixed(1)}h
            </Text>
            <Text style={[styles.summaryLabel, { color: colors.softText }]}>Avg/Session</Text>
          </View>
        </View>
      </View>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        <Pressable
          style={[
            styles.filterButton,
            selectedFilter === "all" && { backgroundColor: colors.accent },
            { borderColor: colors.border },
          ]}
          onPress={() => setSelectedFilter("all")}
        >
          <Text
            style={[styles.filterText, { color: selectedFilter === "all" ? "#fff" : colors.text }]}
          >
            All Time
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.filterButton,
            selectedFilter === "week" && { backgroundColor: colors.accent },
            { borderColor: colors.border },
          ]}
          onPress={() => setSelectedFilter("week")}
        >
          <Text
            style={[styles.filterText, { color: selectedFilter === "week" ? "#fff" : colors.text }]}
          >
            This Week
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.filterButton,
            selectedFilter === "month" && { backgroundColor: colors.accent },
            { borderColor: colors.border },
          ]}
          onPress={() => setSelectedFilter("month")}
        >
          <Text
            style={[
              styles.filterText,
              { color: selectedFilter === "month" ? "#fff" : colors.text },
            ]}
          >
            This Month
          </Text>
        </Pressable>
      </View>

      {/* Session List */}
      <ScrollView style={styles.sessionList} contentContainerStyle={styles.sessionListContent}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Usage History</Text>
        {sessions.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: colors.softText }]}>No sessions recorded</Text>
          </View>
        ) : (
          sessions.map((session) => (
            <View
              key={session.id}
              style={[
                styles.sessionCard,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <View style={styles.sessionHeader}>
                <Text style={[styles.sessionDate, { color: colors.text }]}>{session.date}</Text>
                <Text style={[styles.sessionDuration, { color: colors.accent }]}>
                  {session.duration}
                </Text>
              </View>
              {session.note && (
                <Text style={[styles.sessionNote, { color: colors.softText }]}>{session.note}</Text>
              )}
            </View>
          ))
        )}
      </ScrollView>

      {/* Export Button */}
      <Pressable
        style={[styles.exportButton, { backgroundColor: colors.card, borderColor: colors.border }]}
      >
        <Text style={[styles.exportButtonText, { color: colors.accent }]}>Export Data</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  summaryCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryItem: {
    flex: 1,
    alignItems: "center",
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: "500",
  },
  divider: {
    width: 1,
    height: 40,
    marginHorizontal: 8,
  },
  filterContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
  },
  filterText: {
    fontSize: 14,
    fontWeight: "600",
  },
  sessionList: {
    flex: 1,
  },
  sessionListContent: {
    paddingBottom: 80,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
  },
  sessionCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  sessionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  sessionDate: {
    fontSize: 14,
    fontWeight: "600",
  },
  sessionDuration: {
    fontSize: 16,
    fontWeight: "700",
  },
  sessionNote: {
    fontSize: 13,
    marginTop: 4,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 14,
  },
  exportButton: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
  },
  exportButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});

export default UsageTab;
