import { parseGet, parsePost, parsePut } from "./parse";
import { FavoriteMovie } from "./store";

export interface Playlist {
  objectId?: string;
  userId: string;
  name: string;
  movies: FavoriteMovie[];
}

// Criar nova playlist
export async function createPlaylist(userId: string, name: string): Promise<Playlist | null> {
  try {
    const res: any = await parsePost("classes/Playlist", { userId, name, movies: [] });
    return { objectId: res.objectId, userId, name, movies: [] };
  } catch (err) {
    console.error("Erro ao criar playlist:", err);
    return null;
  }
}

// Buscar playlists do usuário
export async function getPlaylists(userId: string): Promise<Playlist[]> {
  try {
    const where = encodeURIComponent(JSON.stringify({ userId }));
    const res: any = await parseGet(`classes/Playlist?where=${where}`);
    if (!res.results) return [];
    return res.results.map((p: any) => ({
      objectId: p.objectId,
      userId: p.userId,
      name: p.name,
      movies: p.movies || [],
    }));
  } catch (err) {
    console.error("Erro ao buscar playlists:", err);
    return [];
  }
}

// Adicionar filme a uma playlist
export async function addMovieToPlaylist(playlistId: string, movie: FavoriteMovie) {
  try {
    const playlist: any = await parseGet(`classes/Playlist/${playlistId}`);
    const movies = playlist.movies || [];
    // Evita duplicados
    if (!movies.find((m: any) => m.id === movie.id)) {
      movies.push(movie);
      await parsePut(`classes/Playlist/${playlistId}`, { movies });
    }
    return true;
  } catch (err) {
    console.error("Erro ao adicionar filme à playlist:", err);
    return false;
  }
}
