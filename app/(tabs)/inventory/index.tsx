import AddTool from "@/src/components/inventory/AddTool";
import SearchBar from "@/src/components/SearchBar";
import { globalStyles, useThemedColors } from "@/src/styles/globalStyles";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

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

const SAMPLE_TOOLS: Tool[] = [
  {
    id: "1",
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
    id: "2",
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
    id: "3",
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
  const router = useRouter();
  const [isAddToolVisible, setIsAddToolVisible] = useState(false);
  const [tools, setTools] = useState<Tool[]>(SAMPLE_TOOLS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleAddTool = (tool: Tool) => {
    setTools([...tools, tool]);
  };

  // Get unique categories from tools
  const categories = useMemo(() => {
    const uniqueCategories = new Set(tools.map((tool) => tool.category).filter(Boolean));
    return Array.from(uniqueCategories).sort();
  }, [tools]);

  // Filter tools based on search query and selected category
  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      // Category filter
      if (selectedCategory && tool.category !== selectedCategory) {
        return false;
      }

      // Search query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          tool.name.toLowerCase().includes(query) ||
          tool.brand?.toLowerCase().includes(query) ||
          tool.model?.toLowerCase().includes(query) ||
          tool.category?.toLowerCase().includes(query) ||
          tool.serialNumber?.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [tools, searchQuery, selectedCategory]);

  return (
    <View style={styles.container}>
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        categories={categories}
      />

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 100 }}>
        {filteredTools.length === 0 ? (
          <View style={localStyles.emptyState}>
            <Text style={[localStyles.emptyText, { color: colors.text }]}>
              {tools.length === 0 ? "No tools added yet" : "No tools found"}
            </Text>
            <Text style={[localStyles.emptySubtext, { color: colors.border }]}>
              {tools.length === 0
                ? "Tap the button below to add your first tool"
                : "Try adjusting your search or filters"}
            </Text>
          </View>
        ) : (
          filteredTools.map((tool) => (
            <Pressable
              key={tool.id}
              style={[styles.card, { marginBottom: 12 }]}
              onPress={() =>
                router.push({
                  pathname: "/inventory/[id]",
                  params: {
                    id: tool.id,
                    name: tool.name,
                    brand: tool.brand,
                    model: tool.model,
                    serialNumber: tool.serialNumber,
                    category: tool.category,
                    purchaseDate: tool.purchaseDate,
                    nfcTag: tool.nfcTag,
                    manualUri: tool.manualUri,
                    manualName: tool.manualName,
                  },
                })
              }
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 4,
                }}
              >
                <Text style={[styles.title, { fontSize: 18, marginBottom: 0 }]}>{tool.name}</Text>
                {tool.category && (
                  <Text style={{ color: colors.softText, fontSize: 12, fontWeight: "500" }}>
                    {tool.category}
                  </Text>
                )}
              </View>
              {tool.brand && (
                <Text style={{ color: colors.text, fontSize: 14 }}>
                  {tool.brand} {tool.model && `• ${tool.model}`}
                </Text>
              )}
            </Pressable>
          ))
        )}
      </ScrollView>

      <Pressable
        style={[localStyles.fab, { backgroundColor: colors.card, borderColor: colors.border }]}
        onPress={() => setIsAddToolVisible(true)}
      >
        <Text style={[localStyles.fabText, { color: colors.text }]}>+ Add Tool</Text>
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
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  fabText: {
    fontSize: 16,
    fontWeight: "700",
  },
});
