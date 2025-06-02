import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, View } from "react-native";

import { useTracker } from "@/hooks/tracker-context";
import * as Location from "expo-location";
import MapView, { Polyline } from "react-native-maps";

interface LocationProps {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export default function TrackedPathScreen() {
  const [location, setLocation] = useState<LocationProps | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { trackedPaths, setTrackedPaths } = useTracker();

  const getCurrentLocation = async () => {
    try {
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
      Alert.alert("Error", "Failed to get your location");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCurrentLocation();

    return () => {
      setTrackedPaths([]);
    };
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066cc" />
        <Text style={styles.loadingText}>Locating your tracked walk...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {location && (
        <MapView
          style={styles.map}
          initialRegion={location as LocationProps}
          showsMyLocationButton={true}
        >
          {trackedPaths.length > 1 && (
            <Polyline
              coordinates={trackedPaths.map((point) => ({
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
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    fontSize: 24,
    marginBottom: 16,
    color: "#000000",
    fontWeight: "bold",
  },
  description: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
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
});
