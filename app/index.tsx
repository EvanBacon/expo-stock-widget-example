import HomePage from "@/components/stockHome";
import { ExtensionStorage } from "@bacons/apple-targets";

const storage = new ExtensionStorage("group.bacon.data");

export default function HomeScreen() {
  return (
    <HomePage
      updateWidget={({
        currentValue,
        dailyChange,
        dailyChangePercent,
        historyData,
      }) => {
        if (process.env.EXPO_OS === "ios") {
          // Update the iOS widget with the latest data.
          storage.set("currentValue", currentValue);
          storage.set("dailyChange", dailyChange);
          storage.set("dailyChangePercent", dailyChangePercent);
          storage.set("historyData", historyData);

          // Reload the widget to reflect the changes.
          ExtensionStorage.reloadWidget();
        }
      }}
      dom={{
        textInteractionEnabled: false,
        pullToRefreshEnabled: true,
        forceDarkOn: true,
      }}
    />
  );
}
