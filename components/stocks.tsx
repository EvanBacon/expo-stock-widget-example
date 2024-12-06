import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Generate random price changes with controlled volatility
const generateNewPrice = (basePrice) => {
  const volatilityPercentage = 0.1; // 0.1% volatility
  const change = basePrice * volatilityPercentage * (Math.random() * 2 - 1);
  return Number((basePrice + change).toFixed(2));
};

// Generate historical data points that maintain value range
const generateHistoricalData = (baseValue, numPoints = 24) => {
  const volatility = baseValue * 0.02; // 2% volatility range
  const data = [];
  let currentValue = baseValue;

  for (let i = 0; i < numPoints; i++) {
    const timestamp = new Date(Date.now() - (numPoints - i) * 30 * 60 * 1000);

    // Generate change that's mean-reverting around baseValue
    const distanceFromBase = currentValue - baseValue;
    const meanReversion = -distanceFromBase * 0.1; // Pull back towards base value
    const randomWalk = (Math.random() * 2 - 1) * volatility;
    currentValue = currentValue + meanReversion + randomWalk;

    // Ensure value stays within reasonable bounds
    currentValue = Math.max(
      baseValue * 0.9,
      Math.min(baseValue * 1.1, currentValue)
    );

    data.push({
      timestamp: timestamp.toISOString(),
      value: Number(currentValue.toFixed(2)),
    });
  }

  return data;
};

const StockCard = ({ symbol, name, price, change }) => (
  <div className="bg-white dark:bg-[#1C1C1E] rounded-xl p-4 shadow-sm">
    <div className="flex justify-between items-start">
      <div>
        <h3 className="font-semibold text-lg dark:text-white">{symbol}</h3>
        <p className="text-gray-500 dark:text-[#98989F] text-sm">{name}</p>
      </div>
      <div className="text-right">
        <p className="font-semibold text-lg dark:text-white">${price}</p>
        <p className={change > 0 ? "text-[#30D158]" : "text-[#FF453A]"}>
          {change > 0 ? "+" : ""}
          {change}%
        </p>
      </div>
    </div>
  </div>
);

const HomePage = ({
  updateWidget,
}: {
  updateWidget: (arg0: {
    currentValue: number;
    dailyChange: number;
    dailyChangePercent: number;
    historyData: { timestamp: string; value: number }[];
  }) => void;
}) => {
  const basePortfolioValue = 84521.63;
  const [portfolioValue, setPortfolioValue] = useState(basePortfolioValue);
  const [portfolioChange, setPortfolioChange] = useState(1242.35);
  const [historyData, setHistoryData] = useState(() =>
    generateHistoricalData(basePortfolioValue)
  );
  const [stocks, setStocks] = useState([
    { symbol: "AAPL", name: "Apple Inc.", price: 178.32, change: 2.45 },
    { symbol: "TSLA", name: "Tesla, Inc.", price: 238.45, change: -1.23 },
    {
      symbol: "MSFT",
      name: "Microsoft Corporation",
      price: 338.11,
      change: 0.89,
    },
  ]);

  // Convert history data to chart format
  const chartData = historyData.map((item) => ({
    date: new Date(item.timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    value: item.value,
  }));

  useEffect(() => {
    const openingValue = historyData[0].value;
    const dailyChange = portfolioValue - openingValue;
    const dailyChangePercent = (dailyChange / openingValue) * 100;

    setPortfolioChange(dailyChange);

    updateWidget({
      currentValue: portfolioValue,
      dailyChange,
      dailyChangePercent,
      historyData,
    });
  }, [historyData, portfolioValue]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Update portfolio value with mean reversion
      setPortfolioValue((prevValue) => {
        const distanceFromBase = prevValue - basePortfolioValue;
        const meanReversion = -distanceFromBase * 0.1;
        const randomWalk = basePortfolioValue * 0.001 * (Math.random() * 2 - 1);
        const newValue = prevValue + meanReversion + randomWalk;

        // Keep value within ±10% of base value
        return Number(
          Math.max(
            basePortfolioValue * 0.9,
            Math.min(basePortfolioValue * 1.1, newValue)
          ).toFixed(2)
        );
      });

      // Update historical data
      setHistoryData((prevHistory) => {
        const newDataPoint = {
          timestamp: new Date().toISOString(),
          value: portfolioValue,
        };
        return [...prevHistory.slice(1), newDataPoint];
      });

      // Update stock prices with similar mean reversion
      setStocks((prevStocks) =>
        prevStocks.map((stock) => {
          const basePrice = parseFloat(stock.price);
          const newPrice = generateNewPrice(basePrice);
          const priceChange = ((newPrice - basePrice) / basePrice) * 100;
          return {
            ...stock,
            price: newPrice,
            change: Number((stock.change + priceChange).toFixed(2)),
          };
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [portfolioValue]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black container">
      {/* Header */}
      <div className="bg-white dark:bg-[#1C1C1E]">
        <div className="px-4 pt-2 pb-4">
          {/* Portfolio Value */}
          <div className="mb-6">
            <p className="text-gray-500 dark:text-[#98989F] text-sm mb-1">
              Total Balance
            </p>
            <h2 className="text-4xl font-bold dark:text-white">
              ${portfolioValue.toFixed(2)}
            </h2>
            <p
              className={
                portfolioChange >= 0 ? "text-[#30D158]" : "text-[#FF453A]"
              }
            >
              {portfolioChange >= 0 ? "+" : ""}
              {portfolioChange.toFixed(2)} (
              {((portfolioChange / portfolioValue) * 100).toFixed(2)}%)
            </p>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white dark:bg-[#1C1C1E] px-4 py-6 mb-4">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#98989F" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#98989F" }}
                domain={["auto", "auto"]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#2C2C2E",
                  border: "none",
                  borderRadius: "0.5rem",
                  color: "white",
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#30D158"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Time Range Selector */}
        <div className="flex gap-3 mt-4">
          {["1D", "1W", "1M", "3M", "1Y", "All"].map((range) => (
            <button
              key={range}
              className={`px-4 py-1 rounded-full text-sm ${
                range === "1M"
                  ? "bg-[#0A84FF] text-white"
                  : "bg-[#2C2C2E] dark:text-[#98989F]"
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Watchlist */}
      <div className="px-4 pb-6">
        <h3 className="text-lg font-semibold mb-4 dark:text-white">
          Watchlist
        </h3>
        <div className="space-y-3">
          {stocks.map((stock) => (
            <StockCard
              key={stock.symbol}
              symbol={stock.symbol}
              name={stock.name}
              price={stock.price}
              change={stock.change}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
