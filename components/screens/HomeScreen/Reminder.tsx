import React from "react";
import { StyleSheet, Text, View } from "react-native";

function ReminderPoints() {
  return (
    <View style={styles.reminderBox}>
      <Text style={styles.reminderTitle}>Before you go:</Text>
      <View style={styles.reminderItem}>
        <Text style={styles.bulletPoint}>•</Text>
        <Text style={styles.reminderText}>
          Make sure your dog is wearing a leash
        </Text>
      </View>
      <View style={styles.reminderItem}>
        <Text style={styles.bulletPoint}>•</Text>
        <Text style={styles.reminderText}>Bring water and waste bags</Text>
      </View>
      <View style={styles.reminderItem}>
        <Text style={styles.bulletPoint}>•</Text>
        <Text style={styles.reminderText}>
          Check the weather before heading out
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  reminderBox: {
    marginTop: 5,
    padding: 15,
    borderRadius: 8,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    width: "100%",
  },
  reminderTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  reminderItem: {
    flexDirection: "row",
    marginBottom: 6,
    alignItems: "flex-start",
  },
  bulletPoint: {
    fontSize: 16,
    marginRight: 8,
    color: "#FF7001",
  },
  reminderText: {
    fontSize: 14,
    color: "#555",
    flex: 1,
  },
});

export default ReminderPoints;
