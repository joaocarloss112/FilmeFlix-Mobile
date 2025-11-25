import { useState } from "react";
import { 
    View, 
    Text, 
    TextInput, 
    Pressable, 
    StyleSheet, 
    ActivityIndicator,
    Alert 
} from "react-native";
import { useRouter } from "expo-router";
import { login } from "../lib/auth"; 

export default function LoginScreen() {
    const router = useRouter();
    const [username, setUsername] = useState(""); 
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleLogin() {
        if (!username || !password) {
            Alert.alert("Erro", "Por favor, preencha todos os campos.");
            return;
        }

        setLoading(true);
        try {
            await login(username, password); 
            router.replace("/"); 
        } catch (err: any) {
            Alert.alert("Erro de Login", err.message || "Credenciais inválidas. Tente novamente.");
            console.error("Erro no login:", err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Entrar no FilmeFlix</Text>

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
                onPress={handleLogin}
                disabled={loading}
                style={[styles.button, loading && styles.buttonDisabled]}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Fazer Login</Text>
                )}
            </Pressable>
            
            <Pressable onPress={() => router.push("signup" as any)} style={styles.link}>
                <Text style={styles.linkText}>Não tem conta? Cadastre-se</Text>
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