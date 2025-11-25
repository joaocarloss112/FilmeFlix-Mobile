import { Stack, useLocalSearchParams } from "expo-router";
import { View, Text, ScrollView, ActivityIndicator, StyleSheet, FlatList } from "react-native";
import { useEffect, useState, useCallback } from "react";

// Assuma que este é o caminho correto para sua função de pesquisa
import { searchMovies } from "../lib/tmdb"; 

// Assuma que MovieCard é o componente que exibe cada filme
import MovieCard from "../destaques/MovieCard"; 

// Defina a tipagem básica do filme (use a mesma que você já tem)
type Filme = {
  id: number;
  title: string;
  poster_path?: string | null;
  // Adicione outras propriedades se necessário (como vote_average, overview)
};

export default function SearchScreen() {
  // 1. Obter o termo de pesquisa da URL
  const { query } = useLocalSearchParams();
  const searchTerm = Array.isArray(query) ? query[0] : query;

  const [results, setResults] = useState<Filme[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 2. Função para buscar os filmes
  const fetchResults = useCallback(async (searchQuery: string | undefined) => {
    if (!searchQuery || !searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Chama a função da API TMDB
      const movies = await searchMovies(searchQuery, 1);
      setResults(movies as Filme[]);
    } catch (err) {
      console.error("Erro ao pesquisar filmes:", err);
      setError("Não foi possível carregar os resultados da pesquisa.");
    } finally {
      setLoading(false);
    }
  }, []);

  // 3. Executar a busca quando o termo de pesquisa mudar
  useEffect(() => {
    fetchResults(searchTerm);
  }, [searchTerm, fetchResults]);

  // --- Renderização do Conteúdo ---
  const headerTitle = searchTerm 
    ? `Resultados para: "${searchTerm}"` 
    : "Pesquisar Filmes";

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: headerTitle }} />

      {loading && (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#E50914" />
        </View>
      )}

      {!loading && error && (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {!loading && results.length === 0 && !error && (
        <View style={styles.centerContainer}>
          <Text style={styles.noResultsText}>
            Nenhum filme encontrado para "{searchTerm}".
          </Text>
        </View>
      )}

      {!loading && results.length > 0 && (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2} // Ajuste o número de colunas conforme o design do seu MovieCard
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            // Assuma que o MovieCard aceita a prop 'movie' e usa o Link/router para navegar
            <MovieCard movie={item} style={styles.cardItem} />
          )}
        />
      )}
    </View>
  );
}

// --- Estilização ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  listContent: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    justifyContent: 'space-between',
  },
  cardItem: {
    width: '48%', // Ajuste para 2 colunas com algum espaçamento
    marginBottom: 20,
    marginHorizontal: '1%',
  },
  noResultsText: {
    color: "#ccc",
    fontSize: 18,
    textAlign: 'center',
  },
  errorText: {
    color: "red",
    fontSize: 18,
    textAlign: 'center',
  },
});