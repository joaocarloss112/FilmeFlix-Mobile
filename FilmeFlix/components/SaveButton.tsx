
import { useState, useEffect } from "react";
import { TouchableOpacity, Text, StyleSheet, Alert } from "react-native";
import { saveFavorite, getFavorites, removeFavorite, FavoriteMovie } from "../lib/favorito";

interface SaveButtonProps {
  movie: { id: number; title: string };
}

export default function SaveButton({ movie }: SaveButtonProps) {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkIfSaved() {
      const favoritos: FavoriteMovie[] = await getFavorites();
      const jaExiste = favoritos.some((fav) => fav.id === movie.id);
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
      else Alert.alert("Erro", "Erro ao remover favorito!");
    } else {
      const ok = await saveFavorite(movie);
      if (ok) setSaved(true);
      else Alert.alert("Erro", "Erro ao salvar favorito!");
    }

    setLoading(false); 
  }

  return (
    <TouchableOpacity
      style={[styles.button, saved ? styles.saved : styles.notSaved, loading && styles.disabled]}
      onPress={handleToggle}
      disabled={loading}
    >
      <Text style={styles.text}>
        {loading
          ? "Processando..."
          : saved
          ? "Remover dos Favoritos"
          : "Salvar nos Favoritos"}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
  },
  saved: {
    backgroundColor: "gray",
  },
  notSaved: {
    backgroundColor: "red",
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    color: "white",
    fontWeight: "bold",
  },
});
