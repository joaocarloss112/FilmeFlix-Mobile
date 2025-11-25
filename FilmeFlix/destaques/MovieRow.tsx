import { View, ScrollView, Text, StyleSheet } from "react-native";
import MovieCard from "./MovieCard";

export default function MovieRow({
  movies,
  title,
}: {
  movies?: any[] | null;
  title?: string;
}) {
  const uniqueMovies = (movies || []).filter(
    (movie, index, self) => index === self.findIndex((m) => m.id === movie.id)
  );

  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={150} 
        contentContainerStyle={styles.row}
      >
        {uniqueMovies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 26,
  },

  title: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 8,
    marginBottom: 10,
  },

  row: {
    flexDirection: "row",
    paddingHorizontal: 8,
    gap: 14,
  },
});
