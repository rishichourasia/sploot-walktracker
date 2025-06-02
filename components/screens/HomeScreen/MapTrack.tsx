import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView, { Polyline } from "react-native-maps";

import { LocationProps } from "@/app/(tabs)";
import { ThemedView } from "@/components/Utility/ThemedView";
import { formatTime, formatTimer, saveWalk } from "@/utils/helpers";
import * as Location from "expo-location";
import LottieView from "lottie-react-native";
import ReminderPoints from "./Reminder";

const MapTrack = ({ location }: { location: LocationProps }) => {
  const [walkPath, setWalkPath] = useState<LocationProps[]>([]);
  const [seconds, setSeconds] = useState(0);
  const [isTracking, setIsTracking] = useState<boolean>(false);

  const walkCompleteActions = async () => {
    await saveWalk(walkPath, seconds);
    Alert.alert(
      "Walk Completed!",
      "Your tracked walk has been saved. view past walk screen for more details. \n \n Time: " +
        formatTime(seconds),
      [{ text: "OK" }],
      { userInterfaceStyle: "light" }
    );
    setWalkPath([]);
    setSeconds(0);
  };

  useEffect(() => {
    let interval = null;

    if (isTracking) {
      interval = setInterval(() => {
        setSeconds((seconds) => seconds + 1);
      }, 1000);
    } else if (walkPath.length > 0) {
      interval = null;
      walkCompleteActions();
    }

    return () => {
      clearInterval(interval as number);
      setSeconds(0);
    };
  }, [isTracking]);

  const startWalk = async () => {
    if (!location) {
      Alert.alert("Error", "Cannot start walk without location");
      return;
    }

    setWalkPath([]);
    setIsTracking(true);

    await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.BestForNavigation,
        distanceInterval: 3,
        timeInterval: 5000,
      },
      (newLocation) => {
        console.log("New location:", newLocation);
        const { latitude, longitude } = newLocation.coords;

        setWalkPath((prevPath) => [
          ...prevPath,
          {
            latitude,
            longitude,
            latitudeDelta: 0.001,
            longitudeDelta: 0.001,
          },
        ]);
      }
    );
  };

  const stopWalk = () => {
    setIsTracking(false);
  };

  const toggleWalkTracking = () => {
    if (isTracking) {
      stopWalk();
    } else {
      startWalk();
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={location as LocationProps}
        showsUserLocation={true}
        showsMyLocationButton={true}
        followsUserLocation={true}
        showsCompass={true}
        showsScale={true}
        onMapReady={() => {
          console.log("Map loaded");
        }}
      >
        {walkPath.length > 1 && (
          <Polyline
            coordinates={walkPath.map((point) => ({
              latitude: point.latitude,
              longitude: point.longitude,
            }))}
            strokeColor="#FF7001"
            strokeWidth={4}
            lineDashPattern={[0]}
            lineCap="round"
          />
        )}
      </MapView>
      <ThemedView>
        <ThemedView style={styles.trackContainer}>
          <View style={styles.trackTextContainer}>
            <Text style={styles.trackText}>
              {!isTracking
                ? "Ready to track your dog's walk?"
                : "Walk in progress"}
            </Text>
            {isTracking && (
              <LottieView
                source={{
                  uri: "https://lottie.host/b8042492-6d37-409b-956b-4e68ea1a6e10/23awwsqctY.lottie",
                }}
                autoPlay
                loop
                style={{ width: 27, height: 27 }}
              />
            )}
          </View>
          {!isTracking ? (
            <ReminderPoints />
          ) : (
            <View style={styles.statsContainer}>
              <View style={styles.statBox}>
                <Text style={styles.statTitle}>Time Elapsed</Text>
                <Text style={styles.statValue}>{formatTimer(seconds)}</Text>
              </View>
            </View>
          )}

          <TouchableOpacity
            style={styles.trackButton}
            onPress={toggleWalkTracking}
          >
            <Text style={styles.trackButtonText}>
              {isTracking ? "Stop" : "Tap to start"}
            </Text>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  trackContainer: {
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
  },
  map: {
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
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#d32f2f",
    textAlign: "center",
  },
  trackText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  trackButton: {
    backgroundColor: "#FF7001",
    width: 95,
    height: 95,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    borderWidth: 4,
    borderColor: "#E0E0E0",
  },
  trackButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  statsContainer: {
    marginTop: 5,
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    marginBottom: 35,
  },
  statBox: {
    width: "48%",
    padding: 15,
    borderRadius: 8,
    backgroundColor: "white",
    alignItems: "center",
    marginTop: 5,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  statTitle: {
    fontSize: 14,
    color: "#777",
    marginBottom: 5,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  trackTextContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 5,
  },
});

export default MapTrack;
