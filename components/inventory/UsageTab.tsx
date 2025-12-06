import { useThemedColors } from "@/styles/globalStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import PlatformIcon from "../PlatformIcon";

interface UsageSession {
  id: string;
  date: string;
  timestamp: number;
  duration: string;
  hours: number;
  note?: string;
  source?: "stopwatch" | "manual";
}

interface UsageTabProps {
  toolId: string;
}

const UsageTab = ({ toolId }: UsageTabProps) => {
  const colors = useThemedColors();
  const [sessions, setSessions] = useState<UsageSession[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<"all" | "week" | "month">("all");
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingSession, setEditingSession] = useState<UsageSession | null>(null);
  const [editDate, setEditDate] = useState(new Date());
  const [editHours, setEditHours] = useState("0");
  const [editMinutes, setEditMinutes] = useState("0");
  const [editSeconds, setEditSeconds] = useState("0");
  const [editNote, setEditNote] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Load sessions when tab comes into focus
  useFocusEffect(
    useCallback(() => {
      loadSessions();
    }, [toolId])
  );

  const loadSessions = async () => {
    try {
      const sessionsJson = await AsyncStorage.getItem(`@sessions_${toolId}`);
      if (sessionsJson) {
        const loadedSessions: UsageSession[] = JSON.parse(sessionsJson);
        setSessions(loadedSessions);
      } else {
        setSessions([]);
      }
    } catch (error) {
      console.error("Error loading sessions:", error);
      setSessions([]);
    }
  };

  // Filter sessions based on selected time period
  const filteredSessions = useMemo(() => {
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    const oneWeek = 7 * oneDay;

    // Get start of current week (Sunday)
    const startOfWeek = new Date();
    startOfWeek.setHours(0, 0, 0, 0);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    const weekStart = startOfWeek.getTime();

    // Get start of current month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const monthStart = startOfMonth.getTime();

    switch (selectedFilter) {
      case "week":
        return sessions.filter((session) => session.timestamp >= weekStart);
      case "month":
        return sessions.filter((session) => session.timestamp >= monthStart);
      case "all":
      default:
        return sessions;
    }
  }, [sessions, selectedFilter]);

  const totalHours = useMemo(() => {
    return filteredSessions.reduce((sum, session) => sum + session.hours, 0);
  }, [filteredSessions]);

  const avgHours = useMemo(() => {
    return filteredSessions.length > 0 ? totalHours / filteredSessions.length : 0;
  }, [totalHours, filteredSessions.length]);

  const handleSessionPress = (session: UsageSession) => {
    setEditingSession(session);
    setEditDate(new Date(session.timestamp));

    // Convert hours to h:m:s
    const totalSeconds = Math.floor(session.hours * 3600);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    setEditHours(hours.toString());
    setEditMinutes(minutes.toString());
    setEditSeconds(seconds.toString());
    setEditNote(session.note || "");
    setEditModalVisible(true);
  };

  const handleDateChange = (event: any, date?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (date) {
      setEditDate(date);
    }
  };

  const handleNumberInput = (value: string, setter: (value: string) => void, max: number) => {
    const numValue = value.replace(/[^0-9]/g, "");
    const parsed = parseInt(numValue) || 0;
    if (parsed > max) {
      setter(max.toString());
    } else {
      setter(numValue);
    }
  };

  const handleSaveEdit = async () => {
    if (!editingSession) return;

    const h = parseInt(editHours) || 0;
    const m = parseInt(editMinutes) || 0;
    const s = parseInt(editSeconds) || 0;
    const totalSeconds = h * 3600 + m * 60 + s;

    if (totalSeconds === 0) {
      Alert.alert("Invalid Time", "Please enter a valid time duration.");
      return;
    }

    // Format duration string
    let duration = "";
    if (h > 0) {
      duration += `${h}h `;
    }
    if (m > 0 || h > 0) {
      duration += `${m}m`;
    }
    if (h === 0 && m === 0) {
      duration += `${s}s`;
    }
    duration = duration.trim();

    const updatedSession: UsageSession = {
      ...editingSession,
      date: editDate.toLocaleDateString(),
      timestamp: editDate.getTime(),
      duration: duration,
      hours: totalSeconds / 3600,
      note: editNote.trim() || undefined,
    };

    try {
      // Update sessions array
      const updatedSessions = sessions
        .map((session) => (session.id === editingSession.id ? updatedSession : session))
        .sort((a, b) => b.timestamp - a.timestamp);

      // Save to AsyncStorage
      await AsyncStorage.setItem(`@sessions_${toolId}`, JSON.stringify(updatedSessions));

      // Update state
      setSessions(updatedSessions);
      setEditModalVisible(false);
      setEditingSession(null);
    } catch (error) {
      console.error("Failed to update session:", error);
      Alert.alert("Error", "Failed to update session. Please try again.");
    }
  };

  const handleDeleteSession = async () => {
    if (!editingSession) return;

    Alert.alert("Delete Session", "Are you sure you want to delete this session?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const updatedSessions = sessions.filter((session) => session.id !== editingSession.id);
            await AsyncStorage.setItem(`@sessions_${toolId}`, JSON.stringify(updatedSessions));
            setSessions(updatedSessions);
            setEditModalVisible(false);
            setEditingSession(null);
          } catch (error) {
            console.error("Failed to delete session:", error);
            Alert.alert("Error", "Failed to delete session. Please try again.");
          }
        },
      },
    ]);
  };

  const handleCancelEdit = () => {
    setEditModalVisible(false);
    setEditingSession(null);
  };

  return (
    <View style={styles.container}>
      {/* Summary Card */}
      <View
        style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.border }]}
      >
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryValue, { color: colors.text }]}>
              {filteredSessions.length}
            </Text>
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
              {avgHours.toFixed(1)}h
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
        {filteredSessions.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: colors.softText }]}>
              {sessions.length === 0 ? "No sessions recorded" : "No sessions in this period"}
            </Text>
          </View>
        ) : (
          filteredSessions.map((session) => (
            <Pressable
              key={session.id}
              style={[
                styles.sessionCard,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
              onPress={() => handleSessionPress(session)}
            >
              <View style={styles.sessionHeader}>
                <View style={styles.sessionDateContainer}>
                  <Text style={[styles.sessionDate, { color: colors.text }]}>{session.date}</Text>
                  {session.source && (
                    <View
                      style={[
                        styles.sourceBadge,
                        {
                          backgroundColor:
                            session.source === "stopwatch" ? colors.accent + "20" : colors.yellowBg,
                        },
                      ]}
                    >
                      <PlatformIcon
                        iosName={session.source === "stopwatch" ? "timer" : "pencil"}
                        androidName={session.source === "stopwatch" ? "timer" : "edit"}
                        name={session.source === "stopwatch" ? "timer" : "edit"}
                        size={10}
                        color={session.source === "stopwatch" ? colors.accent : colors.yellow}
                      />
                      <Text
                        style={[
                          styles.sourceText,
                          {
                            color: session.source === "stopwatch" ? colors.accent : colors.yellow,
                          },
                        ]}
                      >
                        {session.source === "stopwatch" ? "Auto" : "Manual"}
                      </Text>
                    </View>
                  )}
                </View>
                <Text style={[styles.sessionDuration, { color: colors.accent }]}>
                  {session.duration}
                </Text>
              </View>
              {session.note && (
                <Text style={[styles.sessionNote, { color: colors.softText }]}>{session.note}</Text>
              )}
            </Pressable>
          ))
        )}
      </ScrollView>

      {/* Edit Session Modal */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleCancelEdit}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={[styles.modalContainer, { backgroundColor: colors.background }]}
        >
          {/* Modal Header */}
          <View
            style={[
              styles.modalHeader,
              { backgroundColor: colors.card, borderBottomColor: colors.border },
            ]}
          >
            <Pressable onPress={handleCancelEdit} style={styles.cancelButton}>
              <PlatformIcon
                iosName="xmark"
                androidName="close"
                name="close"
                size={24}
                color={colors.text}
              />
            </Pressable>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Edit Session</Text>
            <Pressable onPress={handleDeleteSession} style={styles.deleteButton}>
              <PlatformIcon
                iosName="trash"
                androidName="delete"
                name="delete"
                size={22}
                color={colors.red}
              />
            </Pressable>
          </View>

          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.modalContent}>
              {/* Date Picker */}
              <View style={styles.section}>
                <Text style={[styles.label, { color: colors.text }]}>Date</Text>
                <Pressable
                  style={[
                    styles.dateButton,
                    { backgroundColor: colors.card, borderColor: colors.border },
                  ]}
                  onPress={() => setShowDatePicker(true)}
                >
                  <PlatformIcon
                    iosName="calendar"
                    androidName="event"
                    name="event"
                    size={20}
                    color={colors.text}
                  />
                  <Text style={[styles.dateText, { color: colors.text }]}>
                    {editDate.toLocaleDateString()}
                  </Text>
                </Pressable>

                {showDatePicker && (
                  <DateTimePicker
                    value={editDate}
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={handleDateChange}
                    maximumDate={new Date()}
                  />
                )}
              </View>

              {/* Time Input */}
              <View style={styles.section}>
                <Text style={[styles.label, { color: colors.text }]}>Duration</Text>
                <View style={styles.timeInputContainer}>
                  <View style={styles.timeInputGroup}>
                    <TextInput
                      style={[
                        styles.timeInput,
                        {
                          backgroundColor: colors.card,
                          borderColor: colors.border,
                          color: colors.text,
                        },
                      ]}
                      value={editHours}
                      onChangeText={(value) => handleNumberInput(value, setEditHours, 99)}
                      keyboardType="number-pad"
                      maxLength={2}
                      placeholder="0"
                      placeholderTextColor={colors.border}
                    />
                    <Text style={[styles.timeLabel, { color: colors.border }]}>hours</Text>
                  </View>

                  <Text style={[styles.timeSeparator, { color: colors.text }]}>:</Text>

                  <View style={styles.timeInputGroup}>
                    <TextInput
                      style={[
                        styles.timeInput,
                        {
                          backgroundColor: colors.card,
                          borderColor: colors.border,
                          color: colors.text,
                        },
                      ]}
                      value={editMinutes}
                      onChangeText={(value) => handleNumberInput(value, setEditMinutes, 59)}
                      keyboardType="number-pad"
                      maxLength={2}
                      placeholder="0"
                      placeholderTextColor={colors.border}
                    />
                    <Text style={[styles.timeLabel, { color: colors.border }]}>minutes</Text>
                  </View>

                  <Text style={[styles.timeSeparator, { color: colors.text }]}>:</Text>

                  <View style={styles.timeInputGroup}>
                    <TextInput
                      style={[
                        styles.timeInput,
                        {
                          backgroundColor: colors.card,
                          borderColor: colors.border,
                          color: colors.text,
                        },
                      ]}
                      value={editSeconds}
                      onChangeText={(value) => handleNumberInput(value, setEditSeconds, 59)}
                      keyboardType="number-pad"
                      maxLength={2}
                      placeholder="0"
                      placeholderTextColor={colors.border}
                    />
                    <Text style={[styles.timeLabel, { color: colors.border }]}>seconds</Text>
                  </View>
                </View>
              </View>

              {/* Note Input */}
              <View style={styles.section}>
                <Text style={[styles.label, { color: colors.text }]}>
                  Note <Text style={{ color: colors.border }}>(optional)</Text>
                </Text>
                <TextInput
                  style={[
                    styles.noteInput,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                      color: colors.text,
                    },
                  ]}
                  value={editNote}
                  onChangeText={setEditNote}
                  placeholder="Add notes about this session..."
                  placeholderTextColor={colors.border}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>

              {/* Save Button */}
              <Pressable
                style={[
                  styles.saveButton,
                  {
                    backgroundColor: colors.accent,
                    opacity:
                      parseInt(editHours) === 0 &&
                      parseInt(editMinutes) === 0 &&
                      parseInt(editSeconds) === 0
                        ? 0.5
                        : 1,
                  },
                ]}
                onPress={handleSaveEdit}
                disabled={
                  parseInt(editHours) === 0 &&
                  parseInt(editMinutes) === 0 &&
                  parseInt(editSeconds) === 0
                }
              >
                <PlatformIcon
                  iosName="checkmark.circle.fill"
                  androidName="check-circle"
                  name="check-circle"
                  size={20}
                  color={colors.card}
                />
                <Text style={[styles.saveButtonText, { color: colors.card }]}>Save Changes</Text>
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>

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
    paddingBottom: 100,
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
  sessionDateContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  sessionDate: {
    fontSize: 14,
    fontWeight: "600",
  },
  sourceBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 6,
  },
  sourceText: {
    fontSize: 10,
    fontWeight: "600",
    textTransform: "uppercase",
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
  // Modal styles
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  cancelButton: {
    padding: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  deleteButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  modalContent: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
  },
  dateText: {
    fontSize: 16,
  },
  timeInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  timeInputGroup: {
    alignItems: "center",
  },
  timeInput: {
    width: 70,
    height: 70,
    fontSize: 32,
    fontWeight: "600",
    textAlign: "center",
    borderRadius: 10,
    borderWidth: 1,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
  timeLabel: {
    fontSize: 11,
    fontWeight: "500",
    marginTop: 4,
  },
  timeSeparator: {
    fontSize: 32,
    fontWeight: "600",
    marginBottom: 20,
  },
  noteInput: {
    height: 100,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    fontSize: 16,
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: "600",
  },
});

export default UsageTab;
