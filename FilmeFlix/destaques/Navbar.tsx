import { useState, useEffect } from "react";
import { View, Text, TextInput, Pressable, Alert } from "react-native";
import Parse from "../lib/parse";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";

export default function Navbar() {
  const [user, setUser] = useState<Parse.User | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const router = useRouter();

  useEffect(() => {
    setUser(Parse.User.current());
  }, []);

  async function handleLogin() {
    try {
      const logged = await Parse.User.logIn(username, password);
      setUser(logged);
      setUsername("");
      setPassword("");
      Alert.alert("Sucesso", "Login efetuado!");
    } catch (err: any) {
      Alert.alert("Erro", err.message);
    }
  }

  async function handleRegister() {
    try {
      const newUser = new Parse.User();
      newUser.set("username", username);
      newUser.set("password", password);

      await newUser.signUp();
      setUser(newUser);
      setUsername("");
      setPassword("");

      Alert.alert("Sucesso", "Conta criada!");
    } catch (err: any) {
      Alert.alert("Erro", err.message);
    }
  }

  async function handleLogout() {
    await Parse.User.logOut();
    setUser(null);
  }

  function handleSearch() {
    if (!searchTerm.trim()) return;

    router.push(`/pesquisa?query=${encodeURIComponent(searchTerm)}`);
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
      {/* LADO ESQUERDO */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
        <Text style={{ color: "#e50914", fontSize: 28, fontWeight: "bold" }}>
          FilmeFlix
        </Text>

        <Pressable onPress={() => router.push("/")}>
          <Text style={{ color: "white", fontSize: 16 }}>Home</Text>
        </Pressable>

        <Pressable onPress={() => router.push("/favorites")}>
          <Text style={{ color: "white", fontSize: 16 }}>Favoritos</Text>
        </Pressable>
      </View>

      {/* BUSCA */}
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

      {/* LOGIN / USUÁRIO */}
      <View>
        {user ? (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Text style={{ color: "white" }}>👤 {user.get("username")}</Text>

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
          </View>
        ) : (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            {/* FORM LOGIN / REGISTRO */}
            <View style={{ flexDirection: "row", gap: 6 }}>
              <TextInput
                placeholder="Usuário"
                placeholderTextColor="#aaa"
                value={username}
                onChangeText={setUsername}
                style={{
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  backgroundColor: "#222",
                  color: "white",
                  borderRadius: 4,
                }}
              />

              <TextInput
                placeholder="Senha"
                placeholderTextColor="#aaa"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                style={{
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  backgroundColor: "#222",
                  color: "white",
                  borderRadius: 4,
                }}
              />

              <Pressable
                onPress={isRegister ? handleRegister : handleLogin}
                style={{
                  backgroundColor: "#0070f3",
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  borderRadius: 6,
                }}
              >
                <Text style={{ color: "white" }}>
                  {isRegister ? "Registrar" : "Entrar"}
                </Text>
              </Pressable>
            </View>

            <Pressable onPress={() => setIsRegister(!isRegister)}>
              <Text
                style={{
                  color: "#fff",
                  textDecorationLine: "underline",
                  marginLeft: 6,
                }}
              >
                {isRegister ? "Login" : "Registrar"}
              </Text>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}
