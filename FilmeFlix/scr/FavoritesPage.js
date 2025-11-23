import { useEffect, useState } from "react";
import { View, Text, Image, FlatList, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { getFavorites } from "../lib/favoritos"; 
import Parse from "../lib/parse";

export default function FavoritesPage({ navigation }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!Parse.User.current()) {
      Alert.alert("Atenção", "Você precisa estar logado para ver os favoritos.");
      navigation.navigate("Home");
      return;
    }

    async function loadFavorites() {
      const favs = await getFavorites();
      setFavorites(favs);
      setLoading(false);
    }

    loadFavorites();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Carregando favoritos...</Text>
      </View>
    );
  }

  if (favorites.length === 0) {
    return (
      <View style={styles.center}>
        <Text>Você ainda não salvou nenhum filme.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={favorites}
      keyExtractor={(item) => item.id.toString()}
      numColumns={2}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("Movie", { id: item.id })}
        >
          <Image
            source={{ uri: `https://image.tmdb.org/t/p/w300${item.posterPath}` }}
            style={styles.image}
          />
          <Text style={styles.title}>{item.title}</Text>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  list: { padding: 10, justifyContent: "space-between" },
  card: { flex: 1, margin: 5, borderWidth: 1, borderColor: "#ddd", borderRadius: 8, alignItems: "center", padding: 5 },
  image: { width: 150, height: 225, borderRadius: 5 },
  title: { marginTop: 5, textAlign: "center" },
});
