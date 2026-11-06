import { Genre } from "@prisma/client";

export const GENRE_ORDER = [
  "Fiction",
  "Non-Fiction",
  "Sci-Fi",
  "Biography",
  "Other",
] as const;

export type GenreType = typeof GENRE_ORDER[number];

// Helper to convert genre string to Prisma Enum and vice versa
export function toPrismaGenre(genreStr: string): Genre {
  if (genreStr === "Non-Fiction") return Genre.Non_Fiction;
  if (genreStr === "Sci-Fi") return Genre.Sci_Fi;
  return genreStr as Genre;
}

export function fromPrismaGenre(genre: Genre): GenreType {
  if (genre === Genre.Non_Fiction) return "Non-Fiction";
  if (genre === Genre.Sci_Fi) return "Sci-Fi";
  return genre as GenreType;
}

export function formatReadingLog(log: {
  id: string;
  bookTitle: string;
  minutesRead: number;
  genre: Genre;
  note: string;
  favorite: boolean;
  readOn: Date;
  createdAt: Date;
}) {
  return {
    id: log.id,
    bookTitle: log.bookTitle,
    minutesRead: log.minutesRead,
    genre: fromPrismaGenre(log.genre),
    note: log.note,
    favorite: log.favorite,
    readOn: log.readOn.toISOString().split("T")[0],
    createdAt: log.createdAt.toISOString(),
  };
}

