import RNDateTimePicker from "@react-native-community/datetimepicker";
import { Platform } from "react-native";

interface DateTimePickerProps {
  value: Date;
  mode?: "date" | "time" | "datetime";
  display?: "default" | "spinner" | "calendar" | "clock";
  onChange: (event: any, date?: Date) => void;
  maximumDate?: Date;
  minimumDate?: Date;
  visible: boolean;
}

const DateTimePicker = ({
  value,
  mode = "date",
  display,
  onChange,
  maximumDate,
  minimumDate,
  visible,
}: DateTimePickerProps) => {
  if (!visible) return null;

  const displayMode = display || (Platform.OS === "ios" ? "spinner" : "default");

  return (
    <RNDateTimePicker
      value={value}
      mode={mode}
      display={displayMode}
      onChange={onChange}
      maximumDate={maximumDate}
      minimumDate={minimumDate}
    />
  );
};

export default DateTimePicker;
