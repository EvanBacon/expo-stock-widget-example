import SmartSettings from "local:smart-settings";

const appGroup = "group.bacon.data";

export function updateWidget({
  currentValue,
  dailyChange,
  dailyChangePercent,
  historyData,
}: {
  currentValue: number;
  dailyChange: number;
  dailyChangePercent: number;
  historyData?: { timestamp: string; value: number }[];
}) {
  if (process.env.EXPO_OS === "ios") {
    // Update the iOS widget with the latest data.
    SmartSettings.set("currentValue", currentValue, appGroup);
    SmartSettings.set("dailyChange", dailyChange, appGroup);
    SmartSettings.set("dailyChangePercent", dailyChangePercent, appGroup);

    if (historyData) {
      SmartSettings.storeData("historyData", historyData, appGroup);
    } else {
      // Generate fake stock history data. like:
      const baseTime = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const updatedHistory: { timestamp: string; value: number }[] = new Array(
        24
      )
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
    }
    SmartSettings.reloadAllTimelines();
  }
}
