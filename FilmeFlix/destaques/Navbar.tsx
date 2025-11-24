import { useState, useEffect } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { getCurrentUser, logout } from "../lib/auth";

export default function Navbar() {
  const router = useRouter();

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
        padding: 16,
        backgroundColor: "#111",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
        <Text style={{ color: "#e50914", fontSize: 28, fontWeight: "bold" }}>
          FilmeFlix
        </Text>

        <Pressable onPress={() => router.push("/")}>
          <Text style={{ color: "white", fontSize: 16 }}>Home</Text>
        </Pressable>

        {user && (
          <Pressable onPress={() => router.push({ pathname: "favorites" } as any)}>
            <Text style={{ color: "white", fontSize: 16 }}>Favoritos</Text>
          </Pressable>
        )}
      </View>
      <View
        style={{
          flexDirection: "row",
          backgroundColor: "#222",
          borderRadius: 20,
          paddingHorizontal: 12,
          paddingVertical: 5,
          alignItems: "center",
        }}
      >
        <TextInput
          placeholder="Buscar filmes..."
          placeholderTextColor="#888"
          value={searchTerm}
          onChangeText={setSearchTerm}
          onSubmitEditing={handleSearch}
          style={{ color: "white", width: 150 }}
        />

        <Pressable onPress={handleSearch}>
          <FontAwesome name="search" size={18} color="white" />
        </Pressable>
      </View>
      <View style={{ flexDirection: "row", gap: 10 }}>
        {!user ? (
          <Pressable onPress={() => router.push({ pathname: "login" } as any)}>
            <Text style={{ color: "white", fontSize: 16 }}>Login</Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={handleLogout}
            style={{
              backgroundColor: "red",
              borderRadius: 6,
              paddingHorizontal: 10,
              paddingVertical: 6,
            }}
          >
            <Text style={{ color: "white" }}>Sair</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}
