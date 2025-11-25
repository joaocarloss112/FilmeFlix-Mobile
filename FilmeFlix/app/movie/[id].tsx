import { Stack, useLocalSearchParams } from "expo-router";
import { View, Text, ScrollView, ActivityIndicator, StyleSheet, Image, Linking } from "react-native";
import { useEffect, useState } from "react";
// Importação do YouTube Player
import YouTubeIframe from 'react-native-youtube-iframe'; 

// Ajuste o caminho conforme a localização do seu arquivo tmdb.ts
import { getMovieDetails, getMovieWatchProviders } from "../../lib/tmdb"; 

// --- Tipagens ---
type MovieDetailsType = {
  id: number;
  title: string;
  overview: string;
  vote_average: number;
  release_date: string;
  poster_path: string | null;
  runtime: number;
  genres: { id: number; name: string }[];
  trailerKey: string | null;
};

type Provider = {
  logo_path: string;
  provider_name: string;
  display_priority: number;
};

type WatchProviders = {
  link: string;
  flatrate?: Provider[]; // Streaming
  rent?: Provider[];     // Aluguel
  buy?: Provider[];      // Compra
} | null;
// --- Fim Tipagens ---

export default function MovieDetails() {
  const { id } = useLocalSearchParams();
  const movieId = typeof id === 'string' ? parseInt(id) : undefined;

  const [movie, setMovie] = useState<MovieDetailsType | null>(null);
  const [providers, setProviders] = useState<WatchProviders>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!movieId) {
      setError("ID do Filme não é válido.");
      setLoading(false);
      return;
    }

    async function loadMovieDetails() {
      setLoading(true);
      setError(null);
      try {
        const [details, watchProviders] = await Promise.all([
          getMovieDetails(movieId!),
          getMovieWatchProviders(movieId!),
        ]);

        setMovie(details as MovieDetailsType);
        setProviders(watchProviders);

      } catch (err) {
        console.error("Erro ao carregar detalhes do filme:", err);
        setError("Não foi possível carregar os detalhes do filme.");
      } finally {
        setLoading(false);
      }
    }
    loadMovieDetails();
  }, [movieId]);

  // --- Funções Auxiliares de Renderização ---
  const renderProviders = (title: string, items?: Provider[]) => {
    if (!items || items.length === 0) return null;

    return (
      <View style={styles.providerSection}>
        <Text style={styles.providerTitle}>{title}:</Text>
        <View style={styles.providerList}>
          {items.map((p) => (
            <View key={p.provider_name} style={styles.providerItem}>
              <Image
                source={{ uri: `https://image.tmdb.org/t/p/w92${p.logo_path}` }}
                style={styles.providerLogo}
              />
              <Text style={styles.providerName} numberOfLines={1}>
                {p.provider_name}
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  };
  
  // --- Renderização de Estados ---
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#E50914" />
      </View>
    );
  }

  if (error || !movie) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error || "Filme não encontrado."}</Text>
      </View>
    );
  }

  const posterUri = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : undefined;

  // --- Renderização Principal ---
  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: movie.title }} />

      <View style={styles.header}>
        {posterUri && (
          <Image source={{ uri: posterUri }} style={styles.poster} />
        )}
        <View style={styles.info}>
          <Text style={styles.title}>{movie.title}</Text>
          <Text style={styles.detailText}>
            Nota: <Text style={styles.ratingText}>{movie.vote_average.toFixed(1)} / 10</Text>
          </Text>
          <Text style={styles.detailText}>
            Lançamento: {new Date(movie.release_date).toLocaleDateString('pt-BR')}
          </Text>
          <Text style={styles.detailText}>
            Duração: {movie.runtime} minutos
          </Text>
          <Text style={styles.genreText}>
            Gêneros: {movie.genres.map(g => g.name).join(', ')}
          </Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Sinopse</Text>
      <Text style={styles.overview}>{movie.overview || "Sinopse não disponível."}</Text>

      {/* Seção Onde Assistir */}
      {providers && (
        <View style={styles.watchProviders}>
          <Text style={styles.sectionTitle}>Onde Assistir</Text>
          {providers.link && (
            <Text 
              style={styles.providerLink} 
              onPress={() => Linking.openURL(providers.link)}
            >
              Ver mais opções de provedores (Clique aqui)
            </Text>
          )}

          {renderProviders("Streaming", providers.flatrate)}
          {renderProviders("Para Alugar", providers.rent)}
          {renderProviders("Para Comprar", providers.buy)}
        </View>
      )}
      
      {/* Player do Trailer Incorporado (NOVO) */}
      {movie.trailerKey && (
        <View style={styles.trailerContainer}>
          <Text style={styles.trailerTitle}>Trailer Oficial</Text>
          <YouTubeIframe
            height={220} // Altura do player
            play={false} // Não inicia automaticamente
            videoId={movie.trailerKey} // ID do vídeo
          />
        </View>
      )}

      <View style={{ height: 40 }} /> {/* Espaço no final */}
    </ScrollView>
  );
}

// --- Estilização (Stylesheets) ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  errorText: { color: "red", fontSize: 18 },
  header: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#1a1a1a',
    marginBottom: 15,
  },
  poster: {
    width: 120,
    height: 180,
    borderRadius: 8,
  },
  info: {
    flex: 1,
    marginLeft: 15,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  detailText: {
    color: "#ccc",
    fontSize: 16,
    lineHeight: 24,
  },
  ratingText: {
    color: '#FFD700', // Dourado
    fontWeight: 'bold',
  },
  genreText: {
    color: "#999",
    fontSize: 14,
    marginTop: 5,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  overview: {
    color: "#eee",
    fontSize: 16,
    paddingHorizontal: 20,
    lineHeight: 24,
    marginBottom: 20,
  },
  
  // NOVOS ESTILOS PARA O PLAYER
  trailerContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
    marginTop: 15,
  },
  trailerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
  },
  // FIM DOS NOVOS ESTILOS

  watchProviders: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  providerLink: {
    color: '#007bff',
    marginBottom: 15,
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  providerSection: {
    marginBottom: 15,
  },
  providerTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  providerList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  providerItem: {
    alignItems: 'center',
    width: 60,
  },
  providerLogo: {
    width: 40,
    height: 40,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#333',
  },
  providerName: {
    color: "#ccc",
    fontSize: 10,
    textAlign: 'center',
    marginTop: 2,
  }
});