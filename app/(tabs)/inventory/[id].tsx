import DetailsTab from "@/src/components/inventory/DetailsTab";
import MaintenanceTab from "@/src/components/inventory/MaintenanceTab";
import ToolDetails from "@/src/components/inventory/ToolDetails";
import UsageTab from "@/src/components/inventory/UsageTab";
import { globalStyles, useThemedColors } from "@/src/styles/globalStyles";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type TabType = "details" | "usage" | "maintenance";

export default function ToolDetailScreen() {
  const colors = useThemedColors();
  const styles = globalStyles(colors);
  const params = useLocalSearchParams();
  const toolId = params.id as string;
  const manualName = params.manualName as string;

  const [activeTab, setActiveTab] = useState<TabType>("details");

  const renderTabContent = () => {
    switch (activeTab) {
      case "details":
        return <DetailsTab toolId={toolId} />;
      case "usage":
        return <UsageTab toolId={toolId} />;
      case "maintenance":
        return <MaintenanceTab toolId={toolId} manualName={manualName} />;
      default:
        return <DetailsTab toolId={toolId} />;
    }
  };

  return (
    <View style={styles.container}>
      {/* Tool Header */}
      <ToolDetails params={params} />

      {/* Tab Navigation */}
      <View style={[localStyles.tabContainer, { borderBottomColor: colors.border }]}>
        <Pressable
          style={[
            localStyles.tab,
            activeTab === "details" && [
              localStyles.activeTab,
              { borderBottomColor: colors.accent },
            ],
          ]}
          onPress={() => setActiveTab("details")}
        >
          <Text
            style={[
              localStyles.tabText,
              { color: activeTab === "details" ? colors.accent : colors.softText },
            ]}
          >
            Details
          </Text>
        </Pressable>
        <Pressable
          style={[
            localStyles.tab,
            activeTab === "usage" && [localStyles.activeTab, { borderBottomColor: colors.accent }],
          ]}
          onPress={() => setActiveTab("usage")}
        >
          <Text
            style={[
              localStyles.tabText,
              { color: activeTab === "usage" ? colors.accent : colors.softText },
            ]}
          >
            Usage
          </Text>
        </Pressable>
        <Pressable
          style={[
            localStyles.tab,
            activeTab === "maintenance" && [
              localStyles.activeTab,
              { borderBottomColor: colors.accent },
            ],
          ]}
          onPress={() => setActiveTab("maintenance")}
        >
          <Text
            style={[
              localStyles.tabText,
              { color: activeTab === "maintenance" ? colors.accent : colors.softText },
            ]}
          >
            Maintenance
          </Text>
        </Pressable>
      </View>

      {/* Tab Content */}
      <View style={localStyles.tabContent}>{renderTabContent()}</View>
    </View>
  );
}

const localStyles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
  },
  tabContent: {
    flex: 1,
  },
});
