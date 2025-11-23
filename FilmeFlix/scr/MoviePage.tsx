// app/src/MoviePage.tsx
import { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, StyleSheet } from "react-native";
import { getMovieDetails, getMovieWatchProviders } from "../lib/tmdb";
import SaveButton from "../components/SaveButton";

export default function MoviePage({ route }) {
  const { id } = route.params;
  const [movie, setMovie] = useState<any>(null);
  const [providers, setProviders] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMovie() {
      const movieData = await getMovieDetails(id);
      const providersData = await getMovieWatchProviders(id);
      setMovie(movieData);
      setProviders(providersData);
      setLoading(false);
    }
    loadMovie();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  if (!movie) {
    return (
      <View style={styles.center}>
        <Text>Filme não encontrado</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }}
        style={styles.poster}
      />
      <Text style={styles.title}>{movie.title}</Text>
      <Text style={styles.overview}>{movie.overview}</Text>
      <Text>⭐ {movie.vote_average}</Text>

      {/* Botão de salvar favorito */}
      <SaveButton movie={movie} />

      {/* Onde assistir */}
      {providers?.flatrate ? (
        <View style={styles.providers}>
          <Text style={styles.subTitle}>Onde assistir:</Text>
          {providers.flatrate.map((provider: any) => (
            <View key={provider.provider_id} style={styles.provider}>
              <Image
                source={{ uri: `https://image.tmdb.org/t/p/original${provider.logo_path}` }}
                style={styles.providerLogo}
              />
              <Text>{provider.provider_name}</Text>
            </View>
          ))}
        </View>
      ) : (
        <Text>Informação de onde assistir não disponível.</Text>
      )}

      {/* Trailer simplificado */}
      {movie.trailerKey ? (
        <View style={styles.trailer}>
          <Text style={styles.subTitle}>Trailer Oficial</Text>
          {/* Se quiser reproduzir vídeo, use expo-av */}
        </View>
      ) : (
        <Text style={{ marginTop: 10 }}>Trailer não disponível.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  poster: { width: "100%", height: 400, borderRadius: 8, marginBottom: 10 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 5 },
  overview: { marginBottom: 10 },
  subTitle: { fontWeight: "bold", marginTop: 10, marginBottom: 5 },
  providers: { marginVertical: 10 },
  provider: { flexDirection: "row", alignItems: "center", marginBottom: 5 },
  providerLogo: { width: 30, height: 30, marginRight: 5 },
  trailer: { marginTop: 10 },
});
