import { StyleSheet, Platform, ScrollView } from "react-native";

import { HelloWave } from "@/components/HelloWave";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import SmartSettings from "local:smart-settings";

function updateWidget({
  currentValue,
  dailyChange,
  dailyChangePercent,
}: {
  currentValue: number;
  dailyChange: number;
  dailyChangePercent: number;
}) {
  const appGroup = "group.bacon.data";
  if (process.env.EXPO_OS === "ios") {
    // Update the iOS widget with the latest data.
    SmartSettings.set("currentValue", currentValue, appGroup);
    SmartSettings.set("dailyChange", dailyChange, appGroup);
    SmartSettings.set("dailyChangePercent", dailyChangePercent, appGroup);

    // Generate fake stock history data. like:
    const baseTime = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const updatedHistory: { timestamp: string; value: number }[] = new Array(24)
      .fill(0)
      .map((_, index) => {
        const value = 20000 + index * 10 + Math.random() * 100 - 50;
        return {
          timestamp: new Date(
            baseTime.getTime() + index * 60 * 60 * 1000
          ).toISOString(),
          value,
        };
      });

    SmartSettings.storeData("historyData", updatedHistory, appGroup);
    SmartSettings.reloadAllTimelines();
  }
}

export default function HomeScreen() {
  return (
    <ScrollView>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText
          type="subtitle"
          onPress={() => {
            updateWidget({
              currentValue: Math.random() * 1000,
              dailyChange: Math.random() * 10,
              dailyChangePercent: Math.random(),
            });
          }}
        >
          Step 1: Try it
        </ThemedText>
        <ThemedText>
          Edit{" "}
          <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText>{" "}
          to see changes. Press{" "}
          <ThemedText type="defaultSemiBold">
            {Platform.select({
              ios: "cmd + d",
              android: "cmd + m",
              web: "F12",
            })}
          </ThemedText>{" "}
          to open developer tools.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 2: Explore</ThemedText>
        <ThemedText>
          Tap the Explore tab to learn more about what's included in this
          starter app.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
        <ThemedText>
          When you're ready, run{" "}
          <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText>{" "}
          to get a fresh <ThemedText type="defaultSemiBold">app</ThemedText>{" "}
          directory. This will move the current{" "}
          <ThemedText type="defaultSemiBold">app</ThemedText> to{" "}
          <ThemedText type="defaultSemiBold">app-example</ThemedText>.
        </ThemedText>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
