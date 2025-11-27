import { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from "react-native";
import MovieRow from "../destaques/MovieRow";
import MovieCard from "../destaques/MovieCard";
import { getMoviesByCategory, getGenres, getMoviesByGenre } from "../lib/tmdb";
import { useStore } from "../lib/store";

type Filme = {
  id: number;
  title: string;
  poster_path?: string | null;
};

type Genre = {
  id: number;
  name: string;
};

function GenreSection({ genre, movies }: { genre: Genre; movies: (Filme | null | undefined)[] | undefined }) {
  if (!movies) return null;

  // Filtra apenas filmes válidos
  const validMovies: Filme[] = movies.filter((f): f is Filme => !!f);
  if (validMovies.length === 0) return null;

  return (
    <View>
      <Text style={styles.sectionTitle}>{genre.name}</Text>
      <MovieRow movies={validMovies} />
    </View>
  );
}

export default function HomeScreen() {
  const [popular, setPopular] = useState<Filme[]>([]);
  const [nowPlaying, setNowPlaying] = useState<Filme[]>([]);
  const [topRated, setTopRated] = useState<Filme[]>([]);
  const [upcoming, setUpcoming] = useState<Filme[]>([]);
  const [loading, setLoading] = useState(true);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [genreMovies, setGenreMovies] = useState<Record<number, Filme[]>>({});

  const { user, favorites, setFavorites } = useStore();

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

        // Filtra apenas filmes válidos
        setPopular((pop || []).filter((f): f is Filme => !!f));
        setNowPlaying((now || []).filter((f): f is Filme => !!f));
        setTopRated((top || []).filter((f): f is Filme => !!f));
        setUpcoming((up || []).filter((f): f is Filme => !!f));

        const allGenres = await getGenres();
        setGenres(allGenres || []);

        const preferred: string[][] = [
          ["ação","action"],
          ["comédia","comedy"],
          ["ficção científica","science fiction","sci-fi","science_fiction"],
          ["drama"],
          ["terror","horror"],
          ["romance"],
          ["fantasia","fantasy"],
          ["animação","animation"],
          ["crime"],
          ["thriller"]
        ];

        const MAX_GENRES = 10;
        const MIN_MOVIES_PER_GENRE = 30;
        const RESULTS_PER_PAGE = 40;
        const pagesForGenre = Math.ceil(MIN_MOVIES_PER_GENRE / RESULTS_PER_PAGE);

        // Garante que lowerGenres está tipado corretamente
        const lowerGenres: Genre[] = (allGenres || []).map((g: Genre) => ({ id: g.id, name: String(g.name) }));
        const selected: Genre[] = [];

        // Seleciona gêneros preferidos
        for (const opts of preferred) {
          if (selected.length >= MAX_GENRES) break;
          for (const nameTry of opts) {
            const found = lowerGenres.find((lg: Genre) =>
              lg.name.toLowerCase().includes(nameTry.toLowerCase())
            );
            if (found && !selected.some(s => s.id === found.id)) {
              selected.push(found);
              break;
            }
          }
        }

        // Preenche até MAX_GENRES com os restantes
        for (const g of lowerGenres) {
          if (selected.length >= MAX_GENRES) break;
          if (!selected.some(s => s.id === g.id)) selected.push(g);
        }

        // Busca filmes por gênero
        const genrePromises = selected.map(g =>
          getMoviesByGenre(g.id, pagesForGenre).then(movies => ({ id: g.id, movies }))
        );
        const genreResults = await Promise.all(genrePromises);
        const mapping: Record<number, Filme[]> = {};
        genreResults.forEach(r => mapping[r.id] = (r.movies || []).filter((f): f is Filme => !!f));
        setGenreMovies(mapping);

        // Carrega favoritos do usuário
        if (user) {
          const { getFavorites } = await import("../lib/favoritos");
          const favs = await getFavorites(user.objectId);
          setFavorites(favs);
        }

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [user]);

  if (loading) return (
    <View style={styles.loading}>
      <ActivityIndicator size="large" color="#fff"/>
    </View>
  );

  return (
    <ScrollView style={styles.fullScreenContainer}>
      <View style={{ marginBottom: 15 }}>
        {user
          ? <Text style={{ color: "#fff", fontSize: 18 }}>Olá, {user.username}!</Text>
          : <Text style={{ color: "#fff", fontSize: 18 }}>Bem-vindo ao FilmeFlix!</Text>
        }
      </View>

      <Text style={styles.titulo}>Filmes Populares</Text>
      {popular.length > 0 && <MovieCard movie={popular[0]} />}
      <Text style={styles.sectionTitle}>Popular</Text>
      <MovieRow movies={popular} />
      <Text style={styles.sectionTitle}>Em exibição</Text>
      <MovieRow movies={nowPlaying} />
      <Text style={styles.sectionTitle}>Mais bem avaliados</Text>
      <MovieRow movies={topRated} />
      <Text style={styles.sectionTitle}>Próximos lançamentos</Text>
      <MovieRow movies={upcoming} />

      {genres.map(g => (
        <GenreSection key={g.id} genre={g} movies={genreMovies[g.id]} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  fullScreenContainer: { flex: 1, backgroundColor: "#111", paddingHorizontal: 20, paddingVertical: 10 },
  loading: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000" },
  titulo: { color: "#fff", fontSize: 26, marginBottom: 20, fontWeight: "bold", marginTop: 10 },
  sectionTitle: { color: "#fff", fontSize: 20, marginTop: 16, marginBottom: 8, fontWeight: "600" },
});
