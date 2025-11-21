import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Layout() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0d0d0d" }}>
      <StatusBar barStyle="light-content" backgroundColor="#0d0d0d" />

      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#0d0d0d" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold", fontSize: 20 },
          contentStyle: { backgroundColor: "#0d0d0d" },
        }}
      />
    </SafeAreaView>
  );
}
