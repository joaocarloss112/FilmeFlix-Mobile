import { useEffect, useState, useCallback } from "react";
import { 
  View, Text, Image, FlatList, TouchableOpacity, 
  Alert, StyleSheet, RefreshControl 
} from "react-native";
import { getFavorites } from "../lib/favoritos";
import Parse from "../lib/parse";
import { useFocusEffect } from "@react-navigation/native";

export default function FavoritesPage({ navigation }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function loadFavorites() {
    try {
      const favs = await getFavorites();
      setFavorites(favs);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar os favoritos.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      if (!Parse.User.current()) {
        Alert.alert("Atenção", "Você precisa estar logado para ver os favoritos.");
        navigation.navigate("Home");
        return;
      }
      loadFavorites();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadFavorites();
  };

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
      keyExtractor={(item) => item.id?.toString()}
      numColumns={2}
      contentContainerStyle={styles.list}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
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
  card: {
    flex: 1,
    margin: 5,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    alignItems: "center",
    padding: 5,
  },
  image: { width: 150, height: 225, borderRadius: 5, backgroundColor: "#eee" },
  title: { marginTop: 5, textAlign: "center" },
});
