import { View, Text, ImageBackground, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

type HeroMovieProps = {
  movie: {
    id: number;
    title: string;
    backdrop_path?: string;
  };
};

export default function HeroMovie({ movie }: HeroMovieProps) {
  const router = useRouter();

  if (!movie) return null;

  const imageUrl = `https://image.tmdb.org/t/p/original${movie.backdrop_path}`;

  return (
    <TouchableOpacity
      onPress={() => router.push(`/movie/${movie.id}` as any)}
      style={styles.heroLink}
      activeOpacity={0.8}
    >
      <ImageBackground
        source={{ uri: imageUrl }}
        style={styles.hero}
        imageStyle={{ borderRadius: 16 }}
      >
        <View style={styles.topLabel}>
          <Text style={{ color: "#fff", fontWeight: "bold" }}> Filme Melhor Avaliado</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{movie.title}</Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  heroLink: {
    width: "100%",
    marginBottom: 20,
  },
  hero: {
    width: "100%",
    height: 210,
    justifyContent: "flex-end",
    padding: 20,
    backgroundColor: "#00000055",
  },
  topLabel: {
    position: "absolute",
    top: 15,
    left: 15,
    backgroundColor: "#ff4444",
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  content: {
    backgroundColor: "#00000088",
    padding: 10,
    borderRadius: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
  },
});
