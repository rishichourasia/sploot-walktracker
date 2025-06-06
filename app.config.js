export default  {
  "expo": {
    "name": "sploot-walktracker",
    "slug": "sploot-walktracker",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/logo.png",
    "scheme": "splootwalktracker",
    "userInterfaceStyle": "automatic",
    "newArchEnabled": true,
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/logo.png",
        "backgroundColor": "#ffffff"
      },
      "edgeToEdgeEnabled": true,
      "package": "com.rishiexpo.splootwalktracker",
      "permissions": [
        "ACCESS_FINE_LOCATION",
        "ACCESS_COARSE_LOCATION"
      ],
      "config": {
        "googleMaps": {
          "apiKey": process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY
        }
      }
    },
    "web": {
      "bundler": "metro",
      "output": "static",
      "favicon": "./assets/images/favicon.png"
    },
    "plugins": [
      "expo-router",
      [
        "expo-splash-screen",
        {
          "image": "./assets/images/logo.png",
          "imageWidth": 200,
          "resizeMode": "contain",
          "backgroundColor": "#ffffff"
        }
      ],
      [
        "expo-location",
        {
          "locationAlwaysAndWhenInUsePermission": "Allow Sploot to use your location to track your walk."
        }
      ]
    ],
    "experiments": {
      "typedRoutes": true
    },
    "extra": {
      "router": {},
      "eas": {
        "projectId": "e20f8ea3-00a4-492b-a291-79ec29b1a2ae"
      }
    }
  }
}
