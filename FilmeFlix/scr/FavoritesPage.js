import { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  Dimensions,
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
        <ActivityIndicator size="large" color="#e50914" />
        <Text style={styles.loadingText}>Carregando favoritos...</Text>
      </View>
    );
  }

  if (favorites.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyTitle}>Você ainda não salvou nenhum filme.</Text>
        <Text style={styles.emptySubtitle}>Busque e adicione filmes à sua lista para vê-los aqui.</Text>
      </View>
    );
  }

  const numColumns = 2;
  const { width } = Dimensions.get('window');
  const cardWidth = Math.floor((width - 40 - (numColumns - 1) * 12) / numColumns);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Meus Favoritos</Text>
        <Text style={styles.headerCount}>{favorites.length} filmes</Text>
      </View>

      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id?.toString()}
        numColumns={numColumns}
        columnWrapperStyle={styles.column}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, { width: cardWidth }]}
            onPress={() => navigation.navigate("Movie", { id: item.id })}
            activeOpacity={0.85}
          >
            <Image
              source={{ uri: `https://image.tmdb.org/t/p/w342${item.posterPath}` }}
              style={[styles.image, { width: cardWidth, height: Math.floor(cardWidth * 1.45) }]}
            />

            <View style={styles.cardMeta}>
              <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 18, paddingTop: 8 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 12, color: '#ccc' },
  emptyTitle: { fontSize: 16, color: '#ddd', fontWeight: '700' },
  emptySubtitle: { fontSize: 13, color: '#999', marginTop: 6, textAlign: 'center', maxWidth: 360 },
  header: { marginBottom: 12, paddingHorizontal: 4, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: '900' },
  headerCount: { color: '#bbb', fontSize: 13 },
  list: { paddingBottom: 28 },
  column: { justifyContent: 'space-between', marginBottom: 12 },
  card: {
    borderRadius: 10,
    backgroundColor: '#121212',
    overflow: 'hidden',
    alignItems: 'center',
    // shadow
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.45,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  image: { borderRadius: 8, backgroundColor: '#222' },
  cardMeta: { padding: 8, width: '100%', alignItems: 'flex-start' },
  title: { color: '#fff', fontWeight: '700', fontSize: 13 },
});
