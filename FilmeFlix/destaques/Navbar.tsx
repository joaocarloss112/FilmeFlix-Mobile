import { useState, useEffect } from "react";
import { View, Text, TextInput, Pressable, useWindowDimensions } from "react-native";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { getCurrentUser, logout } from "../lib/auth";
import { useStore } from "../lib/store";

export default function Navbar() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isMobile = width < 600;

  const { user: storeUser } = useStore(); // pega usuário da store
  const [user, setUser] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function loadUser() {
      const u = await getCurrentUser();
      setUser(u);
    }
    loadUser();
  }, []);

  async function handleLogout() {
    await logout();
    setUser(null);
  }

  function handleSearch() {
    if (!searchTerm.trim()) return;
    router.push({ pathname: "pesquisa", params: { query: searchTerm } } as any);
    setSearchTerm("");
  }

  return (
    <View
      style={{
        width: "100%",
        paddingVertical: 16,
        paddingHorizontal: 20,
        backgroundColor: "#111",
        alignItems: "center",
        gap: 16,
      }}
    >
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Pressable onPress={() => router.push("/")}>
          <Text style={{ color: "white", fontSize: 16 }}>Home</Text>
        </Pressable>

        <Text
          style={{
            color: "#e50914",
            fontSize: 28,
            fontWeight: "bold",
            textAlign: "center",
            flex: 1,
          }}
        >
          FilmeFlix
        </Text>

        {storeUser ? (
          <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
            <Pressable
              onPress={() => router.push("/favoritos")}
              style={{
                backgroundColor: "#E50914",
                borderRadius: 6,
                paddingHorizontal: 12,
                paddingVertical: 6,
              }}
            >
              <Text style={{ color: "#fff" }}>Favoritos</Text>
            </Pressable>

            <Pressable
              onPress={handleLogout}
              style={{
                backgroundColor: "red",
                borderRadius: 6,
                paddingHorizontal: 12,
                paddingVertical: 6,
              }}
            >
              <Text style={{ color: "white" }}>Sair</Text>
            </Pressable>
          </View>
        ) : (
          <Pressable onPress={() => router.push("login" as any)}>
            <Text style={{ color: "white", fontSize: 16 }}>Login</Text>
          </Pressable>
        )}
      </View>

      <View
        style={{
          flexDirection: "row",
          backgroundColor: "#222",
          borderRadius: 20,
          paddingHorizontal: 12,
          paddingVertical: 6,
          alignItems: "center",
          width: isMobile ? "100%" : 250,
        }}
      >
        <TextInput
          placeholder="Buscar filmes..."
          placeholderTextColor="#888"
          value={searchTerm}
          onChangeText={setSearchTerm}
          onSubmitEditing={handleSearch}
          style={{
            color: "white",
            flex: 1,
            paddingVertical: 4,
          }}
        />
        <Pressable onPress={handleSearch}>
          <FontAwesome name="search" size={18} color="white" />
        </Pressable>
      </View>
    </View>
  );
}
