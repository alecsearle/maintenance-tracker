import Title from "@/components/common/Title";
import PlatformIcon from "@/components/PlatformIcon";
import { globalStyles, useThemedColors } from "@/styles/globalStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Modal, Pressable, StyleSheet, Text, View } from "react-native";

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
  const router = useRouter();
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [tool, setTool] = useState<Tool | null>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    loadToolData();
  }, [params.id]);

  const loadToolData = async () => {
    // If we have the name in params, use the params data directly (navigated from inventory list)
    if (params.name) {
      const toolFromParams: Tool = {
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
      setTool(toolFromParams);
      return;
    }

    // If we only have ID (from NFC deep link), load from AsyncStorage
    if (params.id) {
      setLoading(true);
      try {
        const toolsJson = await AsyncStorage.getItem("@tools");
        console.log("Loading tool with ID:", params.id);
        console.log("Tools JSON from storage:", toolsJson);

        if (toolsJson) {
          const tools: Tool[] = JSON.parse(toolsJson);
          console.log("Total tools found:", tools.length);
          console.log(
            "Tool IDs in storage:",
            tools.map((t) => ({ id: t.id, name: t.name }))
          );

          // Try both string and number comparison since IDs might be stored differently
          const foundTool = tools.find(
            (t) =>
              t.id === params.id || t.id === String(params.id) || String(t.id) === String(params.id)
          );

          if (foundTool) {
            console.log("Found tool:", foundTool.name);
            setTool(foundTool);
          } else {
            console.error("Tool not found with ID:", params.id);
            console.error(
              "Tried matching against these IDs:",
              tools.map((t) => t.id)
            );
            setNotFound(true);

            // Show alert to user
            Alert.alert(
              "Tool Not Found",
              "This NFC tag is linked to a tool that no longer exists in your inventory. The tool may have been deleted or the data was reset.\n\nPlease re-write this NFC tag with a current tool from your inventory.",
              [
                {
                  text: "Go to Inventory",
                  onPress: () => router.push("/(tabs)/inventory"),
                },
                { text: "OK" },
              ]
            );
          }
        } else {
          console.error("No tools found in AsyncStorage");
          setNotFound(true);
        }
      } catch (error) {
        console.error("Error loading tool data:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <View style={localStyles.container}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  if (!tool) {
    return (
      <View style={localStyles.container}>
        <View style={localStyles.notFoundContainer}>
          <PlatformIcon
            iosName="exclamationmark.triangle"
            androidName="warning"
            name="warning"
            size={48}
            color={colors.yellow}
          />
          <Text style={[localStyles.notFoundTitle, { color: colors.text }]}>Tool Not Found</Text>
          <Text style={[localStyles.notFoundMessage, { color: colors.softText }]}>
            {notFound
              ? "This tool no longer exists in your inventory. The NFC tag needs to be re-written."
              : "Unable to load tool information."}
          </Text>
          {notFound && (
            <Pressable
              style={[localStyles.goToInventoryButton, { backgroundColor: colors.accent }]}
              onPress={() => router.push("/(tabs)/inventory")}
            >
              <Text style={[localStyles.goToInventoryButtonText, { color: colors.card }]}>
                Go to Inventory
              </Text>
            </Pressable>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={localStyles.container}>
      <View style={localStyles.headerRow}>
        <Title>{tool.name}</Title>
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

            <View style={[localStyles.infoRow, { borderBottomColor: colors.border }]}>
              <Text style={[localStyles.infoLabel, { color: colors.text }]}>ID:</Text>
              <Text style={[localStyles.infoValue, { color: colors.text }]}>{tool.id}</Text>
            </View>

            <View style={[localStyles.infoRow, { borderBottomColor: colors.border }]}>
              <Text style={[localStyles.infoLabel, { color: colors.text }]}>Name:</Text>
              <Text style={[localStyles.infoValue, { color: colors.text }]}>{tool.name}</Text>
            </View>

            {tool.brand && (
              <View style={[localStyles.infoRow, { borderBottomColor: colors.border }]}>
                <Text style={[localStyles.infoLabel, { color: colors.text }]}>Brand:</Text>
                <Text style={[localStyles.infoValue, { color: colors.text }]}>{tool.brand}</Text>
              </View>
            )}

            {tool.model && (
              <View style={[localStyles.infoRow, { borderBottomColor: colors.border }]}>
                <Text style={[localStyles.infoLabel, { color: colors.text }]}>Model:</Text>
                <Text style={[localStyles.infoValue, { color: colors.text }]}>{tool.model}</Text>
              </View>
            )}

            {tool.category && (
              <View style={[localStyles.infoRow, { borderBottomColor: colors.border }]}>
                <Text style={[localStyles.infoLabel, { color: colors.text }]}>Category:</Text>
                <Text style={[localStyles.infoValue, { color: colors.text }]}>{tool.category}</Text>
              </View>
            )}

            {tool.serialNumber && (
              <View style={[localStyles.infoRow, { borderBottomColor: colors.border }]}>
                <Text style={[localStyles.infoLabel, { color: colors.text }]}>Serial Number:</Text>
                <Text style={[localStyles.infoValue, { color: colors.text }]}>
                  {tool.serialNumber}
                </Text>
              </View>
            )}

            {tool.purchaseDate && (
              <View style={[localStyles.infoRow, { borderBottomColor: colors.border }]}>
                <Text style={[localStyles.infoLabel, { color: colors.text }]}>Purchase Date:</Text>
                <Text style={[localStyles.infoValue, { color: colors.text }]}>
                  {tool.purchaseDate}
                </Text>
              </View>
            )}

            {tool.nfcTag && (
              <View style={[localStyles.infoRow, { borderBottomColor: colors.border }]}>
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
  notFoundContainer: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  notFoundTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 16,
    marginBottom: 8,
  },
  notFoundMessage: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },
  goToInventoryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  goToInventoryButtonText: {
    fontSize: 16,
    fontWeight: "600",
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
