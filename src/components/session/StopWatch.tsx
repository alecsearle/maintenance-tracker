//////// STOP WATCH LOGIC IS EXTREMELY BROKEN /////////

import PlatformIcon from "@/src/components/PlatformIcon";
import { useThemedColors } from "@/src/styles/globalStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";

interface StopWatchProps {
  toolId: string;
  onTimeUpdate?: (seconds: number) => void;
}

const getStorageKeys = (toolId: string) => ({
  TIME: `@stopwatch_time_${toolId}`,
  IS_RUNNING: `@stopwatch_isRunning_${toolId}`,
  SESSION_STARTED: `@stopwatch_sessionStarted_${toolId}`,
  START_TIMESTAMP: `@stopwatch_startTimestamp_${toolId}`,
});

const StopWatch = ({ toolId, onTimeUpdate }: StopWatchProps) => {
  const STORAGE_KEYS = getStorageKeys(toolId);
  const colors = useThemedColors();
  const [time, setTime] = useState(0); // time in milliseconds
  const [isRunning, setIsRunning] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimestampRef = useRef<number>(0);

  // Load persisted state on mount
  useEffect(() => {
    loadPersistedState();
  }, []);

  // Restore state when screen gains focus
  useFocusEffect(
    useCallback(() => {
      loadPersistedState();
    }, [])
  );

  const loadPersistedState = async () => {
    try {
      const [savedTime, savedIsRunning, savedSessionStarted, savedStartTimestamp] =
        await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.TIME),
          AsyncStorage.getItem(STORAGE_KEYS.IS_RUNNING),
          AsyncStorage.getItem(STORAGE_KEYS.SESSION_STARTED),
          AsyncStorage.getItem(STORAGE_KEYS.START_TIMESTAMP),
        ]);

      if (savedSessionStarted === "true") {
        setSessionStarted(true);
        const baseTime = savedTime ? parseInt(savedTime, 10) : 0;

        if (savedIsRunning === "true" && savedStartTimestamp) {
          // Calculate elapsed time since the app was backgrounded
          const startTimestamp = parseInt(savedStartTimestamp, 10);
          const elapsedWhileAway = Date.now() - startTimestamp;
          const totalTime = baseTime + elapsedWhileAway;
          setTime(totalTime);
          setIsRunning(true);
          startTimestampRef.current = Date.now() - totalTime;
        } else {
          setTime(baseTime);
          setIsRunning(false);
        }
      }
    } catch (error) {
      console.error("Failed to load stopwatch state:", error);
    }
  };

  const persistState = async (
    newTime: number,
    newIsRunning: boolean,
    newSessionStarted: boolean
  ) => {
    try {
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.TIME, newTime.toString()),
        AsyncStorage.setItem(STORAGE_KEYS.IS_RUNNING, newIsRunning.toString()),
        AsyncStorage.setItem(STORAGE_KEYS.SESSION_STARTED, newSessionStarted.toString()),
        AsyncStorage.setItem(STORAGE_KEYS.START_TIMESTAMP, Date.now().toString()),
      ]);
    } catch (error) {
      console.error("Failed to persist stopwatch state:", error);
    }
  };

  const clearPersistedState = async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEYS.TIME),
        AsyncStorage.removeItem(STORAGE_KEYS.IS_RUNNING),
        AsyncStorage.removeItem(STORAGE_KEYS.SESSION_STARTED),
        AsyncStorage.removeItem(STORAGE_KEYS.START_TIMESTAMP),
      ]);
    } catch (error) {
      console.error("Failed to clear stopwatch state:", error);
    }
  };

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => {
          const newTime = prevTime + 10;
          if (onTimeUpdate) {
            onTimeUpdate(Math.floor(newTime / 1000));
          }
          return newTime;
        });
      }, 10);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, onTimeUpdate]);

  // Persist state whenever it changes
  useEffect(() => {
    if (sessionStarted) {
      persistState(time, isRunning, sessionStarted);
    }
  }, [time, isRunning, sessionStarted]);

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return {
      hours: hours.toString().padStart(2, "0"),
      minutes: minutes.toString().padStart(2, "0"),
      seconds: seconds.toString().padStart(2, "0"),
    };
  };

  const handleStart = () => {
    setSessionStarted(true);
    setIsRunning(true);
    startTimestampRef.current = Date.now();
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleEndSession = async () => {
    setIsRunning(false);
    setSessionStarted(false);
    setTime(0);
    await clearPersistedState();
    if (onTimeUpdate) {
      onTimeUpdate(0);
    }
  };

  const formattedTime = formatTime(time);

  // If session hasn't started, show only Start Session button
  if (!sessionStarted) {
    return (
      <View style={styles.container}>
        <Pressable
          style={[styles.startButton, { backgroundColor: colors.accent }]}
          onPress={handleStart}
        >
          <Text style={[styles.startButtonText, { color: "#FFFFFF" }]}>Start Session</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Time Display */}
      <View style={styles.timeDisplayContainer}>
        <Text style={[styles.timeDisplay, { color: colors.text }]}>
          {formattedTime.hours}:{formattedTime.minutes}:{formattedTime.seconds}
        </Text>
      </View>

      {/* Control Buttons */}
      <View style={styles.controls}>
        {isRunning ? (
          <Pressable
            style={[
              styles.controlButton,
              { backgroundColor: colors.yellowBg, borderColor: colors.yellow },
            ]}
            onPress={handlePause}
          >
            <PlatformIcon
              iosName="pause.fill"
              androidName="pause"
              name="pause"
              color={colors.yellow}
              size={20}
            />
            <Text style={[styles.controlButtonText, { color: colors.yellow }]}>Pause</Text>
          </Pressable>
        ) : (
          <Pressable
            style={[
              styles.controlButton,
              { backgroundColor: colors.accent, borderColor: colors.accent },
            ]}
            onPress={() => setIsRunning(true)}
          >
            <PlatformIcon
              iosName="play.fill"
              androidName="play-arrow"
              name="play-arrow"
              color="#FFFFFF"
              size={20}
            />
            <Text style={[styles.controlButtonText, { color: "#FFFFFF" }]}>Resume</Text>
          </Pressable>
        )}

        <Pressable
          style={[styles.controlButton, { backgroundColor: colors.redBg, borderColor: colors.red }]}
          onPress={handleEndSession}
        >
          <PlatformIcon
            iosName="stop.fill"
            androidName="stop"
            name="stop"
            color={colors.red}
            size={20}
          />
          <Text style={[styles.controlButtonText, { color: colors.red }]}>End</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  timeDisplayContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  timeDisplay: {
    fontSize: 56,
    fontWeight: "600",
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    letterSpacing: 2,
  },
  noSessionText: {
    fontSize: 14,
    fontWeight: "400",
    marginTop: 12,
  },
  startButton: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  controls: {
    flexDirection: "row",
    gap: 10,
  },
  controlButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    gap: 6,
    flex: 1,
  },
  controlButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
});

export default StopWatch;
