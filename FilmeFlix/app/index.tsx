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

// Componente auxiliar para evitar o erro de nó de texto no mapeamento
function GenreSection({ genre, movies }: { genre: { id: number, name: string }, movies: Filme[] | undefined }) {
    if (!movies || movies.length === 0) {
        return null;
    }
    return (
        <View>
            <Text style={styles.sectionTitle}>{genre.name}</Text>
            <MovieRow movies={movies} />
        </View>
    );
}

export default function Home() {
  const [popular, setPopular] = useState<Filme[]>([]);
  const [nowPlaying, setNowPlaying] = useState<Filme[]>([]);
  const [topRated, setTopRated] = useState<Filme[]>([]);
  const [upcoming, setUpcoming] = useState<Filme[]>([]);
  const [loading, setLoading] = useState(true);
  const [genres, setGenres] = useState<{ id: number; name: string }[]>([]);
  const [genreMovies, setGenreMovies] = useState<Record<number, Filme[]>>({});

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
        setGenres(allGenres || []); 
        
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
        
        setGenreMovies(mapping); 
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
    // Envolvemos tudo em uma View para garantir que a ScrollView só tem 1 filho no topo
    <View style={styles.fullScreenContainer}> 
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
            
            {/* Usamos o componente auxiliar para renderizar os gêneros */}
            {genres.map((g) => (
                <GenreSection 
                    key={g.id} 
                    genre={g} 
                    movies={genreMovies[g.id]} 
                />
            ))}
        </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
    fullScreenContainer: {
        flex: 1, // Garante que a View ocupe toda a tela para o scroll
        backgroundColor: "#111", 
    },
    container: { 
        paddingHorizontal: 20, // Adicionei padding horizontal
        paddingVertical: 10,
    },
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
        marginTop: 10, // Pequena margem para não colar no Navbar
    },
    sectionTitle: {
        color: "#fff",
        fontSize: 20,
        marginTop: 16,
        marginBottom: 8,
        fontWeight: "600",
    },
});