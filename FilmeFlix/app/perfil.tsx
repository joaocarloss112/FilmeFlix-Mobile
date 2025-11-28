import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, Pressable, Alert, Image, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useStore } from "../lib/store";

const PROFILE_KEY = "@filmeFlix_profile";

export default function Perfil() {
  const { user: storeUser, setUser } = useStore();

  const [name, setName] = useState<string>(storeUser?.username || "");
  const [bio, setBio] = useState<string>("");
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const raw = await AsyncStorage.getItem(PROFILE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setName(parsed.name || storeUser?.username || "");
        setBio(parsed.bio || "");
        setAvatarUrl(parsed.avatarUrl || "");
      } else if (storeUser?.username) {
        setName(storeUser.username);
      }
    } catch (err) {
      console.warn("Erro ao carregar perfil:", err);
    }
  }

  async function saveProfile() {
    setLoading(true);
    try {
      const payload = { name, bio, avatarUrl };
      await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(payload));

      // Atualiza o store com o novo nome se houver usuário logado
      if (storeUser) {
        try {
          setUser({ ...storeUser, username: name });
        } catch (e) {
          // se falhar, não bloqueia o salvamento local
        }
      }

      Alert.alert("Salvo", "Seu perfil foi salvo com sucesso.");
    } catch (err) {
      console.warn(err);
      Alert.alert("Erro", "Não foi possível salvar o perfil.");
    } finally {
      setLoading(false);
    }
  }

  function handleAvatarPreview() {
    if (!avatarUrl) {
      Alert.alert("Aviso", "Informe a URL do avatar para visualizar.");
      return;
    }
    // nada além — a imagem é exibida abaixo automaticamente
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.title}>Personalizar Perfil</Text>

      <View style={styles.previewContainer}>
        {avatarUrl ? (
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Text style={styles.avatarPlaceholderText}>{(name || "U").charAt(0).toUpperCase()}</Text>
          </View>
        )}
        <Text style={styles.previewName}>{name || storeUser?.username || "Usuário"}</Text>
      </View>

      <Text style={styles.label}>Nome</Text>
      <TextInput value={name} onChangeText={setName} style={styles.input} placeholder="Seu nome" placeholderTextColor="#666" />

      <Text style={styles.label}>Bio</Text>
      <TextInput
        value={bio}
        onChangeText={setBio}
        style={[styles.input, { height: 100 }]}
        placeholder="Uma curta descrição sobre você"
        placeholderTextColor="#666"
        multiline
      />

      <Text style={styles.label}>URL do Avatar</Text>
      <TextInput value={avatarUrl} onChangeText={setAvatarUrl} style={styles.input} placeholder="https://..." placeholderTextColor="#666" />

      <View style={styles.row}>
        <Pressable onPress={handleAvatarPreview} style={[styles.button, styles.secondaryButton]}>
          <Text style={styles.buttonText}>Visualizar</Text>
        </Pressable>

        <Pressable onPress={saveProfile} style={styles.button} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? "Salvando..." : "Salvar"}</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d0d0d", padding: 20 },
  title: { color: "#fff", fontSize: 22, fontWeight: "700", marginBottom: 14 },
  previewContainer: { alignItems: "center", marginBottom: 18 },
  avatar: { width: 96, height: 96, borderRadius: 48, marginBottom: 8 },
  avatarPlaceholder: { backgroundColor: "#e50914", justifyContent: "center", alignItems: "center" },
  avatarPlaceholderText: { color: "#fff", fontSize: 28, fontWeight: "700" },
  previewName: { color: "#fff", fontSize: 16, fontWeight: "600" },
  label: { color: "#ccc", marginTop: 6, marginBottom: 6, fontWeight: "600" },
  input: { backgroundColor: "#141414", color: "#fff", padding: 10, borderRadius: 6, fontSize: 14 },
  row: { flexDirection: "row", justifyContent: "space-between", marginTop: 14 },
  button: { backgroundColor: "#e50914", paddingVertical: 10, paddingHorizontal: 16, borderRadius: 6, flex: 1, alignItems: "center", marginLeft: 8 },
  secondaryButton: { backgroundColor: "#333", marginLeft: 0, marginRight: 8 },
  buttonText: { color: "#fff", fontWeight: "700" },
});
