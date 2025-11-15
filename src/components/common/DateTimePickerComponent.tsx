import { useThemedColors } from "@/src/styles/globalStyles";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";

interface DateTimePickerComponentProps {
  value: Date;
  onChange: (date: Date) => void;
  mode?: "date" | "time" | "datetime";
  display?: "default" | "spinner" | "calendar" | "clock";
  maximumDate?: Date;
  minimumDate?: Date;
  label?: string;
}

const DateTimePickerComponent = ({
  value,
  onChange,
  mode = "date",
  display,
  maximumDate,
  minimumDate,
  label,
}: DateTimePickerComponentProps) => {
  const colors = useThemedColors();
  const [showPicker, setShowPicker] = useState(false);

  const handleChange = (event: any, selectedDate?: Date) => {
    setShowPicker(Platform.OS === "ios");
    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  const formatDate = (date: Date) => {
    if (mode === "time") {
      return date.toLocaleTimeString();
    } else if (mode === "datetime") {
      return date.toLocaleString();
    }
    return date.toLocaleDateString();
  };

  const displayMode = display || (Platform.OS === "ios" ? "spinner" : "default");

  return (
    <View>
      <Pressable
        style={[
          styles.input,
          {
            backgroundColor: colors.background,
            borderColor: colors.border,
          },
        ]}
        onPress={() => setShowPicker(true)}
      >
        <Text style={{ color: colors.text }}>{formatDate(value)}</Text>
      </Pressable>

      {showPicker && (
        <RNDateTimePicker
          value={value}
          mode={mode}
          display={displayMode}
          onChange={handleChange}
          maximumDate={maximumDate}
          minimumDate={minimumDate}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    justifyContent: "center",
  },
});

export default DateTimePickerComponent;
