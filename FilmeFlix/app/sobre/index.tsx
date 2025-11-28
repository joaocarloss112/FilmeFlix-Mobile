import { ScrollView, View, Text, StyleSheet, Image, Pressable, Linking } from "react-native";

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
        Este projeto foi desenvolvido por uma equipe de estudantes na
        disciplina de Desenvolvimento Mobile, utilizando React Native + Expo Router.
      </Text>

      <Text style={styles.subtitulo}>Destaques</Text>
      <Text style={styles.texto}>Conheça alguns responsáveis pelo projeto:</Text>

      <View style={styles.profilesRow}>
        <Pressable
          style={styles.personContainer}
          onPress={() => Linking.openURL('https://github.com/julianacot')}
        >
          <Image
            source={{ uri: 'https://github.com/julianacot.png' }}
            style={styles.avatar}
          />
          <Text style={styles.personName}>Juliana Tenorio</Text>
        </Pressable>

        <Pressable
          style={styles.personContainer}
          onPress={() => Linking.openURL('https://github.com/rickzerahh')}
        >
          <Image
            source={{ uri: 'https://github.com/rickzerahh.png' }}
            style={styles.avatar}
          />
          <Text style={styles.personName}>Ricardo André</Text>
        </Pressable>

        <Pressable
          style={styles.personContainer}
          onPress={() => Linking.openURL('https://github.com/joaocarloss112')}
        >
          <Image
            source={{ uri: 'https://github.com/joaocarloss112.png' }}
            style={styles.avatar}
          />
          <Text style={styles.personName}>João Carlos</Text>
        </Pressable>

        <Pressable
          style={styles.personContainer}
          onPress={() => Linking.openURL('https://github.com/Igor2427')}
        >
          <Image
            source={{ uri: 'https://github.com/Igor2427.png' }}
            style={styles.avatar}
          />
          <Text style={styles.personName}>Igor Gabriel</Text>
        </Pressable>
      </View>

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
  profilesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    marginTop: 10,
  },
  personContainer: {
    width: "48%",
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: "rgba(255,255,255,0.03)",
    paddingVertical: 10,
    borderRadius: 8,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    marginBottom: 8,
  },
  personName: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
