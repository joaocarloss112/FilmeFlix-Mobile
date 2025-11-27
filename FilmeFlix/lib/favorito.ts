// lib/favoritos.ts
import { parseGet, parsePost, parsePut } from "../lib/parse"; // ../lib/ para subir um nível


export interface FavoriteMovie {
  id: number;
  title: string;
  posterPath?: string;
}

// Salvar favorito
export async function saveFavorite(movie: FavoriteMovie, userId: string) {
  try {
    const res = await parsePost("classes/Favorite", {
      movieId: movie.id,
      title: movie.title,
      posterPath: movie.posterPath || "",
      userId, // associando ao usuário
    });
    return !!res.objectId;
  } catch (err) {
    console.error("Erro ao salvar favorito:", err);
    return false;
  }
}

// Buscar favoritos do usuário
export async function getFavorites(userId: string): Promise<FavoriteMovie[]> {
  try {
    // Parse REST API: filtro por userId
    const res: any = await parseGet(`classes/Favorite?where=${encodeURIComponent(JSON.stringify({ userId }))}`);
    if (!res.results) return [];

    return res.results.map((fav: any) => ({
      id: fav.movieId,
      title: fav.title,
      posterPath: fav.posterPath,
    }));
  } catch (err) {
    console.error("Erro ao carregar favoritos:", err);
    return [];
  }
}

// Remover favorito
export async function removeFavorite(movieId: number, userId: string) {
  try {
    // Buscar o objeto para deletar
    const res: any = await parseGet(`classes/Favorite?where=${encodeURIComponent(JSON.stringify({ movieId, userId }))}`);
    if (!res.results || res.results.length === 0) return false;

    const objectId = res.results[0].objectId;
    await parsePut(`classes/Favorite/${objectId}`, {}); // ou parseDelete se implementar
    return true;
  } catch (err) {
    console.error("Erro ao remover favorito:", err);
    return false;
  }
}

export default { saveFavorite, getFavorites, removeFavorite };
