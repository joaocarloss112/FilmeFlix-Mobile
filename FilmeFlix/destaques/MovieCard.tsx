import { 
    View, 
    Text, 
    Image, 
    Pressable, 
    ViewStyle, 
    StyleSheet, 
} from "react-native";
import { useRouter } from "expo-router";

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

  if (!movie) return null;

  const posterUri = movie.poster_path
    ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
    : undefined;

    const navigateToMovie = () => {
        if (movie?.id) {
            router.push(`/movie/${movie.id}` as any);
        }
    };

  return (
    <View
        style={[styles.cardContainer, style]}
    >
        {/* Usamos Pressable com onPress direto para navegar */}
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

          <Text
            style={styles.movieTitle}
            numberOfLines={2}
          >
            {movie.title}
          </Text>
        </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
    cardContainer: { width: 140, marginRight: 12 },
    touchableArea: {},
    posterImage: { width: 140, height: 210, borderRadius: 12 },
    noImagePlaceholder: { width: 140, height: 210, borderRadius: 12, backgroundColor: "#333", justifyContent: "center", alignItems: "center" },
    placeholderText: { color: "#fff" },
    movieTitle: { marginTop: 6, fontSize: 14, fontWeight: "bold", color: "#fff" }
});