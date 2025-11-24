const API_KEY = "3541c74b87a9455552fa5ae4c33578bd";
const BASE_URL = "https://api.themoviedb.org/3";

async function request(url: string) {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Erro ao buscar: ${url}`);
  }

  return res.json();
}

export async function getMoviesByCategory(category: string, pages = 4) {
  let movies: any[] = [];

  for (let i = 1; i <= pages; i++) {
    const data = await request(
      `${BASE_URL}/movie/${category}?api_key=${API_KEY}&language=pt-BR&page=${i}`
    );
    movies = movies.concat(data.results);
  }

  return movies;
}

export async function getMoviesByGenre(genreId: number, pages = 4) {
  let movies: any[] = [];

  for (let i = 1; i <= pages; i++) {
    const data = await request(
      `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=pt-BR&with_genres=${genreId}&page=${i}`
    );
    movies = movies.concat(data.results);
  }

  return movies;
}
export async function getGenres() {
  const data = await request(
    `${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=pt-BR`
  );

  return data.genres;
}

export async function getMovieDetails(id: number) {
  const movie = await request(
    `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=pt-BR`
  );

  const videosData = await request(
    `${BASE_URL}/movie/${id}/videos?api_key=${API_KEY}&language=pt-BR`
  );

  const trailer = videosData.results.find(
    (video: any) => video.type === "Trailer" && video.site === "YouTube"
  );

  return {
    ...movie,
    trailerKey: trailer?.key || null,
  };
}

export async function getMovieWatchProviders(id: number) {
  const data = await request(
    `${BASE_URL}/movie/${id}/watch/providers?api_key=${API_KEY}`
  );

  return data.results?.BR ?? null;
}

export async function searchMovies(query: string, page = 1) {
  if (!query.trim()) return [];

  const data = await request(
    `${BASE_URL}/search/movie?api_key=${API_KEY}&language=pt-BR&query=${encodeURIComponent(
      query
    )}&page=${page}`
  );

  return data.results;
}
