import { useThemedColors } from "@/styles/globalStyles";
import { StyleSheet, Text, View } from "react-native";
import PlatformIcon from "../PlatformIcon";

interface UsageStatisticsProps {
  totalHours: number;
  hoursSinceService: number;
  totalSessions: number;
  avgHoursPerSession: number;
}

const UsageStatistics = ({
  totalHours,
  hoursSinceService,
  totalSessions,
  avgHoursPerSession,
}: UsageStatisticsProps) => {
  const colors = useThemedColors();

  const formatHours = (hours: number) => {
    return hours.toFixed(1);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <PlatformIcon
          iosName="chart.bar"
          androidName="bar-chart"
          name="bar-chart"
          size={16}
          color={colors.text}
        />
        <Text style={[styles.headerText, { color: colors.text }]}>Usage Statistics</Text>
      </View>

      {/* Statistics Grid */}
      <View style={styles.grid}>
        {/* Total Hours */}
        <View
          style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <PlatformIcon
            iosName="clock"
            androidName="schedule"
            name="schedule"
            size={18}
            color={colors.accent}
          />
          <Text style={[styles.statValue, { color: colors.text }]}>{formatHours(totalHours)}</Text>
          <Text style={[styles.statLabel, { color: colors.softText }]}>Total Hours</Text>
        </View>

        {/* Hours Since Service */}
        <View
          style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <PlatformIcon
            iosName="chart.line.uptrend.xyaxis"
            androidName="trending-up"
            name="trending-up"
            size={18}
            color={colors.accent}
          />
          <Text style={[styles.statValue, { color: colors.text }]}>
            {formatHours(hoursSinceService)}
          </Text>
          <Text style={[styles.statLabel, { color: colors.softText }]}>Hours Since Service</Text>
        </View>

        {/* Total Sessions */}
        <View
          style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <PlatformIcon
            iosName="waveform"
            androidName="show-chart"
            name="show-chart"
            size={18}
            color={colors.accent}
          />
          <Text style={[styles.statValue, { color: colors.text }]}>{totalSessions}</Text>
          <Text style={[styles.statLabel, { color: colors.softText }]}>Total Sessions</Text>
        </View>

        {/* Average Hours per Session */}
        <View
          style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <PlatformIcon
            iosName="timer"
            androidName="av-timer"
            name="av-timer"
            size={18}
            color={colors.accent}
          />
          <Text style={[styles.statValue, { color: colors.text }]}>
            {formatHours(avgHoursPerSession)}
          </Text>
          <Text style={[styles.statLabel, { color: colors.softText }]}>Avg Hours/Session</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 10,
  },
  headerText: {
    fontSize: 15,
    fontWeight: "600",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  statCard: {
    flex: 1,
    minWidth: "47%",
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "flex-start",
    gap: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    marginTop: 2,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: "500",
  },
});

export default UsageStatistics;
