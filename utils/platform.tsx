import { Platform } from "react-native";

export const isIOS = Platform.OS === "ios";
export const isAndroid = Platform.OS === "android";
export const isWeb = Platform.OS === "web";

// 'ios' | 'android' | 'web'
export const platformName = Platform.OS;

// Use Platform.select if you want a single function
interface PlatformOptions<T> {
  ios?: T;
  android?: T;
  web?: T;
  native?: T;
  default?: T;
}

export const selectPlatform = <T,>(options: PlatformOptions<T>) => Platform.select(options);
