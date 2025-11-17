import PlatformIcon from "@/components/PlatformIcon";
import { useThemedColors } from "@/styles/globalStyles";
import { StyleSheet, Text, View } from "react-native";

const StatsCard = () => {
  const colors = useThemedColors();

  // Sample stats - replace with actual data
  const totalTools = 12;
  const dueSoon = 3;
  const overdue = 2;

  return (
    <View style={localStyles.statsContainer}>
      <View
        style={[localStyles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}
      >
        <View style={[localStyles.statIconContainer, { backgroundColor: colors.accentMinimal }]}>
          <PlatformIcon
            iosName="cube.box"
            androidName="inventory"
            name="archive"
            color={colors.accent}
            size={24}
          />
        </View>
        <Text style={[localStyles.statValue, { color: colors.text }]}>{totalTools}</Text>
        <Text style={[localStyles.statLabel, { color: colors.softText }]}>Total Tools</Text>
      </View>

      <View
        style={[localStyles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}
      >
        <View style={[localStyles.statIconContainer, { backgroundColor: colors.yellowBg }]}>
          <PlatformIcon
            iosName="clock"
            androidName="schedule"
            name="clock"
            color={colors.yellow}
            size={24}
          />
        </View>
        <Text style={[localStyles.statValue, { color: colors.text }]}>{dueSoon}</Text>
        <Text style={[localStyles.statLabel, { color: colors.softText }]}>Due Soon</Text>
      </View>

      <View
        style={[localStyles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}
      >
        <View style={[localStyles.statIconContainer, { backgroundColor: colors.redBg }]}>
          <PlatformIcon
            iosName="exclamationmark.triangle"
            androidName="warning"
            name="warning"
            color={colors.red}
            size={24}
          />
        </View>
        <Text style={[localStyles.statValue, { color: colors.text }]}>{overdue}</Text>
        <Text style={[localStyles.statLabel, { color: colors.softText }]}>Overdue</Text>
      </View>
    </View>
  );
};

const localStyles = StyleSheet.create({
  statsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    alignItems: "center",
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
  },
});

export default StatsCard;
