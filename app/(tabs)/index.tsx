import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { ThemedView } from "@/components/ThemedView";
import LottieView from "lottie-react-native";
import React, { useEffect, useRef, useState } from "react";
import MapView, { Polyline } from "react-native-maps";

import { saveWalk } from "@/utils/helpers";
import * as Location from "expo-location";

interface LocationProps {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export default function HomeScreen() {
  const [location, setLocation] = useState<LocationProps | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [walkPath, setWalkPath] = useState<LocationProps[]>([]);
  const [seconds, setSeconds] = useState(0);
  const [isTracking, setIsTracking] = useState<boolean>(false);
  const locationWatchId = useRef<any>(null);
  const mapRef = useRef<MapView>(null);

  const walkCompleteActions = async () => {
    await saveWalk(walkPath, seconds, 0);
    Alert.alert(
      "Walk Completed!",
      "Your tracked walk has been saved. view past walk screen for more details. \n \n Time: " +
        formatTime(seconds),
      [{ text: "OK" }],
      { userInterfaceStyle: "light" }
    );
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

  const formatTime = (totalSeconds: number) => {
    const min = Math.floor(totalSeconds / 60);
    const sec = totalSeconds % 60;
    return `${min}:${sec.toString().padStart(2, "0")}`;
  };

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission to access location was denied",
          "Please enable location permissions in your settings to track walks.",
          [
            {
              text: "OK",
              onPress: () => getCurrentLocation(),
            },
          ]
        );
        setErrorMsg("Permission to access location was denied");
        setLoading(false);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude } = currentLocation.coords;

      setLocation({
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    } catch (error) {
      setErrorMsg("Error getting location: " + error);
      Alert.alert("Error", "Failed to get your location");
    } finally {
      setLoading(false);
    }
  };

  const startWalk = async () => {
    if (!location) {
      Alert.alert("Error", "Cannot start walk without location");
      return;
    }

    // Clear previous path if any
    setWalkPath([location]);
    setIsTracking(true);

    // Start watching position changes
    locationWatchId.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.BestForNavigation,
        distanceInterval: 3,
        timeInterval: 5000,
      },
      (newLocation) => {
        console.log("New location:", newLocation);
        const { latitude, longitude } = newLocation.coords;

        // Add new point to path
        setWalkPath((prevPath) => [
          ...prevPath,
          {
            latitude,
            longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          },
        ]);
      }
    );
  };

  // Stop tracking the walk
  const stopWalk = () => {
    if (locationWatchId.current) {
      locationWatchId.current.remove();
      locationWatchId.current = null;
    }
    setIsTracking(false);
  };

  const toggleWalkTracking = () => {
    if (isTracking) {
      stopWalk();
    } else {
      startWalk();
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066cc" />
        <Text style={styles.loadingText}>Getting your location...</Text>
      </View>
    );
  }

  if (errorMsg) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{errorMsg}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {location && (
        <MapView
          ref={mapRef}
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
              strokeColor="#FF7001" // Header color
              strokeWidth={4}
              lineDashPattern={[0]} // Solid line
              lineCap="round"
            />
          )}
        </MapView>
      )}
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
                <Text style={styles.reminderText}>
                  Bring water and waste bags
                </Text>
              </View>
              <View style={styles.reminderItem}>
                <Text style={styles.bulletPoint}>•</Text>
                <Text style={styles.reminderText}>
                  Check the weather before heading out
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.statsContainer}>
              <View style={styles.statBox}>
                <Text style={styles.statTitle}>Time Elapsed</Text>
                <Text style={styles.statValue}>{formatTime(seconds)}</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statTitle}>Distance</Text>
                <Text style={styles.statValue}>0.0 KM</Text>
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
}

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
  statsContainer: {
    marginTop: 5,
    flexDirection: "row",
    justifyContent: "space-between",
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
