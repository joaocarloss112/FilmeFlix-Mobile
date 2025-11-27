import { View, Text, FlatList } from "react-native";
import { useEffect, useState } from "react";
import { getFavorites, FavoriteMovie } from "../lib/favoritos";
import { useAuth } from "../lib/useAuth"; // agora correto

export default function FavoritosPage() {
  const { user } = useAuth(); // hook atualizado
  const [favoritos, setFavoritos] = useState<FavoriteMovie[]>([]);

  useEffect(() => {
    if (user) {
      getFavorites(user.objectId).then((data) => setFavoritos(data));
    }
  }, [user]);

  if (!user) {
    return (
      <View style={{ padding: 20 }}>
        <Text>Faça login para ver seus favoritos.</Text>
      </View>
    );
  }

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>Meus Favoritos</Text>
      <FlatList
        data={favoritos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Text style={{ fontSize: 16, marginBottom: 5 }}>{item.title}</Text>
        )}
      />
    </View>
  );
}
