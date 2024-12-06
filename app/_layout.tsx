import { updateWidget } from "@/components/updateWidget";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";

import { Stack } from "expo-router";
import { Button, useColorScheme } from "react-native";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerTransparent: true,
          headerBlurEffect: "systemChromeMaterial",
          headerShadowVisible: true,
          headerLargeTitleShadowVisible: false,
          headerStyle: {
            // Hack to ensure the collapsed small header shows the shadow / border.
            backgroundColor: "rgba(255,255,255,0.01)",
          },
          headerLargeTitle: true,
          title: "Expo Stocks",
          headerRight: () => (
            <Button
              onPress={() => {
                // Perform reload action
                console.log("Reload button pressed");
                updateWidget({
                  currentValue: Math.random() * 1000,
                  dailyChange: Math.random() * 10,
                  dailyChangePercent: Math.random(),
                  // currentValue: Math.random() * 1000,
                  // dailyChange: Math.random() * 10,
                  // dailyChangePercent: Math.random(),
                });
              }}
              title="Reload"
            />
          ),
        }}
      ></Stack>
    </ThemeProvider>
  );
}
