import AddTool from "@/src/components/AddTool";
import { globalStyles, useThemedColors } from "@/src/styles/globalStyles";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

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

const SAMPLE_TOOLS: Tool[] = [
  {
    name: "Cordless Drill",
    brand: "DeWalt",
    model: "DCD771C2",
    serialNumber: "SN123456789",
    category: "Power Tools",
    purchaseDate: "3/15/2024",
    nfcTag: "NFC_1699876543210",
    manualUri: "",
    manualName: "DCD771C2_Manual.pdf",
  },
  {
    name: "Circular Saw",
    brand: "Makita",
    model: "5007MG",
    serialNumber: "SN987654321",
    category: "Power Tools",
    purchaseDate: "6/22/2024",
    nfcTag: "",
    manualUri: "",
    manualName: "",
  },
  {
    name: "Socket Set",
    brand: "Craftsman",
    model: "230-Piece",
    serialNumber: "",
    category: "Hand Tools",
    purchaseDate: "1/10/2024",
    nfcTag: "NFC_1699876543211",
    manualUri: "",
    manualName: "Craftsman_SocketSet_Guide.pdf",
  },
];

export default function InventoryScreen() {
  const colors = useThemedColors();
  const styles = globalStyles(colors);
  const [isAddToolVisible, setIsAddToolVisible] = useState(false);
  const [tools, setTools] = useState<Tool[]>(SAMPLE_TOOLS);

  const handleAddTool = (tool: Tool) => {
    setTools([...tools, tool]);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 100 }}>
        {tools.length === 0 ? (
          <View style={localStyles.emptyState}>
            <Text style={[localStyles.emptyText, { color: colors.text }]}>No tools added yet</Text>
            <Text style={[localStyles.emptySubtext, { color: colors.border }]}>
              Tap the button below to add your first tool
            </Text>
          </View>
        ) : (
          tools.map((tool, index) => (
            <View key={index} style={[styles.card, { marginBottom: 12 }]}>
              <Text style={[styles.title, { fontSize: 18, marginBottom: 4 }]}>{tool.name}</Text>
              {tool.brand && (
                <Text style={{ color: colors.text, fontSize: 14 }}>
                  {tool.brand} {tool.model && `• ${tool.model}`}
                </Text>
              )}
              {tool.category && (
                <Text style={{ color: colors.border, fontSize: 13, marginTop: 4 }}>
                  {tool.category}
                </Text>
              )}
              {tool.serialNumber && (
                <Text style={{ color: colors.text, fontSize: 13, marginTop: 4 }}>
                  SN: {tool.serialNumber}
                </Text>
              )}
              {tool.purchaseDate && (
                <Text style={{ color: colors.text, fontSize: 13 }}>
                  Purchased: {tool.purchaseDate}
                </Text>
              )}
              {tool.nfcTag && (
                <Text style={{ color: colors.accent, fontSize: 12, marginTop: 4 }}>
                  📱 NFC Tag Added
                </Text>
              )}
              {tool.manualName && (
                <Text style={{ color: colors.accent, fontSize: 12 }}>📄 {tool.manualName}</Text>
              )}
            </View>
          ))
        )}
      </ScrollView>

      <Pressable
        style={[localStyles.fab, { backgroundColor: colors.primary }]}
        onPress={() => setIsAddToolVisible(true)}
      >
        <Text style={[localStyles.fabText, { color: colors.secondary }]}>+ Add Tool</Text>
      </Pressable>

      <AddTool
        visible={isAddToolVisible}
        onClose={() => setIsAddToolVisible(false)}
        onAdd={handleAddTool}
      />
    </View>
  );
}

const localStyles = StyleSheet.create({
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
  },
  fab: {
    position: "absolute",
    bottom: 100,
    right: 20,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  fabText: {
    fontSize: 16,
    fontWeight: "700",
  },
});
