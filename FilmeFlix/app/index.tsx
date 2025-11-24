import { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from "react-native";
import HeroMovie from "../destaques/Filme_principal";
import MovieRow from "../destaques/MovieRow";
import { getMoviesByCategory } from "../lib/tmdb";

type Filme = {
  id: number;
  title: string;
  poster_path?: string;
  backdrop_path?: string;
};

export default function Home() {
  const [popular, setPopular] = useState<Filme[]>([]);
  const [nowPlaying, setNowPlaying] = useState<Filme[]>([]);
  const [topRated, setTopRated] = useState<Filme[]>([]);
  const [upcoming, setUpcoming] = useState<Filme[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [pop, now, top, up] = await Promise.all([
          getMoviesByCategory("popular", 1),
          getMoviesByCategory("now_playing", 1),
          getMoviesByCategory("top_rated", 1),
          getMoviesByCategory("upcoming", 1),
        ]);

        setPopular(pop || []);
        setNowPlaying(now || []);
        setTopRated(top || []);
        setUpcoming(up || []);
      } catch (err) {
        console.error("Erro ao carregar filmes:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titulo}>Filmes Populares</Text>
      {popular.length > 0 && <HeroMovie movie={popular[0]} />}

      <Text style={styles.sectionTitle}>Popular</Text>
      <MovieRow movies={popular} />

      <Text style={styles.sectionTitle}>Em exibição</Text>
      <MovieRow movies={nowPlaying} />

      <Text style={styles.sectionTitle}>Mais bem avaliados</Text>
      <MovieRow movies={topRated} />

      <Text style={styles.sectionTitle}>Próximos lançamentos</Text>
      <MovieRow movies={upcoming} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#111" },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  titulo: {
    color: "#fff",
    fontSize: 26,
    marginBottom: 20,
    fontWeight: "bold",
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 20,
    marginTop: 16,
    marginBottom: 8,
    fontWeight: "600",
  },
});
