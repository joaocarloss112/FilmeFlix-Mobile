import { useState } from "react";
import { View, Text, TextInput, Pressable, ActivityIndicator } from "react-native";
import { register } from "../lib/auth";
import { useRouter } from "expo-router";

export default function SignupScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    setLoading(true);
    try {
      await register(username, password);
      router.replace("/"); // navega para Home
    } catch (err) {
      console.log(err);
      alert("Erro ao criar conta");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={{ flex:1, justifyContent:"center", padding:20, backgroundColor:"#000" }}>
      <Text style={{color:"#E50914", fontSize:32, marginBottom:20}}>Cadastro</Text>
      <TextInput placeholder="Usuário" placeholderTextColor="#888" style={{backgroundColor:"#333", color:"#fff", padding:15, borderRadius:8, marginBottom:10}} value={username} onChangeText={setUsername}/>
      <TextInput placeholder="Senha" placeholderTextColor="#888" secureTextEntry style={{backgroundColor:"#333", color:"#fff", padding:15, borderRadius:8, marginBottom:10}} value={password} onChangeText={setPassword}/>
      <Pressable onPress={handleRegister} style={{backgroundColor:"#E50914", padding:15, borderRadius:8, alignItems:"center"}}>
        {loading ? <ActivityIndicator color="#fff"/> : <Text style={{color:"#fff"}}>Cadastrar</Text>}
      </Pressable>
    </View>
  );
}
