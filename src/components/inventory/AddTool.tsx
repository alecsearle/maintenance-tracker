import DateTimePickerComponent from "@/src/components/common/DateTimePickerComponent";
import { useThemedColors } from "@/src/styles/globalStyles";
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
        id: Date.now().toString(),
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
            <Text style={[styles.closeIcon, { color: colors.text }]}>✕</Text>
          </Pressable>
          <Text style={[styles.modalTitle, { color: colors.text }]}>Add New Tool</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
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
              <DateTimePickerComponent
                value={selectedDate}
                onChange={setSelectedDate}
                maximumDate={new Date()}
              />
            </View>

            {/* Manual Upload */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Maintenance Manual</Text>
              <Pressable
                style={[
                  styles.button,
                  {
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                  },
                ]}
                onPress={handleUploadManual}
              >
                <Text
                  style={[styles.buttonText, { color: manualUri ? colors.accent : colors.text }]}
                >
                  {manualUri ? `✓ ${manualName}` : "+ Upload PDF Manual"}
                </Text>
              </Pressable>
            </View>

            {/* NFC Tag */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>NFC Tag</Text>
              <Pressable
                style={[
                  styles.button,
                  {
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                  },
                ]}
                onPress={handleAddNFC}
              >
                <Text style={[styles.buttonText, { color: nfcTag ? colors.accent : colors.text }]}>
                  {nfcTag ? "✓ NFC Tag Added" : "+ Add NFC Tag"}
                </Text>
              </Pressable>
            </View>

            {/* Add Button */}
            <Pressable
              style={[
                styles.addButton,
                {
                  backgroundColor: name.trim() ? colors.accent : colors.border,
                },
                name.trim() && styles.addButtonActive,
              ]}
              onPress={handleAdd}
              disabled={!name.trim()}
            >
              <Text
                style={[
                  styles.addButtonText,
                  { color: name.trim() ? colors.card : colors.tabInactive },
                ]}
              >
                Add Tool
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
  closeIcon: {
    fontSize: 24,
    fontWeight: "600",
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
        shadowOpacity: 0.15,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  addButtonActive: {
    ...Platform.select({
      ios: {
        shadowOpacity: 0.25,
        shadowRadius: 8,
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
