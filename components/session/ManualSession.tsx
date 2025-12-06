import { useThemedColors } from "@/styles/globalStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import {
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

interface ManualSessionProps {
  toolId: string;
  onSave?: (sessionData: {
    date: string;
    hours: number;
    minutes: number;
    seconds: number;
    totalSeconds: number;
    note: string;
  }) => void;
}

const ManualSession = ({ toolId, onSave }: ManualSessionProps) => {
  const colors = useThemedColors();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [hours, setHours] = useState("0");
  const [minutes, setMinutes] = useState("0");
  const [seconds, setSeconds] = useState("0");
  const [note, setNote] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (event: any, date?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleSave = async () => {
    const h = parseInt(hours) || 0;
    const m = parseInt(minutes) || 0;
    const s = parseInt(seconds) || 0;
    const totalSeconds = h * 3600 + m * 60 + s;

    if (totalSeconds === 0) {
      return; // Don't save if no time entered
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

    const timestamp = selectedDate.getTime();
    const newSession = {
      id: `session_${timestamp}_manual`,
      date: selectedDate.toLocaleDateString(),
      timestamp: timestamp,
      duration: duration,
      hours: totalSeconds / 3600, // Convert to decimal hours
      note: note.trim() || undefined,
      source: "manual",
    };

    try {
      // Load existing sessions
      const sessionsKey = `@sessions_${toolId}`;
      const existingSessionsJson = await AsyncStorage.getItem(sessionsKey);
      const existingSessions = existingSessionsJson ? JSON.parse(existingSessionsJson) : [];

      // Add new session and sort by timestamp (most recent first)
      const updatedSessions = [newSession, ...existingSessions].sort(
        (a, b) => b.timestamp - a.timestamp
      );

      // Save back to storage
      await AsyncStorage.setItem(sessionsKey, JSON.stringify(updatedSessions));

      console.log("Manual session saved:", newSession);

      // Call callback if provided
      if (onSave) {
        onSave({
          date: selectedDate.toLocaleDateString(),
          hours: h,
          minutes: m,
          seconds: s,
          totalSeconds,
          note: note.trim(),
        });
      }

      // Reset form and close modal
      resetForm();
      setModalVisible(false);
    } catch (error) {
      console.error("Failed to save manual session:", error);
    }
  };

  const resetForm = () => {
    setHours("0");
    setMinutes("0");
    setSeconds("0");
    setNote("");
    setSelectedDate(new Date());
  };

  const handleCancel = () => {
    resetForm();
    setModalVisible(false);
  };

  const handleNumberInput = (value: string, setter: (value: string) => void, max: number) => {
    // Only allow numbers
    const numValue = value.replace(/[^0-9]/g, "");
    const parsed = parseInt(numValue) || 0;

    // Cap at max value
    if (parsed > max) {
      setter(max.toString());
    } else {
      setter(numValue);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <Pressable style={styles.triggerButton} onPress={() => setModalVisible(true)}>
        <Text style={[styles.triggerButtonText, { color: colors.softText }]}>
          or add manual session
        </Text>
      </Pressable>

      {/* Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleCancel}
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
            <Pressable onPress={handleCancel} style={styles.cancelButton}>
              <PlatformIcon
                iosName="xmark"
                androidName="close"
                name="close"
                size={24}
                color={colors.text}
              />
            </Pressable>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Log Manual Session</Text>
            <View style={styles.placeholder} />
          </View>

          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.content}>
              <Text style={[styles.description, { color: colors.border }]}>
                Manually log time spent using this tool
              </Text>

              {/* Date Picker */}
              <View style={styles.section}>
                <Text style={[styles.label, { color: colors.text }]}>Date</Text>
                <Pressable
                  style={[
                    styles.dateButton,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                    },
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
                    {selectedDate.toLocaleDateString()}
                  </Text>
                </Pressable>

                {showDatePicker && (
                  <DateTimePicker
                    value={selectedDate}
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
                      value={hours}
                      onChangeText={(value) => handleNumberInput(value, setHours, 99)}
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
                      value={minutes}
                      onChangeText={(value) => handleNumberInput(value, setMinutes, 59)}
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
                      value={seconds}
                      onChangeText={(value) => handleNumberInput(value, setSeconds, 59)}
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
                  value={note}
                  onChangeText={setNote}
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
                      parseInt(hours) === 0 && parseInt(minutes) === 0 && parseInt(seconds) === 0
                        ? 0.5
                        : 1,
                  },
                ]}
                onPress={handleSave}
                disabled={
                  parseInt(hours) === 0 && parseInt(minutes) === 0 && parseInt(seconds) === 0
                }
              >
                <PlatformIcon
                  iosName="checkmark.circle.fill"
                  androidName="check-circle"
                  name="check-circle"
                  size={20}
                  color={colors.card}
                />
                <Text style={[styles.saveButtonText, { color: colors.card }]}>Save Session</Text>
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  triggerButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  triggerButtonText: {
    fontSize: 13,
    fontWeight: "400",
  },
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
  placeholder: {
    width: 32,
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
  },
  description: {
    fontSize: 14,
    marginBottom: 24,
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

export default ManualSession;
