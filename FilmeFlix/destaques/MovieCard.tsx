import { 
  View, 
  Text, 
  Image, 
  Pressable, 
  ViewStyle, 
  StyleSheet 
} from "react-native";
import { useRouter } from "expo-router";
import { useStore, FavoriteMovie } from "../lib/store";
import { saveFavorite, removeFavorite as removeFavoriteBackend, FavoriteMovie as BackendFavoriteMovie } from "../lib/favoritos";

type Movie = {
  id: number;
  title: string;
  poster_path?: string | null;
};

interface MovieCardProps {
  movie?: Movie | null;
  style?: ViewStyle; 
}

export default function MovieCard({ movie, style }: MovieCardProps) {
  const router = useRouter();
  const { user, favorites, addFavorite, removeFavorite: removeFromStore } = useStore();

  if (!movie) return null;

  const posterUri = movie.poster_path
    ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
    : undefined;

  const isFavorite = favorites.some(f => f.id === movie.id);

  const navigateToMovie = () => router.push(`/movie/${movie.id}` as any);

  // Corrige tipos de movieData para compatibilidade com backend
  const movieData: BackendFavoriteMovie = {
  id: movie.id,
  title: movie.title,
  posterPath: movie.poster_path || "" // string vazia se não tiver poster
};

  const toggleFavorite = async () => {
    if (!user) return;

    if (isFavorite) {
      const removed = await removeFavoriteBackend(movie.id, user.objectId);
      if (removed) removeFromStore(movie.id);
    } else {
      const saved = await saveFavorite(movieData, user.objectId);
      if (saved) addFavorite(movieData as FavoriteMovie); // cast explícito para store
    }
  };

  return (
    <View style={[styles.cardContainer, style]}>
      <Pressable style={styles.touchableArea} onPress={navigateToMovie}>
        {posterUri ? (
          <Image
            source={{ uri: posterUri }}
            style={styles.posterImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.noImagePlaceholder}>
            <Text style={styles.placeholderText}>Sem imagem</Text>
          </View>
        )}
        <Text style={styles.movieTitle} numberOfLines={2}>
          {movie.title}
        </Text>
      </Pressable>

      {user && (
        <Pressable onPress={toggleFavorite} style={styles.favoriteButton}>
          <Text style={{ color: isFavorite ? "#E50914" : "#fff" }}>
            {isFavorite ? "Remover dos Favoritos" : "Adicionar aos Favoritos"}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: { width: 140, marginRight: 12 },
  touchableArea: {},
  posterImage: { width: 140, height: 210, borderRadius: 12 },
  noImagePlaceholder: { 
    width: 140, 
    height: 210, 
    borderRadius: 12, 
    backgroundColor: "#333", 
    justifyContent: "center", 
    alignItems: "center" 
  },
  placeholderText: { color: "#fff" },
  movieTitle: { marginTop: 6, fontSize: 14, fontWeight: "bold", color: "#fff" },
  favoriteButton: { marginTop: 4, alignItems: "center" }
});
