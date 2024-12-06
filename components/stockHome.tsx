"use dom";

import "@/global.css";

import Stocks from "./stocks";

const HomePage = ({
  updateWidget,
}: {
  updateWidget: (arg0: {
    currentValue: number;
    dailyChange: number;
    dailyChangePercent: number;
    historyData: { timestamp: string; value: number }[];
  }) => void;

  dom: import("expo/dom").DOMProps;
}) => {
  return <Stocks updateWidget={updateWidget} />;
};

export default HomePage;
