import { useThemedColors } from "@/styles/globalStyles";
import React, { useState } from "react";
import { Alert, Pressable, StyleSheet, Text } from "react-native";

// Make NFC optional for Expo Go compatibility
let NfcManager: any = null;
let Ndef: any = null;
let NfcTech: any = null;

try {
  const nfcModule = require("react-native-nfc-manager");
  NfcManager = nfcModule.default;
  Ndef = nfcModule.Ndef;
  NfcTech = nfcModule.NfcTech;
} catch (e) {
  console.log("NFC Manager not available - running in Expo Go");
}

interface WriteNfcProps {
  toolId: string;
  onSuccess?: (nfcTagId: string) => void;
  onError?: (error: Error) => void;
  children?: React.ReactNode;
}

function WriteNfc({ toolId, onSuccess, onError, children }: WriteNfcProps) {
  const colors = useThemedColors();
  const [isWriting, setIsWriting] = useState(false);

  async function handleWriteNfc() {
    // Check if NFC is available
    if (!NfcManager) {
      Alert.alert(
        "NFC Not Available",
        "NFC functionality requires a development build. It's not available in Expo Go. For testing, the tool will be saved without an NFC tag.",
        [
          {
            text: "OK",
            onPress: () => {
              // Still call success callback so the form can be submitted
              onSuccess?.(toolId);
            },
          },
        ]
      );
      return;
    }

    if (!toolId) {
      const error = new Error("Tool ID is required");
      onError?.(error);
      Alert.alert("Error", "Tool ID is required to write NFC tag.");
      return;
    }

    setIsWriting(true);

    try {
      // Create a URI record with your deep linking scheme
      const deepLink = `maintenancetracker://inventory/${toolId}`;
      const uriRecord = Ndef.uriRecord(deepLink);
      const bytes = Ndef.encodeMessage([uriRecord]);

      Alert.alert("Write to Tag", "Have a clear NFC tag ready to write.", [
        { text: "Cancel", style: "cancel", onPress: () => setIsWriting(false) },
        {
          text: "Write",
          onPress: async () => {
            try {
              await NfcManager.requestTechnology(NfcTech.Ndef);
              await NfcManager.ndefHandler.writeNdefMessage(bytes);

              Alert.alert("Success", "NFC tag has been written successfully!");
              onSuccess?.(toolId);
            } catch (ex) {
              const error = ex as Error;
              Alert.alert("Error", error.message || "Failed to write NFC tag.");
              onError?.(error);
            } finally {
              NfcManager.cancelTechnologyRequest();
              setIsWriting(false);
            }
          },
        },
      ]);
    } catch (ex) {
      const error = ex as Error;
      Alert.alert("Error", error.message || "Failed to prepare NFC tag.");
      onError?.(error);
      setIsWriting(false);
    }
  }

  return (
    <Pressable
      style={[
        styles.button,
        {
          backgroundColor: colors.background,
          borderColor: colors.border,
        },
      ]}
      onPress={handleWriteNfc}
      disabled={isWriting}
    >
      {children || (
        <Text style={[styles.buttonText, { color: colors.text }]}>
          {isWriting ? "Writing..." : "+ Add NFC Tag"}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
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
});

export default WriteNfc;
