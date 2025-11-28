import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from "react-native";
import { login, register } from "../lib/auth";
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameActive, setUsernameActive] = useState(false);
  const [passwordActive, setPasswordActive] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!username || !password) {
      alert("Preencha todos os campos");
      return;
    }

    setLoading(true);
    try {
      if (isRegister) {
        await register(username, password);
        alert("Conta criada com sucesso!");
      } else {
        await login(username, password);
      }
      router.replace("/");
    } catch (err) {
      console.log(err);
      alert("Erro: " + (err instanceof Error ? err.message : "Tente novamente"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        scrollEnabled={false}
      >
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>FilmeFlix</Text>
        </View>

        {/* Form Container */}
        <View style={styles.formContainer}>
          <Text style={styles.subtitle}>
            {isRegister ? "Crie sua conta" : "Faça login"}
          </Text>

          {/* Username Input */}
          <View
            style={[
              styles.inputContainer,
              usernameActive && styles.inputContainerActive,
            ]}
          >
            <TextInput
              placeholder="Usuário ou email"
              placeholderTextColor="#8c8c8c"
              value={username}
              onChangeText={setUsername}
              onFocus={() => setUsernameActive(true)}
              onBlur={() => setUsernameActive(false)}
              style={styles.input}
              editable={!loading}
            />
          </View>

          {/* Password Input */}
          <View
            style={[
              styles.inputContainer,
              passwordActive && styles.inputContainerActive,
            ]}
          >
            <TextInput
              placeholder="Senha"
              placeholderTextColor="#8c8c8c"
              value={password}
              onChangeText={setPassword}
              onFocus={() => setPasswordActive(true)}
              onBlur={() => setPasswordActive(false)}
              secureTextEntry
              style={styles.input}
              editable={!loading}
            />
          </View>

          {/* Submit Button */}
          <Pressable
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>
                {isRegister ? "Registrar" : "Entrar"}
              </Text>
            )}
          </Pressable>
        </View>

        {/* Switch Account Mode */}
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>
            {isRegister ? "Já tem conta? " : "Novo no FilmeFlix? "}
            <Text
              style={styles.switchLink}
              onPress={() => {
                setIsRegister(!isRegister);
                setUsername("");
                setPassword("");
              }}
            >
              {isRegister ? "Faça login" : "Registre-se agora"}
            </Text>
          </Text>
        </View>

        {/* Back Button */}
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← Voltar</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#141414",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "space-between",
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 60,
    marginTop: 20,
  },
  logo: {
    fontSize: 48,
    fontWeight: "900",
    color: "#e50914",
    letterSpacing: 2,
  },
  formContainer: {
    width: "100%",
    maxWidth: 450,
    alignSelf: "center",
  },
  subtitle: {
    fontSize: 32,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 28,
    letterSpacing: 0.5,
  },
  inputContainer: {
    backgroundColor: "#454545",
    borderRadius: 4,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 0,
    borderWidth: 2,
    borderColor: "#454545",
  },
  inputContainerActive: {
    backgroundColor: "#555555",
    borderColor: "#ffffff",
  },
  input: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "500",
    paddingVertical: 12,
  },
  button: {
    backgroundColor: "#e50914",
    borderRadius: 4,
    paddingVertical: 12,
    marginTop: 24,
    marginBottom: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDisabled: {
    backgroundColor: "#b20710",
    opacity: 0.8,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 1,
  },
  switchContainer: {
    alignItems: "center",
    marginVertical: 40,
  },
  switchLabel: {
    color: "#808080",
    fontSize: 16,
    fontWeight: "400",
    textAlign: "center",
    lineHeight: 22,
  },
  switchLink: {
    color: "#e5e5e5",
    fontWeight: "700",
  },
  backButton: {
    paddingVertical: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  backText: {
    color: "#808080",
    fontSize: 14,
    fontWeight: "600",
  },
});
