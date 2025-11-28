import { Stack, usePathname } from "expo-router";
import { StatusBar, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Navbar from "../destaques/Navbar";

export default function Layout() {
  const pathname = usePathname();
  const hideNavbar = pathname === "/login";

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#0d0d0d" }}>
        <StatusBar barStyle="light-content" backgroundColor="#0d0d0d" />
        {!hideNavbar && <Navbar />}
        <View style={{ flex: 1 }}>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: "#0d0d0d" },
            }}
          />
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
