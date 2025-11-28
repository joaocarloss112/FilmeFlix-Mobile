import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { getCurrentUser, logout } from "../lib/auth";
import { useStore } from "../lib/store";

export default function Navbar() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isMobile = width < 600;

  const { user: storeUser } = useStore();

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
    <View style={styles.navbar}>
      {/* Linha superior */}
      <View style={styles.rowBetween}>
        {/* Página Home */}
        <Pressable onPress={() => router.push("/")}>
          <Text style={styles.navLink}>Home</Text>
        </Pressable>

        {/* LOGO Netflix Style */}
        <Text style={styles.logo}>FilmeFlix</Text>

        {/* Botões */}
        {storeUser ? (
          <View style={styles.rowGap}>
            <Pressable
              onPress={() => router.push("/favoritos")}
              style={styles.buttonPrimary}
            >
              <Text style={styles.buttonPrimaryText}>Favoritos</Text>
            </Pressable>

            <Pressable onPress={handleLogout} style={styles.buttonDanger}>
              <Text style={styles.buttonPrimaryText}>Sair</Text>
            </Pressable>
          </View>
        ) : (
          <Pressable onPress={() => router.push("login" as any)}>
            <Text style={styles.navLink}>Login</Text>
          </Pressable>
        )}
      </View>

      {/* Campo de Busca */}
      <View
        style={[
          styles.searchWrapper,
          { width: isMobile ? "100%" : 260 },
        ]}
      >
        <TextInput
          placeholder="Buscar filmes..."
          placeholderTextColor="#888"
          value={searchTerm}
          onChangeText={setSearchTerm}
          onSubmitEditing={handleSearch}
          style={styles.searchInput}
        />

        <Pressable onPress={handleSearch}>
          <FontAwesome name="search" size={18} color="white" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    width: "100%",
    paddingTop: 18,
    paddingBottom: 12,
    paddingHorizontal: 20,
    backgroundColor: "#0D0D0D",
    borderBottomWidth: 1,
    borderBottomColor: "#222",
    gap: 14,
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  rowGap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  logo: {
    color: "#E50914",
    fontSize: 30,
    fontWeight: "900",
    flex: 1,
    textAlign: "center",
    letterSpacing: 1,
  },

  navLink: {
    color: "#fff",
    fontSize: 16,
    paddingHorizontal: 6,
  },

  buttonPrimary: {
    backgroundColor: "#E50914",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },

  buttonDanger: {
    backgroundColor: "#B30000",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },

  buttonPrimaryText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },

  searchWrapper: {
    flexDirection: "row",
    backgroundColor: "#1A1A1A",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: "center",
  },

  searchInput: {
    flex: 1,
    color: "white",
    fontSize: 14,
    paddingVertical: 4,
  },
});
