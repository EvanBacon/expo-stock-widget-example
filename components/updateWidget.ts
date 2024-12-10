import { ExtensionStorage } from "@bacons/apple-targets";

const storage = new ExtensionStorage("group.bacon.data");

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
    storage.set("currentValue", currentValue);
    storage.set("dailyChange", dailyChange);
    storage.set("dailyChangePercent", dailyChangePercent);

    if (historyData) {
      storage.set("historyData", historyData);
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

      storage.set("historyData", updatedHistory);
    }

    ExtensionStorage.reloadWidget();
  }
}
