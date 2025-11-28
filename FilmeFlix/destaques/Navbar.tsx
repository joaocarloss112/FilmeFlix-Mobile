import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  Animated,
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
  const [searchActive, setSearchActive] = useState(false);

  // Glow wave animation refs
  const waveScale = useRef(new Animated.Value(0)).current;
  const waveOpacity = useRef(new Animated.Value(0)).current;
  const [showWave, setShowWave] = useState(false);

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
    setSearchActive(false);
  }

  function handleLogoPress() {
    // Ao clicar no logo, executa efeito wave ao inves de navegar
    setShowWave(true);
    waveScale.setValue(0);
    waveOpacity.setValue(0.6);

    Animated.parallel([
      Animated.timing(waveScale, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.timing(waveOpacity, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // esconder após animação
      setTimeout(() => setShowWave(false), 80);
    });
  }

  return (
    <View style={styles.navbar}>
      {/* Linha superior */}
      <View style={styles.rowBetween}>
        {/* LOGO Netflix Style */}
        <Pressable onPress={handleLogoPress} style={styles.logoWrapper}>
          <Text style={styles.logo}>FilmeFlix</Text>

          {showWave && (
            <Animated.View
              pointerEvents="none"
              style={[
                styles.wave,
                {
                  opacity: waveOpacity,
                  transform: [
                    {
                      scale: waveScale.interpolate({ inputRange: [0, 1], outputRange: [0.2, 6] }),
                    },
                  ],
                },
              ]}
            />
          )}
        </Pressable>

        {/* Links de navegação */}
        <View style={styles.navLinksContainer}>
          <Pressable onPress={() => router.push("/")} style={styles.navLinkButton}>
            <Text style={styles.navLink}>Início</Text>
          </Pressable>
          
          {storeUser && (
            <Pressable onPress={() => router.push("/favoritos")} style={styles.navLinkButton}>
              <Text style={styles.navLink}>Meus Favoritos</Text>
            </Pressable>
          )}

          <Pressable onPress={() => router.push("/sobre")} style={styles.navLinkButton}>
            <Text style={styles.navLink}>Sobre</Text>
          </Pressable>
        </View>

        {/* Ações do usuário */}
        <View style={styles.actionContainer}>
          {storeUser ? (
            <>
              <View style={styles.userBadge}>
                <Text style={styles.userBadgeText}>{storeUser.username?.charAt(0).toUpperCase() || "U"}</Text>
              </View>
              <Pressable onPress={handleLogout} style={styles.logoutButton}>
                <FontAwesome name="sign-out" size={18} color="#fff" />
              </Pressable>
            </>
          ) : (
            <Pressable onPress={() => router.push("login" as any)} style={styles.loginButton}>
              <Text style={styles.loginButtonText}>Entrar</Text>
            </Pressable>
          )}
        </View>
      </View>

      {/* Campo de Busca */}
      <View style={styles.searchContainer}>
        <View
          style={[
            styles.searchWrapper,
            searchActive && styles.searchWrapperActive,
            { width: isMobile ? "100%" : 280 },
          ]}
        >
          <FontAwesome name="search" size={16} color="#aaa" style={styles.searchIcon} />
          <TextInput
            placeholder="Buscar filmes..."
            placeholderTextColor="#666"
            value={searchTerm}
            onChangeText={setSearchTerm}
            onFocus={() => setSearchActive(true)}
            onBlur={() => setSearchActive(false)}
            onSubmitEditing={handleSearch}
            style={styles.searchInput}
          />
          {searchTerm.length > 0 && (
            <Pressable onPress={() => setSearchTerm("")}>
              <FontAwesome name="times" size={16} color="#aaa" />
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    width: "100%",
    paddingTop: 14,
    paddingBottom: 12,
    paddingHorizontal: 20,
    backgroundColor: "#141414",
    borderBottomWidth: 1,
    borderBottomColor: "#2a2a2a",
    gap: 14,
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  logo: {
    color: "#e50914",
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: 1.5,
  },

  navLinksContainer: {
    flexDirection: "row",
    gap: 32,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  navLinkButton: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },

  navLink: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "500",
    letterSpacing: 0.3,
  },

  actionContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  userBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#e50914",
    justifyContent: "center",
    alignItems: "center",
  },

  userBadgeText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  loginButton: {
    backgroundColor: "#e50914",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },

  loginButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0.3,
  },

  logoutButton: {
    padding: 8,
  },

  searchContainer: {
    justifyContent: "center",
  },

  searchWrapper: {
    flexDirection: "row",
    backgroundColor: "#2a2a2a",
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },

  searchWrapperActive: {
    borderColor: "#e50914",
    backgroundColor: "#1f1f1f",
  },

  searchIcon: {
    marginRight: 10,
  },

  searchInput: {
    flex: 1,
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "500",
  },
  logoWrapper: {
    // ensure we can overlay the wave centered on the logo
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 2,
    paddingHorizontal: 6,
  },

  wave: {
    position: "absolute",
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(229,9,20,0.25)",
  },
});
