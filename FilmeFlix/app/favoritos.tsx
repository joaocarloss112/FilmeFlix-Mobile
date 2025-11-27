import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  TextInput,
  Alert,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useStore, FavoriteMovie } from "../lib/store";
import { getFavorites, removeFavorite } from "../lib/favoritos";
import MovieCard from "../destaques/MovieCard";

interface Playlist {
  name: string;
  movies: FavoriteMovie[];
}

export default function FavoritosPage() {
  const { user, favorites, setFavorites } = useStore();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [playlistName, setPlaylistName] = useState("");

  useEffect(() => {
    if (user) {
      getFavorites(user.objectId).then(setFavorites);
    }
  }, [user]);

  if (!user)
    return <Text style={{ color: "#fff", padding: 20 }}>Faça login para ver seus favoritos</Text>;

  async function handleRemove(movieId: number) {
    if (!user) return;
    const removed = await removeFavorite(movieId, user.objectId);
    if (removed) setFavorites(favorites.filter(f => f.id !== movieId));
  }

  function handleCreatePlaylist() {
    const name = playlistName.trim();
    if (!name) {
      Alert.alert("Nome inválido", "Digite um nome para a playlist.");
      return;
    }
    if (playlists.some(p => p.name === name)) {
      Alert.alert("Nome duplicado", "Já existe uma playlist com esse nome.");
      return;
    }
    setPlaylists([{ name, movies: [] }, ...playlists]); // cria playlist vazia no topo
    setPlaylistName("");
  }

  function handleAddToPlaylist(playlistIndex: number, movie: FavoriteMovie) {
    const updated = [...playlists];
    const exists = updated[playlistIndex].movies.some(m => m.id === movie.id);
    if (exists) {
      Alert.alert("Filme já na playlist", `"${movie.title}" já está nessa playlist.`);
      return;
    }
    updated[playlistIndex].movies.push({ ...movie }); // cria cópia
    setPlaylists(updated);
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#000", padding: 20 }}>
      <Text style={{ color: "#fff", fontSize: 24, marginBottom: 10 }}>Playlists</Text>

      {/* Input para criar playlist */}
      <View style={{ flexDirection: "row", marginBottom: 20, alignItems: "center" }}>
        <TextInput
          value={playlistName}
          onChangeText={setPlaylistName}
          placeholder="Nome da playlist"
          placeholderTextColor="#888"
          style={{
            flex: 1,
            paddingHorizontal: 12,
            paddingVertical: 8,
            backgroundColor: "#222",
            color: "#fff",
            borderRadius: 6,
          }}
        />
        <Pressable
          onPress={handleCreatePlaylist}
          style={{
            marginLeft: 10,
            backgroundColor: "#E50914",
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 6,
          }}
        >
          <Text style={{ color: "#fff" }}>Criar</Text>
        </Pressable>
      </View>

      {/* Mostrar Playlists */}
      {playlists.length > 0 &&
        playlists.map((p, idx) => (
          <View key={idx} style={{ marginBottom: 20 }}>
            <Text style={{ color: "#fff", fontWeight: "bold", marginBottom: 6 }}>
              {p.name}
            </Text>
            {p.movies.length === 0 ? (
              <Text style={{ color: "#888", marginBottom: 6 }}>Nenhum filme ainda</Text>
            ) : (
              <FlatList
                data={p.movies}
                horizontal
                keyExtractor={(item) => item.id.toString()}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <MovieCard
                    movie={{
                      id: item.id,
                      title: item.title,
                      poster_path: item.posterPath || null,
                    }}
                    style={{ width: 140, marginRight: 12 }}
                  />
                )}
              />
            )}
          </View>
        ))}

      <Text style={{ color: "#fff", fontSize: 24, marginBottom: 10 }}>Meus Favoritos</Text>

      {/* Lista de favoritos */}
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={{ marginRight: 12 }}>
            <MovieCard
              movie={{
                id: item.id,
                title: item.title,
                poster_path: item.posterPath || null,
              }}
              style={{ width: 140 }}
            />
            <Pressable
              onPress={() => handleRemove(item.id)}
              style={{ marginTop: 4, alignItems: "center" }}
            >
              <Text style={{ color: "#E50914" }}>Remover</Text>
            </Pressable>

            {/* Botões para adicionar a playlists */}
            {playlists.length > 0 && (
              <View style={{ marginTop: 6 }}>
                {playlists.map((p, idx) => (
                  <Pressable
                    key={idx}
                    onPress={() => handleAddToPlaylist(idx, item)}
                    style={{
                      backgroundColor: "#444",
                      paddingVertical: 4,
                      paddingHorizontal: 6,
                      borderRadius: 4,
                      marginBottom: 4,
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ color: "#fff", fontSize: 12 }}>Adicionar à {p.name}</Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>
        )}
      />
    </ScrollView>
  );
}
