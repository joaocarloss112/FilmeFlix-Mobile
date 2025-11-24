import Parse from "./parse";

export interface FavoriteMovie {
  id: number;
  title: string;
  posterPath?: string;
}
export async function saveFavorite(movie: FavoriteMovie) {
  try {
    const user = Parse.User.current();
    if (!user) return false;

    const FavoriteClass = Parse.Object.extend("Favorite");
    const favorite = new FavoriteClass();

    favorite.set("movieId", movie.id);
    favorite.set("title", movie.title);
    favorite.set("posterPath", movie.posterPath || "");
    favorite.set("user", user);

    await favorite.save();

    return true;
  } catch (err) {
    console.error("Erro ao salvar favorito:", err);
    return false;
  }
}

export async function getFavorites(): Promise<FavoriteMovie[]> {
  try {
    const user = Parse.User.current();
    if (!user) return [];

    const query = new Parse.Query("Favorite");
    query.equalTo("user", user);
    query.limit(1000);

    const results = await query.find();

    return results.map((fav: any) => ({
      id: fav.get("movieId"),
      title: fav.get("title"),
      posterPath: fav.get("posterPath"),
    }));
  } catch (err) {
    console.error("Erro ao carregar favoritos:", err);
    return [];
  }
}


// ------------------------------------------------
// Remover favorito
// ------------------------------------------------
export async function removeFavorite(movieId: number) {
  try {
    const user = Parse.User.current();
    if (!user) return false;

    const query = new Parse.Query("Favorite");
    query.equalTo("movieId", movieId);
    query.equalTo("user", user);

    const results = await query.find();

    if (results.length === 0) return false;

    await Parse.Object.destroyAll(results);
    return true;
  } catch (err) {
    console.error("Erro ao remover favorito:", err);
    return false;
  }
}

export default { saveFavorite, getFavorites, removeFavorite };
