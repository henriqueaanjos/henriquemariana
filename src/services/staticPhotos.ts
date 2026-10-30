import albums from "@/src/data/staticAlbums.json";

export interface StaticAlbum {
  album: string;
  photos: string[];
}

export function getAlbums(): StaticAlbum[] {
  return albums as StaticAlbum[];
}
