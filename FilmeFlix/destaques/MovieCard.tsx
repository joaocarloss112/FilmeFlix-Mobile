import { View, Text, Image, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
type Movie = {
  id: number;
  title: string;
  poster_path: string;
};

export default function MovieCard({ movie }: { movie: Movie }) {
  if (!movie) return null;

  return (
    <View
      style={{
        width: 140,
        marginRight: 12,
      }}
    >
      <Link
        href={`/movie/${movie.id}`}
        asChild
      >
        <TouchableOpacity>
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/w300${movie.poster_path}`,
            }}
            style={{
              width: 140,
              height: 210,
              borderRadius: 12,
            }}
            resizeMode="cover"
          />
          <Text
            style={{
              marginTop: 6,
              fontSize: 14,
              fontWeight: "bold",
              color: "#fff",
            }}
            numberOfLines={2}
          >
            {movie.title}
          </Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}
