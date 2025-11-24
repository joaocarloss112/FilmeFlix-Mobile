import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, StyleSheet, Alert } from "react-native";
import { getMovieDetails, getMovieWatchProviders } from "../../lib/tmdb";

type Movie = {
  id: number;
  title: string;
  poster_path: string | null;
  overview: string;
  vote_average: number;
  trailerKey?: string | null;
};

type Provider = {
  provider_id: number;
  provider_name: string;
  logo_path: string;
};

type ProvidersResponse = {
  flatrate?: Provider[];
};

export default function MoviePage() {
  const params = useLocalSearchParams();
  const id = Number(params.id); // <-- CORRIGE O ERRO 2345

  const [movie, setMovie] = useState<Movie | null>(null);
  const [providers, setProviders] = useState<ProvidersResponse | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadMovie() {
    try {
      const movieData = await getMovieDetails(id);
      const providersData = await getMovieWatchProviders(id);

      setMovie(movieData);
      setProviders(providersData);
    } catch (err) {
      Alert.alert("Erro", "Não foi possível carregar os dados do filme.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!isNaN(id)) loadMovie();
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
        source={{
          uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        }}
        style={styles.poster}
      />

      <Text style={styles.title}>{movie.title}</Text>
      <Text style={styles.overview}>{movie.overview}</Text>
      <Text>⭐ {movie.vote_average}</Text>
      {providers?.flatrate?.length ? (
        <View style={styles.providers}>
          <Text style={styles.subTitle}>Onde assistir:</Text>

          {providers.flatrate.map((provider: Provider) => (
            <View key={provider.provider_id} style={styles.provider}>
              <Image
                source={{
                  uri: `https://image.tmdb.org/t/p/original${provider.logo_path}`,
                }}
                style={styles.providerLogo}
              />
              <Text>{provider.provider_name}</Text>
            </View>
          ))}
        </View>
      ) : (
        <Text>Informação de onde assistir não disponível.</Text>
      )}
      {movie.trailerKey ? (
        <View style={styles.trailer}>
          <Text style={styles.subTitle}>Trailer Oficial</Text>
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
  providerLogo: {
    width: 30,
    height: 30,
    marginRight: 5,
    backgroundColor: "#eee",
    borderRadius: 4,
  },
  trailer: { marginTop: 10 },
});
