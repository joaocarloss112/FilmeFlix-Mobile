import { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from "react-native";
import MovieRow from "../destaques/MovieRow";
import MovieCard from "../destaques/MovieCard";
import { getMoviesByCategory, getGenres, getMoviesByGenre } from "../lib/tmdb";

type Filme = {
  id: number;
  title: string;
  poster_path?: string | null;
};

export default function Home() {
  const [popular, setPopular] = useState<Filme[]>([]);
  const [nowPlaying, setNowPlaying] = useState<Filme[]>([]);
  const [topRated, setTopRated] = useState<Filme[]>([]);
  const [upcoming, setUpcoming] = useState<Filme[]>([]);
  const [loading, setLoading] = useState(true);
  // ESTADOS FALTANTES ADICIONADOS AQUI 👇
  const [genres, setGenres] = useState<{ id: number; name: string }[]>([]);
  const [genreMovies, setGenreMovies] = useState<Record<number, Filme[]>>({});
  // FIM DOS ESTADOS FALTANTES

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
        
        const allGenres = await getGenres();
        setGenres(allGenres || []); // 🎉 Agora definido!
        
        const preferred = [
          ["ação", "action"],
          ["comédia", "comedy"],
          ["ficção científica", "science fiction", "sci-fi", "science_fiction"],
          ["drama"],
          ["terror", "horror"],
          ["romance"],
          ["fantasia", "fantasy"],
          ["animação", "animation"],
          ["crime"],
          ["thriller"]
        ];

        const MAX_GENRES = 10;
        const MIN_MOVIES_PER_GENRE = 30;
        const RESULTS_PER_PAGE = 40;
        const pagesForGenre = Math.ceil(MIN_MOVIES_PER_GENRE / RESULTS_PER_PAGE);
        const lowerGenres = (allGenres || []).map((g: any) => ({ id: g.id, name: String(g.name) }));
        const selected: { id: number; name: string }[] = [];

        for (const opts of preferred) {
          if (selected.length >= MAX_GENRES) break;
          for (const nameTry of opts) {
            const found = lowerGenres.find((lg: { id: number; name: string }) =>
              lg.name.toLowerCase().includes(nameTry.toLowerCase())
            );
            if (found && !selected.some((s) => s.id === found.id)) {
              selected.push(found);
              break;
            }
          }
        }
        for (const g of lowerGenres) {
          if (selected.length >= MAX_GENRES) break;
          if (!selected.some((s) => s.id === g.id)) selected.push(g);
        }

        const genrePromises = selected.map((g: { id: number; name: string }) =>
          getMoviesByGenre(g.id, pagesForGenre).then((movies) => ({ id: g.id, movies }))
        );

        const genreResults = await Promise.all(genrePromises);
        const mapping: Record<number, Filme[]> = {};
        genreResults.forEach((r) => (mapping[r.id] = r.movies || []));
        
        setGenreMovies(mapping); // 🎉 Agora definido!
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

      {/* Destaque principal */}
      {popular.length > 0 && (
        <MovieCard movie={popular[0]} />
      )}

      <Text style={styles.sectionTitle}>Popular</Text>
      <MovieRow movies={popular} />

      <Text style={styles.sectionTitle}>Em exibição</Text>
      <MovieRow movies={nowPlaying} />

      <Text style={styles.sectionTitle}>Mais bem avaliados</Text>
      <MovieRow movies={topRated} />

      <Text style={styles.sectionTitle}>Próximos lançamentos</Text>
      <MovieRow movies={upcoming} />
      {genres.map((g) =>
        genreMovies[g.id] && genreMovies[g.id].length > 0 ? (
          <View key={g.id}>
            <Text style={styles.sectionTitle}>{g.name}</Text>
            <MovieRow movies={genreMovies[g.id]} />
          </View>
        ) : null
      )}
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