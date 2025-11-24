import { View, Text, Image, TouchableOpacity } from "react-native";
import { Link } from "expo-router";

type Movie = {
  id: number;
  title: string;
  poster_path?: string | null;
};

export default function MovieCard({ movie }: { movie?: Movie | null }) {
  if (!movie) return null;

  const posterUri = movie.poster_path
    ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
    : undefined;

  return (
    <View
      style={{
        width: 140,
        marginRight: 12,
      }}
    >
      <Link href={((`/movie/${movie.id}` as unknown) as any)} asChild>
        <TouchableOpacity>
          {posterUri ? (
            <Image
              source={{ uri: posterUri }}
              style={{
                width: 140,
                height: 210,
                borderRadius: 12,
              }}
              resizeMode="cover"
            />
          ) : (
            <View
              style={{
                width: 140,
                height: 210,
                borderRadius: 12,
                backgroundColor: "#333",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#fff" }}>Sem imagem</Text>
            </View>
          )}

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
