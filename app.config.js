/**
 * Expo App Configuration
 * This file handles environment variables for both development and EAS builds
 * 
 * For local development: Reads from .env file
 * For EAS builds: Uses environment variables set via EAS secrets
 */

module.exports = {
  expo: {
    name: "ServePOS",
    slug: "ServePOS",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "servepos",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        backgroundColor: "#E6F4FE",
        foregroundImage: "./assets/images/android-icon-foreground.png",
        backgroundImage: "./assets/images/android-icon-background.png",
        monochromeImage: "./assets/images/android-icon-monochrome.png"
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false
    },
    web: {
      output: "static",
      favicon: "./assets/images/favicon.png"
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
          dark: {
            backgroundColor: "#000000"
          }
        }
      ]
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true
    },
    extra: {
      router: {},
      eas: {
        projectId: "a56eca27-5d4b-4bf4-9442-d9777e5165ef"
      },
      // Environment variables will be injected here
      // In development: from .env file (via process.env)
      // In EAS builds: from EAS secrets (via process.env during build)
      apiUrl: process.env.EXPO_PUBLIC_API_URL || "",
      tenantSlug: process.env.EXPO_PUBLIC_TENANT_SLUG || "default"
    },
    owner: "randyreb"
  }
};
