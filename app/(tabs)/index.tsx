import ActiveSessions from "@/components/home/ActiveSessions";
import MaintenanceAlerts from "@/components/home/MaintenanceAlerts";
import StatsCard from "@/components/home/StatsCard";
import PlatformIcon from "@/components/PlatformIcon";
import { globalStyles, useThemedColors } from "@/styles/globalStyles";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

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

interface ActiveSession {
  toolId: string;
  elapsedTime: string;
  isRunning: boolean;
}

// Sample data - replace with actual data from AsyncStorage
const SAMPLE_TOOLS: Tool[] = [
  {
    id: "1",
    name: "Chainsaw",
    brand: "Stihl",
    model: "DCD771C2",
    serialNumber: "SN123456789",
    category: "Gas Powered Tools",
    purchaseDate: "3/15/2024",
    nfcTag: "NFC_1699876543210",
    manualUri: "",
    manualName: "DCD771C2_Manual.pdf",
  },
  {
    id: "2",
    name: "Wood Chipper",
    brand: "GreenMech",
    model: "5007MG",
    serialNumber: "SN987654321",
    category: "Heavy Machinery",
    purchaseDate: "6/22/2024",
    nfcTag: "",
    manualUri: "",
    manualName: "",
  },
  {
    id: "3",
    name: "Mulcher",
    brand: "Fecon",
    model: "2568132",
    serialNumber: "",
    category: "Gas Powered Tools",
    purchaseDate: "1/10/2024",
    nfcTag: "NFC_1699876543211",
    manualUri: "",
    manualName: "Fecon_Mulcher_Manual.pdf",
  },
];

const SAMPLE_ACTIVE_SESSIONS: ActiveSession[] = [
  {
    toolId: "1",
    elapsedTime: "02:34:12",
    isRunning: true,
  },
  {
    toolId: "3",
    elapsedTime: "00:45:30",
    isRunning: false,
  },
];

export default function HomeScreen() {
  const colors = useThemedColors();
  const styles = globalStyles(colors);
  const [tools] = useState<Tool[]>(SAMPLE_TOOLS);
  const [activeSessions] = useState<ActiveSession[]>(SAMPLE_ACTIVE_SESSIONS);

  return (
    <ScrollView
      style={[styles.container, { padding: 0 }]}
      contentContainerStyle={{ paddingBottom: 100 }}
      contentInsetAdjustmentBehavior="automatic"
    >
      <View style={{ padding: 16 }}>
        <StatsCard />

        <ActiveSessions tools={tools} activeSessions={activeSessions} />

        <MaintenanceAlerts />

        {/* Empty State */}
        <View style={localStyles.emptyState}>
          <PlatformIcon
            iosName="checkmark.circle"
            androidName="check-circle"
            name="check-circle"
            color={colors.green}
            size={64}
          />
          <Text style={[localStyles.emptyTitle, { color: colors.text }]}>All Caught Up!</Text>
          <Text style={[localStyles.emptyMessage, { color: colors.softText }]}>
            No maintenance alerts
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const localStyles = StyleSheet.create({
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    textAlign: "center",
  },
});
