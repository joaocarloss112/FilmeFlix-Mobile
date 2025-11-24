import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { login, register } from "../lib/auth";

export default function LoginScreen() {
  const router = useRouter();

  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit() {
    if (!username || !password) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }

    try {
      if (isRegister) {
        await register(username, password);
        Alert.alert("Sucesso", "Conta criada!");
      } else {
        await login(username, password);
        Alert.alert("Sucesso", "Login realizado!");
      }

      router.replace("/"); 
    } catch (err: any) {
      Alert.alert("Erro", err.message);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isRegister ? "Criar Conta" : "Entrar"}</Text>

      <TextInput
        placeholder="Usuário"
        placeholderTextColor="#777"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />

      <TextInput
        placeholder="Senha"
        placeholderTextColor="#777"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <Pressable style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>
          {isRegister ? "Registrar" : "Entrar"}
        </Text>
      </Pressable>

      <Pressable onPress={() => setIsRegister(!isRegister)}>
        <Text style={styles.switchText}>
          {isRegister
            ? "Já tem conta? Faça login"
            : "Não tem conta? Registrar"}
        </Text>
      </Pressable>

      <Pressable onPress={() => router.back()}>
        <Text style={{ color: "#bbb", marginTop: 20 }}>Voltar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0d0d0d",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    backgroundColor: "#222",
    color: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  button: {
    width: "100%",
    backgroundColor: "#e50914",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 4,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
  },
  switchText: {
    color: "#fff",
    textDecorationLine: "underline",
    marginTop: 16,
  },
});
