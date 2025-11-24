import { useRef, useState } from "react";
import { View, ScrollView, TouchableOpacity, Text, StyleSheet } from "react-native";
import MovieCard from "./MovieCard";

export default function MovieRow({ movies }: { movies?: any[] | null }) {
  const rowRef = useRef<any>(null);
  const [offset, setOffset] = useState(0);

  const uniqueMovies = (movies || []).filter(
    (movie, index, self) => index === self.findIndex((m) => m.id === movie.id)
  );

  const ITEM_WIDTH = 152;
  
  const VISIBLE_COUNT = 3; 

  const scroll = (direction: "left" | "right") => {
    if (!rowRef.current) return;

    const distance = ITEM_WIDTH * VISIBLE_COUNT;
    const newOffset = Math.max(0, offset + (direction === "left" ? -distance : distance));

    rowRef.current.scrollTo({ x: newOffset, animated: true });
    setOffset(newOffset);
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
        onScroll={(e) => setOffset(e.nativeEvent.contentOffset.x)}
        scrollEventThrottle={16}
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
