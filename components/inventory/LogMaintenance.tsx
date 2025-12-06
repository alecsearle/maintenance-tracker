import PlatformIcon from "@/components/PlatformIcon";
import { useThemedColors } from "@/styles/globalStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
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

interface MaintenanceLog {
  id: string;
  date: string;
  timestamp: number;
  type: "service" | "repair" | "inspection";
  description: string;
  cost?: string;
}

interface LogMaintenanceProps {
  visible: boolean;
  onClose: () => void;
  onSave: (log: MaintenanceLog) => void;
  toolId: string;
}

const LogMaintenance = ({ visible, onClose, onSave, toolId }: LogMaintenanceProps) => {
  const colors = useThemedColors();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedType, setSelectedType] = useState<"service" | "repair" | "inspection">("service");
  const [description, setDescription] = useState("");
  const [cost, setCost] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (event: any, date?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleSave = async () => {
    if (!description.trim()) {
      Alert.alert("Missing Information", "Please enter a description for the maintenance log.");
      return;
    }

    const timestamp = selectedDate.getTime();
    const newLog: MaintenanceLog = {
      id: `maintenance_${timestamp}`,
      date: selectedDate.toLocaleDateString(),
      timestamp: timestamp,
      type: selectedType,
      description: description.trim(),
      cost: cost.trim() || undefined,
    };

    try {
      // Load existing logs
      const logsKey = `@maintenance_${toolId}`;
      const existingLogsJson = await AsyncStorage.getItem(logsKey);
      const existingLogs: MaintenanceLog[] = existingLogsJson ? JSON.parse(existingLogsJson) : [];

      // Add new log and sort by timestamp (most recent first)
      const updatedLogs = [newLog, ...existingLogs].sort((a, b) => b.timestamp - a.timestamp);

      // Save to AsyncStorage
      await AsyncStorage.setItem(logsKey, JSON.stringify(updatedLogs));

      console.log("Maintenance log saved:", newLog);

      // Call callback
      onSave(newLog);

      // Reset form and close
      resetForm();
      onClose();
    } catch (error) {
      console.error("Failed to save maintenance log:", error);
      Alert.alert("Error", "Failed to save maintenance log. Please try again.");
    }
  };

  const resetForm = () => {
    setSelectedDate(new Date());
    setSelectedType("service");
    setDescription("");
    setCost("");
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  const getTypeColor = (type: "service" | "repair" | "inspection") => {
    switch (type) {
      case "service":
        return colors.green;
      case "repair":
        return colors.yellow;
      case "inspection":
        return colors.accent;
    }
  };

  const getTypeBgColor = (type: "service" | "repair" | "inspection") => {
    switch (type) {
      case "service":
        return colors.greenBg;
      case "repair":
        return colors.yellowBg;
      case "inspection":
        return colors.accentMinimal;
    }
  };

  return (
    <Modal
      visible={visible}
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
          <Text style={[styles.modalTitle, { color: colors.text }]}>Add Maintenance Log</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            {/* Type Selection */}
            <View style={styles.section}>
              <Text style={[styles.label, { color: colors.text }]}>Maintenance Type</Text>
              <View style={styles.typeContainer}>
                <Pressable
                  style={[
                    styles.typeButton,
                    {
                      backgroundColor:
                        selectedType === "service" ? getTypeBgColor("service") : colors.card,
                      borderColor:
                        selectedType === "service" ? getTypeColor("service") : colors.border,
                    },
                  ]}
                  onPress={() => setSelectedType("service")}
                >
                  <PlatformIcon
                    iosName="wrench.and.screwdriver.fill"
                    androidName="build"
                    name="build"
                    size={20}
                    color={selectedType === "service" ? getTypeColor("service") : colors.softText}
                  />
                  <Text
                    style={[
                      styles.typeButtonText,
                      {
                        color:
                          selectedType === "service" ? getTypeColor("service") : colors.softText,
                      },
                    ]}
                  >
                    Service
                  </Text>
                </Pressable>

                <Pressable
                  style={[
                    styles.typeButton,
                    {
                      backgroundColor:
                        selectedType === "repair" ? getTypeBgColor("repair") : colors.card,
                      borderColor:
                        selectedType === "repair" ? getTypeColor("repair") : colors.border,
                    },
                  ]}
                  onPress={() => setSelectedType("repair")}
                >
                  <PlatformIcon
                    iosName="hammer.fill"
                    androidName="hardware"
                    name="hardware"
                    size={20}
                    color={selectedType === "repair" ? getTypeColor("repair") : colors.softText}
                  />
                  <Text
                    style={[
                      styles.typeButtonText,
                      {
                        color: selectedType === "repair" ? getTypeColor("repair") : colors.softText,
                      },
                    ]}
                  >
                    Repair
                  </Text>
                </Pressable>

                <Pressable
                  style={[
                    styles.typeButton,
                    {
                      backgroundColor:
                        selectedType === "inspection" ? getTypeBgColor("inspection") : colors.card,
                      borderColor:
                        selectedType === "inspection" ? getTypeColor("inspection") : colors.border,
                    },
                  ]}
                  onPress={() => setSelectedType("inspection")}
                >
                  <PlatformIcon
                    iosName="checkmark.shield.fill"
                    androidName="verified"
                    name="shield-checkmark"
                    size={20}
                    color={
                      selectedType === "inspection" ? getTypeColor("inspection") : colors.softText
                    }
                  />
                  <Text
                    style={[
                      styles.typeButtonText,
                      {
                        color:
                          selectedType === "inspection"
                            ? getTypeColor("inspection")
                            : colors.softText,
                      },
                    ]}
                  >
                    Inspection
                  </Text>
                </Pressable>
              </View>
            </View>

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

            {/* Description Input */}
            <View style={styles.section}>
              <Text style={[styles.label, { color: colors.text }]}>Description</Text>
              <TextInput
                style={[
                  styles.descriptionInput,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    color: colors.text,
                  },
                ]}
                value={description}
                onChangeText={setDescription}
                placeholder="What maintenance was performed?"
                placeholderTextColor={colors.softText}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            {/* Cost Input */}
            <View style={styles.section}>
              <Text style={[styles.label, { color: colors.text }]}>
                Cost <Text style={{ color: colors.border }}>(optional)</Text>
              </Text>
              <View
                style={[
                  styles.costInputContainer,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
              >
                <Text style={[styles.currencySymbol, { color: colors.text }]}>$</Text>
                <TextInput
                  style={[styles.costInput, { color: colors.text }]}
                  value={cost}
                  onChangeText={setCost}
                  placeholder="0.00"
                  placeholderTextColor={colors.softText}
                  keyboardType="decimal-pad"
                />
              </View>
            </View>

            {/* Save Button */}
            <Pressable
              style={[
                styles.saveButton,
                {
                  backgroundColor: colors.accent,
                  opacity: !description.trim() ? 0.5 : 1,
                },
              ]}
              onPress={handleSave}
              disabled={!description.trim()}
            >
              <PlatformIcon
                iosName="checkmark.circle.fill"
                androidName="check-circle"
                name="check-circle"
                size={20}
                color={colors.text}
              />
              <Text style={[styles.saveButtonText, { color: colors.text }]}>
                Save Maintenance Log
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
  scrollView: {
    flex: 1,
  },
  content: {
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
  typeContainer: {
    flexDirection: "row",
    gap: 8,
  },
  typeButton: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 2,
    gap: 8,
  },
  typeButtonText: {
    fontSize: 13,
    fontWeight: "600",
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
  descriptionInput: {
    height: 120,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    fontSize: 16,
  },
  costInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: "600",
    marginRight: 4,
  },
  costInput: {
    flex: 1,
    paddingVertical: 14,
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

export default LogMaintenance;
