import { useState } from "react";
import { View, Text, TextInput, Pressable, ActivityIndicator } from "react-native";
import { login } from "../lib/auth";
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);
    try {
      await login(username, password);
      router.replace("/"); // navega para Home
    } catch (err) {
      console.log(err);
      alert("Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={{ flex:1, justifyContent:"center", padding:20, backgroundColor:"#000" }}>
      <Text style={{color:"#E50914", fontSize:32, marginBottom:20}}>Login</Text>
      <TextInput placeholder="Usuário" placeholderTextColor="#888" style={{backgroundColor:"#333", color:"#fff", padding:15, borderRadius:8, marginBottom:10}} value={username} onChangeText={setUsername}/>
      <TextInput placeholder="Senha" placeholderTextColor="#888" secureTextEntry style={{backgroundColor:"#333", color:"#fff", padding:15, borderRadius:8, marginBottom:10}} value={password} onChangeText={setPassword}/>
      <Pressable onPress={handleLogin} style={{backgroundColor:"#E50914", padding:15, borderRadius:8, alignItems:"center"}}>
        {loading ? <ActivityIndicator color="#fff"/> : <Text style={{color:"#fff"}}>Entrar</Text>}
      </Pressable>
    </View>
  );
}
