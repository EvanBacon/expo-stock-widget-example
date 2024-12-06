import HomePage from "@/components/stockHome";
import { updateWidget } from "@/components/updateWidget";

export default function HomeScreen() {
  return (
    <HomePage
      updateWidget={(props) => {
        updateWidget({
          currentValue: props.currentValue,
          dailyChange: props.dailyChange,
          dailyChangePercent: props.dailyChangePercent,
          historyData: props.historyData,
        });
      }}
      dom={{
        textInteractionEnabled: false,
        pullToRefreshEnabled: true,
        forceDarkOn: true,
      }}
    />
  );
}
