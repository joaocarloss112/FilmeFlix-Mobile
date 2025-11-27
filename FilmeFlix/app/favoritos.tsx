import { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  Pressable, 
  Alert, 
  ScrollView, 
  FlatList  // <- Adicione esta linha
} from "react-native";
import DraggableFlatList, { RenderItemParams } from "react-native-draggable-flatlist";
import { useStore, FavoriteMovie } from "../lib/store";
import { getFavorites, removeFavorite } from "../lib/favoritos";
import MovieCard from "../destaques/MovieCard";
import {
  createPlaylist,
  getPlaylists,
  addMovieToPlaylist,
  Playlist as BackendPlaylist,
} from "../lib/playlists";


export default function FavoritosPage() {
  const { user, favorites, setFavorites } = useStore();
  const [playlists, setPlaylists] = useState<BackendPlaylist[]>([]);
  const [playlistName, setPlaylistName] = useState("");

  // Carregar favoritos e playlists do backend
  useEffect(() => {
    if (user) {
      getFavorites(user.objectId).then(setFavorites);
      getPlaylists(user.objectId).then(setPlaylists);
    }
  }, [user]);

  if (!user)
    return <Text style={{ color: "#fff", padding: 20 }}>Faça login para ver seus favoritos</Text>;

  // Remover filme dos favoritos
  async function handleRemove(movieId: number) {
    if (!user) return;
    const removed = await removeFavorite(movieId, user.objectId);
    if (removed) setFavorites(favorites.filter(f => f.id !== movieId));
  }

  // Criar nova playlist no backend
  async function handleCreatePlaylist() {
    const name = playlistName.trim();
    if (!name) return Alert.alert("Nome inválido", "Digite um nome para a playlist.");
    if (!user) return;
    if (playlists.some(p => p.name === name)) {
      Alert.alert("Nome duplicado", "Já existe uma playlist com esse nome.");
      return;
    }
    const newPlaylist = await createPlaylist(user.objectId, name);
    if (newPlaylist) setPlaylists([newPlaylist, ...playlists]);
    setPlaylistName("");
  }

  // Adicionar filme a playlist
  async function handleAddToPlaylist(playlistId: string, movie: FavoriteMovie) {
    const playlist = playlists.find(p => p.objectId === playlistId);
    if (!playlist) return;

    if (playlist.movies.find(m => m.id === movie.id)) {
      Alert.alert("Filme já na playlist", `"${movie.title}" já está nessa playlist.`);
      return;
    }

    const success = await addMovieToPlaylist(playlistId, movie);
    if (success) {
      setPlaylists(playlists.map(p =>
        p.objectId === playlistId
          ? { ...p, movies: [...p.movies, movie] }
          : p
      ));
    }
  }

  // Render item do DraggableFlatList
  const renderFavorite = ({ item, drag }: RenderItemParams<FavoriteMovie>) => (
    <View style={{ marginRight: 12 }}>
      <MovieCard movie={{ id: item.id, title: item.title, poster_path: item.posterPath || null }} style={{ width: 140 }} />
      <Text
        onLongPress={drag}
        style={{ color: "#888", textAlign: "center", marginTop: 4, fontSize: 12 }}
      >
        Segure para arrastar
      </Text>

      <Pressable onPress={() => handleRemove(item.id)} style={{ marginTop: 4, alignItems: "center" }}>
        <Text style={{ color: "#E50914" }}>Remover</Text>
      </Pressable>

      {playlists.length > 0 && (
        <View style={{ marginTop: 6 }}>
          {playlists.map((p) => (
            <Pressable
              key={p.objectId}
              onPress={() => handleAddToPlaylist(p.objectId!, item)}
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
  );

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

      {/* Mostrar playlists */}
      {playlists.map((p) => (
  <View key={p.objectId} style={{ marginBottom: 20 }}>
    <Text style={{ color: "#fff", fontWeight: "bold", marginBottom: 6 }}>{p.name}</Text>

    {p.movies.length === 0 ? (
      <Text style={{ color: "#888", marginBottom: 6 }}>Nenhum filme ainda</Text>
    ) : (
      <View style={{ marginBottom: 6 }}>
        <FlatList<FavoriteMovie>
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
      </View>
    )}
  </View>
))}

<Text style={{ color: "#fff", fontSize: 24, marginBottom: 10 }}>Meus Favoritos</Text>

      <DraggableFlatList
        data={favorites}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderFavorite}
        horizontal
        onDragEnd={({ data }) => setFavorites(data)}
        showsHorizontalScrollIndicator={false}
      />
    </ScrollView>
  );
}
