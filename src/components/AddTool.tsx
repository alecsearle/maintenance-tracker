import { useThemedColors } from "@/src/styles/globalStyles";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as DocumentPicker from "expo-document-picker";
import React, { useState } from "react";
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

interface Tool {
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

interface AddToolProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (tool: Tool) => void;
}

const CATEGORIES = [
  "Power Tools",
  "Hand Tools",
  "Automotive",
  "Lawn & Garden",
  "Plumbing",
  "Electrical",
  "Woodworking",
  "Measuring",
  "Safety Equipment",
  "Other",
];

const AddTool = ({ visible, onClose, onAdd }: AddToolProps) => {
  const colors = useThemedColors();
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [category, setCategory] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [nfcTag, setNfcTag] = useState("");
  const [manualUri, setManualUri] = useState("");
  const [manualName, setManualName] = useState("");
  const [showCategories, setShowCategories] = useState(false);

  const handleAdd = () => {
    if (name.trim()) {
      onAdd({
        name,
        brand,
        model,
        serialNumber,
        category,
        purchaseDate: selectedDate.toLocaleDateString(),
        nfcTag,
        manualUri,
        manualName,
      });
      resetForm();
      onClose();
    }
  };

  const resetForm = () => {
    setName("");
    setBrand("");
    setModel("");
    setSerialNumber("");
    setCategory("");
    setPurchaseDate("");
    setSelectedDate(new Date());
    setNfcTag("");
    setManualUri("");
    setManualName("");
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  const handleAddNFC = () => {
    // Placeholder for NFC functionality
    Alert.alert("NFC Tag", "Hold your device near an NFC tag to scan it.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Scan",
        onPress: () => {
          // Mock NFC scan
          setNfcTag(`NFC_${Date.now()}`);
          Alert.alert("Success", "NFC tag added successfully!");
        },
      },
    ]);
  };

  const handleUploadManual = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        setManualUri(file.uri);
        setManualName(file.name);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to upload manual. Please try again.");
    }
  };

  const selectCategory = (cat: string) => {
    setCategory(cat);
    setShowCategories(false);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType={Platform.OS === "ios" ? "slide" : "fade"}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalOverlay}
      >
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={[styles.bottomSheet, { backgroundColor: colors.card }]}>
          {/* Handle bar */}
          <View style={[styles.handleBar, { backgroundColor: colors.border }]} />

          {/* Header */}
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <Text style={[styles.title, { color: colors.text }]}>Add New Tool</Text>
            <Pressable onPress={handleCancel}>
              <Text style={[styles.cancelButton, { color: colors.primary }]}>Cancel</Text>
            </Pressable>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Tool Name */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Tool Name *</Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.background,
                    color: colors.text,
                    borderColor: colors.border,
                  },
                ]}
                placeholder="e.g., Cordless Drill"
                placeholderTextColor={colors.border}
                value={name}
                onChangeText={setName}
              />
            </View>

            {/* Brand */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Brand</Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.background,
                    color: colors.text,
                    borderColor: colors.border,
                  },
                ]}
                placeholder="e.g., DeWalt"
                placeholderTextColor={colors.border}
                value={brand}
                onChangeText={setBrand}
              />
            </View>

            {/* Model */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Model</Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.background,
                    color: colors.text,
                    borderColor: colors.border,
                  },
                ]}
                placeholder="e.g., DCD771C2"
                placeholderTextColor={colors.border}
                value={model}
                onChangeText={setModel}
              />
            </View>

            {/* Serial Number */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Serial Number</Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.background,
                    color: colors.text,
                    borderColor: colors.border,
                  },
                ]}
                placeholder="e.g., SN123456789"
                placeholderTextColor={colors.border}
                value={serialNumber}
                onChangeText={setSerialNumber}
              />
            </View>

            {/* Category */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Category</Text>
              <Pressable
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                    justifyContent: "center",
                  },
                ]}
                onPress={() => setShowCategories(!showCategories)}
              >
                <Text style={{ color: category ? colors.text : colors.border }}>
                  {category || "Select a category"}
                </Text>
              </Pressable>

              {showCategories && (
                <View
                  style={[
                    styles.categoryList,
                    { backgroundColor: colors.background, borderColor: colors.border },
                  ]}
                >
                  {CATEGORIES.map((cat) => (
                    <Pressable
                      key={cat}
                      style={[styles.categoryItem, { borderBottomColor: colors.border }]}
                      onPress={() => selectCategory(cat)}
                    >
                      <Text style={{ color: colors.text }}>{cat}</Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>

            {/* Purchase Date */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Purchase Date</Text>

              <DateTimePicker
                value={selectedDate}
                mode="date"
                display="default"
                onChange={(event, date) => {
                  if (date) {
                    setSelectedDate(date);
                  }
                }}
              />
            </View>

            {/* NFC Tag */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>NFC Tag</Text>
              <Pressable
                style={[
                  styles.button,
                  {
                    backgroundColor: nfcTag ? colors.accent : colors.primary,
                    borderColor: colors.border,
                  },
                ]}
                onPress={handleAddNFC}
              >
                <Text style={[styles.buttonText, { color: colors.secondary }]}>
                  {nfcTag ? "✓ NFC Tag Added" : "+ Add NFC Tag"}
                </Text>
              </Pressable>
            </View>

            {/* Manual Upload */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Maintenance Manual</Text>
              <Pressable
                style={[
                  styles.button,
                  {
                    backgroundColor: manualUri ? colors.accent : colors.primary,
                    borderColor: colors.border,
                  },
                ]}
                onPress={handleUploadManual}
              >
                <Text style={[styles.buttonText, { color: colors.secondary }]}>
                  {manualUri ? `✓ ${manualName}` : "+ Upload PDF Manual"}
                </Text>
              </Pressable>
            </View>

            {/* Add Button */}
            <Pressable
              style={[
                styles.addButton,
                { backgroundColor: name.trim() ? colors.accentMinimal : colors.border },
                name.trim() && styles.addButtonActive,
              ]}
              onPress={handleAdd}
              disabled={!name.trim()}
            >
              <Text
                style={[
                  styles.addButtonText,
                  { color: name.trim() ? colors.primary : colors.tabInactive },
                ]}
              >
                Add Tool
              </Text>
            </Pressable>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  bottomSheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 8,
    paddingBottom: Platform.OS === "ios" ? 34 : 16,
    height: "90%",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
  },
  cancelButton: {
    fontSize: 16,
    fontWeight: "600",
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
  },
  button: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 15,
    fontWeight: "600",
  },
  categoryList: {
    marginTop: 8,
    borderWidth: 1,
    borderRadius: 8,
    maxHeight: 200,
  },
  categoryItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  datePickerContainer: {
    borderWidth: 1,
    borderRadius: 8,
    overflow: "hidden",
  },
  addButton: {
    marginTop: 32,
    marginBottom: 20,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  addButtonActive: {
    ...Platform.select({
      ios: {
        shadowOpacity: 0.2,
        shadowRadius: 6,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  addButtonText: {
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});

export default AddTool;
