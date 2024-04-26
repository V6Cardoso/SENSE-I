export default {
    expo: {
      name: "mobile",
      slug: "mobile",
      version: "1.0.0",
      orientation: "portrait",
      icon: "./assets/icon-no-bg.png",
      userInterfaceStyle: "light",
      splash: {
        image: "./assets/relatorioSplash.png",
        resizeMode: "contain",
        backgroundColor: "#ffffff",
      },
      assetBundlePatterns: ["**/*"],
      ios: {
        supportsTablet: true,
      },
      android: {
        adaptiveIcon: {
          foregroundImage: "./assets/icon-no-bg.png",
          backgroundColor: "#ffffff",
        },
        package: "com.v6cardoso.mobile",
        googleServicesFile: process.env.GOOGLE_SERVICES_JSON || "./google-services.json",
      },
      web: {
        favicon: "./assets/icon.png",
      },
      extra: {
        eas: {
          projectId: "8233ea99-7402-4c93-8d10-ad5c58178469",
        },
      },
      plugins: [
        ["expo-build-properties", {
          android: {
            usesCleartextTraffic: true,
          },
        }],
      ],
    },
  }
  