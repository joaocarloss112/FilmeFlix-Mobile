import { useState, useEffect } from "react";
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from "react-native";
import { saveFavorite, getFavorites, removeFavorite } from "../lib/favoritos";

type Movie = {
  id: number;
  title: string;
  poster_path?: string;
  backdrop_path?: string;
};

export default function SaveButton({ movie }: { movie: Movie }) {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkIfSaved() {
      const favoritos = await getFavorites();
      const jaExiste = favoritos.some((fav: Movie) => fav.id === movie.id);
      setSaved(jaExiste);
      setLoading(false);
    }
    checkIfSaved();
  }, [movie.id]);

  async function handleToggle() {
    if (loading) return;

    setLoading(true);

    if (saved) {
      const ok = await removeFavorite(movie.id);
      if (ok) setSaved(false);
      else alert("Erro ao remover favorito!");
    } else {
      const ok = await saveFavorite(movie);
      if (ok) setSaved(true);
      else alert("Erro ao salvar favorito!");
    }

    setLoading(false);
  }

  return (
    <TouchableOpacity
      onPress={handleToggle}
      disabled={loading}
      style={[
        styles.button,
        saved ? styles.saved : styles.unsaved,
        loading && styles.loading,
      ]}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={styles.text}>
          {saved ? "Remover dos Favoritos" : "Salvar nos Favoritos"}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  saved: {
    backgroundColor: "gray",
  },
  unsaved: {
    backgroundColor: "red",
  },
  loading: {
    opacity: 0.6,
  },
  text: {
    color: "white",
    fontWeight: "600",
  },
});
