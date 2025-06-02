import { useTracker } from "@/hooks/tracker-context";
import { clearAllWalks, formatTime } from "@/utils/helpers";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useCallback } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function TabTwoScreen() {
  const {
    totalWalks,
    totalTime,
    walksToDisplay,
    isLoading,
    refreshSavedWalks,
    setTrackedPaths,
  } = useTracker();
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      console.log("screen in focus, refreshing data..");
      refreshSavedWalks();
    }, [])
  );

  const handleClearHistory = async () => {
    await clearAllWalks();
    refreshSavedWalks();
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066cc" />
        <Text style={styles.loadingText}>Loading your walks...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.displayContainer}>
        <View style={styles.displayBox}>
          <Text style={styles.statValue}>{totalWalks}</Text>
          <Text style={styles.statLabel}>Total Walks</Text>
        </View>

        <View style={styles.displayBox}>
          <Text style={styles.statValue}>{formatTime(totalTime)}</Text>
          <Text style={styles.statLabel}>Total Time</Text>
        </View>
      </View>

      <View style={styles.pastWalksContainer}>
        {walksToDisplay.map((walk, i) => (
          <TouchableOpacity
            key={i + 1}
            style={styles.walkCard}
            onPress={() => {
              setTrackedPaths(walk.pathArr);
              router.push(`/tracked-path`);
            }}
          >
            <View style={styles.walkIconContainer}>
              <FontAwesome name="paw" size={24} color="#4CAF50" />
            </View>
            <View style={styles.walkDetails}>
              <Text style={styles.walkTitle}>Walk #{i + 1}</Text>
              <View style={styles.walkStats}>
                <View style={styles.walkStat}>
                  <MaterialIcons name="timer" size={16} color="#666" />
                  <Text style={styles.walkStatText}>
                    {formatTime(walk.timeElapsed)}
                  </Text>
                </View>
              </View>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#CCC" />
          </TouchableOpacity>
        ))}
        {walksToDisplay.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No walks recorded yet</Text>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={handleClearHistory}
          >
            <Text style={styles.deleteBtnText}>Clear past walks</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  displayContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  displayBox: {
    flex: 1,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    padding: 16,
    marginHorizontal: 6,
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    marginTop: 8,
  },
  pastWalksContainer: {
    marginTop: 8,
  },
  walkCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  walkIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  walkDetails: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  walkTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  walkStats: {
    flexDirection: "row",
    alignItems: "center",
  },
  walkStat: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
  },
  walkStatText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
  },
  emptyState: {
    padding: 24,
    alignItems: "center",
  },
  emptyStateText: {
    color: "#999",
    fontSize: 16,
  },
  deleteBtn: {
    backgroundColor: "#FF7001",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
    marginBottom: 35,
  },
  deleteBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
