import PlatformIcon from "@/src/components/PlatformIcon";
import { globalStyles, useThemedColors } from "@/src/styles/globalStyles";
import { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

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

interface ToolDetailsProps {
  params: Record<string, string | string[]>;
}

const ToolDetails = ({ params }: ToolDetailsProps) => {
  const colors = useThemedColors();
  const styles = globalStyles(colors);
  const [showInfoModal, setShowInfoModal] = useState(false);

  // Extract tool data from URL params
  const tool: Tool = {
    id: (params.id as string) || "",
    name: (params.name as string) || "",
    brand: (params.brand as string) || "",
    model: (params.model as string) || "",
    serialNumber: (params.serialNumber as string) || "",
    category: (params.category as string) || "",
    purchaseDate: (params.purchaseDate as string) || "",
    nfcTag: (params.nfcTag as string) || "",
    manualUri: (params.manualUri as string) || "",
    manualName: (params.manualName as string) || "",
  };

  // Now you can use tool.name, tool.brand, tool.model, etc.

  return (
    <View style={localStyles.container}>
      <View style={localStyles.headerRow}>
        <Text style={[styles.subTitle, localStyles.toolName]}>{tool.name}</Text>
        <Pressable onPress={() => setShowInfoModal(true)} style={localStyles.infoButton}>
          <PlatformIcon
            iosName="info.circle"
            androidName="info"
            name="info"
            color={colors.accent}
            size={22}
          />
        </Pressable>
      </View>
      <Text style={[styles.text, localStyles.brandModel]}>
        {tool.brand} • {tool.model}
      </Text>

      {/* Info Modal */}
      <Modal
        visible={showInfoModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowInfoModal(false)}
      >
        <Pressable style={localStyles.modalOverlay} onPress={() => setShowInfoModal(false)}>
          <View
            style={[localStyles.modalContent, { backgroundColor: colors.card }]}
            onStartShouldSetResponder={() => true}
          >
            <View style={localStyles.modalHeader}>
              <Text style={[localStyles.modalTitle, { color: colors.text }]}>Tool Information</Text>
              <Pressable onPress={() => setShowInfoModal(false)}>
                <Text style={[localStyles.closeButton, { color: colors.accent }]}>✕</Text>
              </Pressable>
            </View>

            <View style={localStyles.infoRow}>
              <Text style={[localStyles.infoLabel, { color: colors.text }]}>Name:</Text>
              <Text style={[localStyles.infoValue, { color: colors.text }]}>{tool.name}</Text>
            </View>

            {tool.brand && (
              <View style={localStyles.infoRow}>
                <Text style={[localStyles.infoLabel, { color: colors.text }]}>Brand:</Text>
                <Text style={[localStyles.infoValue, { color: colors.text }]}>{tool.brand}</Text>
              </View>
            )}

            {tool.model && (
              <View style={localStyles.infoRow}>
                <Text style={[localStyles.infoLabel, { color: colors.text }]}>Model:</Text>
                <Text style={[localStyles.infoValue, { color: colors.text }]}>{tool.model}</Text>
              </View>
            )}

            {tool.category && (
              <View style={localStyles.infoRow}>
                <Text style={[localStyles.infoLabel, { color: colors.text }]}>Category:</Text>
                <Text style={[localStyles.infoValue, { color: colors.text }]}>{tool.category}</Text>
              </View>
            )}

            {tool.serialNumber && (
              <View style={localStyles.infoRow}>
                <Text style={[localStyles.infoLabel, { color: colors.text }]}>Serial Number:</Text>
                <Text style={[localStyles.infoValue, { color: colors.text }]}>
                  {tool.serialNumber}
                </Text>
              </View>
            )}

            {tool.purchaseDate && (
              <View style={localStyles.infoRow}>
                <Text style={[localStyles.infoLabel, { color: colors.text }]}>Purchase Date:</Text>
                <Text style={[localStyles.infoValue, { color: colors.text }]}>
                  {tool.purchaseDate}
                </Text>
              </View>
            )}

            {tool.nfcTag && (
              <View style={localStyles.infoRow}>
                <Text style={[localStyles.infoLabel, { color: colors.text }]}>NFC Tag ID:</Text>
                <Text style={[localStyles.infoValue, { color: colors.text }]}>{tool.nfcTag}</Text>
              </View>
            )}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const localStyles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  toolName: {
    marginBottom: 0,
  },
  brandModel: {
    marginTop: 0,
  },
  infoButton: {
    padding: 2,
    marginTop: -2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    maxWidth: 400,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  closeButton: {
    fontSize: 24,
    fontWeight: "300",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  infoValue: {
    fontSize: 14,
    flex: 1,
    textAlign: "right",
    marginLeft: 12,
  },
});

export default ToolDetails;
