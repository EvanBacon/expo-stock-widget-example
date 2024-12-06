import { StyleSheet, View, Button } from "react-native";
import { updateWidget } from "@/components/updateWidget";

export default function HomeScreen() {
  const handleUpdateWidget = () => {
    updateWidget({
      currentValue: Math.random() * 1000,
      dailyChange: Math.random() * 10,
      dailyChangePercent: Math.random(),
    });
  };

  return (
    <View style={styles.container}>
      <Button title="Update Stock Widget" onPress={handleUpdateWidget} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
