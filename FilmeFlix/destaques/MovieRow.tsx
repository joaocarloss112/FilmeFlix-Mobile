import { useRef } from "react";
import { View, ScrollView, TouchableOpacity, Text, StyleSheet } from "react-native";
import MovieCard from "./MovieCard";

export default function MovieRow({ movies }) {
  const rowRef = useRef(null);

  // Remove duplicados
  const uniqueMovies = movies?.filter(
    (movie, index, self) => index === self.findIndex((m) => m.id === movie.id)
  );

  const scroll = (direction) => {
    if (rowRef.current) {
      rowRef.current.measure((x, y, width) => {
        rowRef.current.scrollTo({
          x: direction === "left" ? width * -1 : width,
          animated: true,
        });
      });
    }
  };

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity style={styles.scrollBtn} onPress={() => scroll("left")}>
        <Text style={styles.btnText}>◀</Text>
      </TouchableOpacity>

      <ScrollView
        ref={rowRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {uniqueMovies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.scrollBtn} onPress={() => scroll("right")}>
        <Text style={styles.btnText}>▶</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    gap: 10,
  },
  scrollBtn: {
    padding: 10,
    backgroundColor: "#000000aa",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    height: 40,
  },
  btnText: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
  },
});
