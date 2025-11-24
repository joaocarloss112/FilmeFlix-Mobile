import { Stack } from "expo-router";
import { StatusBar, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Navbar from "../destaques/Navbar";

export default function Layout() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0d0d0d" }}>
      <StatusBar barStyle="light-content" backgroundColor="#0d0d0d" />
      <Navbar />
      <View style={{ flex: 1 }}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "#0d0d0d" },
          }}
        />
      </View>
    </SafeAreaView>
  );
}
