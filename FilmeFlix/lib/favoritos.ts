import { parseGet, parsePost, parseDelete } from "./parse";

export interface FavoriteMovie {
  id: number;
  title: string;
  posterPath?: string;
}

export async function saveFavorite(movie: FavoriteMovie, userId: string) {
  try {
    const res = await parsePost("classes/Favorite", {
      movieId: movie.id,
      title: movie.title,
      posterPath: movie.posterPath || "",
      userId,
    });
    return !!res.objectId;
  } catch (err) {
    console.error("Erro ao salvar favorito:", err);
    return false;
  }
}

export async function getFavorites(userId: string): Promise<FavoriteMovie[]> {
  try {
    const where = encodeURIComponent(JSON.stringify({ userId }));
    const res: any = await parseGet(`classes/Favorite?where=${where}`);
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

export async function removeFavorite(movieId: number, userId: string) {
  try {
    const where = encodeURIComponent(JSON.stringify({ movieId, userId }));
    const res: any = await parseGet(`classes/Favorite?where=${where}`);
    if (!res.results || res.results.length === 0) return false;

    const objectId = res.results[0].objectId;
    await parseDelete(`classes/Favorite/${objectId}`);
    return true;
  } catch (err) {
    console.error("Erro ao remover favorito:", err);
    return false;
  }
}

export default { saveFavorite, getFavorites, removeFavorite };
