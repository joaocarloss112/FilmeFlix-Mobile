import { create } from "zustand";

export interface User {
  username: string;
  objectId: string;
  sessionToken: string;
}

export interface FavoriteMovie {
  id: number;
  title: string;
  posterPath?: string | null;
}

interface AppState {
  user: User | null;
  favorites: FavoriteMovie[];
  setUser: (user: User | null) => void;
  logout: () => void;
  setFavorites: (movies: FavoriteMovie[]) => void;
  addFavorite: (movie: FavoriteMovie) => void;
  removeFavorite: (movieId: number) => void;
}

export const useStore = create<AppState>((set, get) => ({
  user: null,
  favorites: [],
  setUser: (user) => set({ user }),
  logout: () => set({ user: null, favorites: [] }),
  setFavorites: (movies) => set({ favorites: movies }),
  addFavorite: (movie) =>
    set({ favorites: [...get().favorites, movie] }),
  removeFavorite: (movieId) =>
    set({ favorites: get().favorites.filter(f => f.id !== movieId) }),
}));
