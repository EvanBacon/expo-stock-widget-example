import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";

import { Stack } from "expo-router";
import { useColorScheme } from "react-native";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerTransparent: process.env.EXPO_OS === "ios",
          headerBlurEffect: "systemChromeMaterial",
          headerShadowVisible: true,
          headerLargeTitleShadowVisible: false,
          headerStyle: {
            // Hack to ensure the collapsed small header shows the shadow / border.
            backgroundColor: "rgba(255,255,255,0.01)",
          },
          headerLargeTitle: true,
          title: "Expo Stocks",
        }}
      />
    </ThemeProvider>
  );
}
