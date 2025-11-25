import { ScrollView, View, Text, StyleSheet, Image } from "react-native";

export default function Sobre() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titulo}>Sobre o FilmeFlix</Text>

      <Image
        source={{ uri: "https://cdn-icons-png.flaticon.com/512/2798/2798007.png" }}
        style={styles.logo}
      />

      <Text style={styles.texto}>
        O FilmeFlix é um aplicativo desenvolvido para apresentar filmes,
        trailers, recomendações e detalhes das obras disponíveis em diversas
        plataformas.
      </Text>

      <Text style={styles.texto}>
        Este projeto foi criado por Juliana Tenorio para a disciplina de
        Desenvolvimento Mobile, utilizando React Native + Expo Router.
      </Text>

      <Text style={styles.subtitulo}>Tecnologias usadas:</Text>
      <Text style={styles.texto}>• React Native</Text>
      <Text style={styles.texto}>• Expo</Text>
      <Text style={styles.texto}>• Expo Router</Text>
      <Text style={styles.texto}>• TheMovieDB API</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#111", flex: 1 },
  titulo: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  subtitulo: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  texto: {
    color: "#ccc",
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 10,
  },
  logo: {
    width: 120,
    height: 120,
    alignSelf: "center",
    marginBottom: 20,
  },
});
