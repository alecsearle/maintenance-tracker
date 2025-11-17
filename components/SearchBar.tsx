import PlatformIcon from "@/components/PlatformIcon";
import { useThemedColors } from "@/styles/globalStyles";
import { useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories: string[];
}

const SearchBar = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
}: SearchBarProps) => {
  const colors = useThemedColors();
  const [showFilters, setShowFilters] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        {/* Search Input */}
        <View
          style={[
            styles.searchContainer,
            {
              backgroundColor: colors.background,
              borderColor: colors.border,
            },
          ]}
        >
          <Text style={[styles.searchIcon, { color: colors.border }]}>
            <PlatformIcon
              iosName="magnifyingglass"
              androidName="construct"
              name="construct"
              color={colors.border}
              size={16}
            />
          </Text>
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search tools..."
            placeholderTextColor={colors.border}
            value={searchQuery}
            onChangeText={onSearchChange}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => onSearchChange("")}>
              <Text style={[styles.clearButton, { color: colors.border }]}>✕</Text>
            </Pressable>
          )}
        </View>

        {/* Filter Toggle Button */}
        <Pressable
          style={[
            styles.filterButton,
            {
              backgroundColor: colors.background,
              borderColor: colors.border,
            },
          ]}
          onPress={() => setShowFilters(!showFilters)}
        >
          <PlatformIcon
            iosName="line.3.horizontal.decrease"
            androidName="filter-list"
            name="filter-list"
            color={colors.text}
            size={20}
          />
          {selectedCategory && (
            <View style={[styles.badge, { backgroundColor: colors.accent }]}>
              <Text style={[styles.badgeText, { color: colors.card }]}>1</Text>
            </View>
          )}
        </Pressable>
      </View>

      {/* Category Filters */}
      {showFilters && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContainer}
        >
          {/* All Categories Option */}
          <Pressable
            style={[
              styles.categoryChip,
              {
                backgroundColor: !selectedCategory ? colors.primary : "transparent",
                borderColor: !selectedCategory ? colors.primary : colors.border,
              },
            ]}
            onPress={() => onCategoryChange("")}
          >
            <Text
              style={[
                styles.categoryChipText,
                {
                  color: !selectedCategory ? colors.secondary : colors.text,
                  fontWeight: !selectedCategory ? "600" : "400",
                },
              ]}
            >
              All
            </Text>
          </Pressable>

          {/* Individual Categories */}
          {categories.map((category) => (
            <Pressable
              key={category}
              style={[
                styles.categoryChip,
                {
                  backgroundColor: selectedCategory === category ? colors.primary : "transparent",
                  borderColor: selectedCategory === category ? colors.primary : colors.border,
                },
              ]}
              onPress={() => onCategoryChange(category === selectedCategory ? "" : category)}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  {
                    color: selectedCategory === category ? colors.secondary : colors.text,
                    fontWeight: selectedCategory === category ? "600" : "400",
                  },
                ]}
              >
                {category}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  topRow: {
    flexDirection: "row",
    gap: 8,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "ios" ? 12 : 8,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    padding: 0,
  },
  clearButton: {
    fontSize: 18,
    paddingHorizontal: 4,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    position: "relative",
    minWidth: 50,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  badge: {
    position: "absolute",
    top: -6,
    right: -6,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
  },
  filtersContainer: {
    marginTop: 8,
    paddingVertical: 2,
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    marginRight: 6,
  },
  categoryChipText: {
    fontSize: 12,
  },
});

export default SearchBar;
