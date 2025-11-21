import { useEffect, useState } from "react";
import { View, Text, ScrollView, Image, ActivityIndicator, StyleSheet } from "react-native";
import HeroMovie from "../destaques/Filme_principal";

type Filme = {
  id: number;
  title: string;
  poster_path?: string;
  backdrop_path?: string;
};

export default function TesteFilmes() {
  const [filmes, setFilmes] = useState<Filme[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregar() {
      const resp = await fetch(
        "https://api.themoviedb.org/3/movie/popular?api_key=3541c74b87a9455552fa5ae4c33578bd&language=pt-BR"
      );
      const json = await resp.json();
      setFilmes(json.results);
      setLoading(false);
    }

    carregar();
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
      {filmes.length > 0 && <HeroMovie movie={filmes[0]} />}
      {filmes.map((f) => (
        <View key={f.id} style={styles.card}>
          {f.poster_path ? (
            <Image
              source={{
                uri: `https://image.tmdb.org/t/p/w500${f.poster_path}`,
              }}
              style={styles.poster}
            />
          ) : (
            <View style={styles.semImagem}>
              <Text style={{ color: "#fff" }}>Sem imagem</Text>
            </View>
          )}

          <Text style={styles.nome}>{f.title}</Text>
        </View>
      ))}
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
  card: {
    marginBottom: 30,
    alignItems: "center",
  },
  poster: {
    width: 200,
    height: 300,
    borderRadius: 10,
    marginBottom: 10,
  },
  semImagem: {
    width: 200,
    height: 300,
    borderRadius: 10,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  nome: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
    width: 200,
  },
});
