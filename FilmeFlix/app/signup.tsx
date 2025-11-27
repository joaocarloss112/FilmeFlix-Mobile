import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { useRouter } from "expo-router";
import { register } from "../lib/auth"; 
import { useUser } from "../lib/useUser";

export default function SignupScreen() {
    const router = useRouter();
    const { setUser } = useUser(); // ✅ atualiza estado global
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleRegister() {
        if (!username || !password) {
            Alert.alert("Erro", "Preencha todos os campos.");
            return;
        }

        setLoading(true);
        try {
            const data = await register(username, password);
            setUser({ username: data.username }); // ✅ atualiza estado
            Alert.alert("Sucesso", "Cadastro realizado! Redirecionando para a tela inicial.");
            router.replace("/"); 
        } catch (err: any) {
            Alert.alert("Erro no Cadastro", err.message || "Não foi possível realizar o cadastro.");
            console.error("Erro no cadastro:", err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Criar uma Conta</Text>
            <TextInput
                style={styles.input}
                placeholder="Nome de Usuário"
                placeholderTextColor="#888"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Senha"
                placeholderTextColor="#888"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <Pressable
                onPress={handleRegister}
                disabled={loading}
                style={[styles.button, loading && styles.buttonDisabled]}
            >
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Cadastrar</Text>}
            </Pressable>
            <Pressable onPress={() => router.push("login" as any)} style={styles.link}>
                <Text style={styles.linkText}>Já tem conta? Fazer Login</Text>
            </Pressable>
        </View>
    );
}


const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000", padding: 20 },
    title: { color: "#E50914", fontSize: 32, fontWeight: "bold", marginBottom: 30 },
    input: { width: "100%", maxWidth: 300, backgroundColor: "#333", color: "#fff", padding: 15, borderRadius: 8, marginBottom: 15, fontSize: 16 },
    button: { width: "100%", maxWidth: 300, backgroundColor: "#E50914", padding: 15, borderRadius: 8, alignItems: "center", marginTop: 10 },
    buttonDisabled: { opacity: 0.7 },
    buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
    link: { marginTop: 20 },
    linkText: { color: "#aaa", fontSize: 14 }
});