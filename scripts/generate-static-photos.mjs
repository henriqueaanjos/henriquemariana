
import fs from "node:fs";
import path from "node:path";

const photosPath = path.join(process.cwd(), "public", "Photos");
const outputPath = path.join(
  process.cwd(),
  "src",
  "data",
  "staticAlbums.json",
);

const imageExtensions = /\.(jpg|jpeg|png|webp|avif)$/i;

if (!fs.existsSync(photosPath)) {
  throw new Error(
    `Diretório de fotos não encontrado: ${photosPath}`,
  );
}

const albums = fs
  .readdirSync(photosPath, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .sort((a, b) => a.name.localeCompare(b.name))
  .map((entry) => {
    const albumPath = path.join(photosPath, entry.name);

    const photos = fs
      .readdirSync(albumPath, { withFileTypes: true })
      .filter(
        (file) =>
          file.isFile() && imageExtensions.test(file.name),
      )
      .map(
        (file) =>
          `/photos/${encodeURIComponent(entry.name)}/${encodeURIComponent(file.name)}`,
      )
      .sort((a, b) => a.localeCompare(b));

    return {
      album: entry.name,
      photos,
    };
  });

fs.mkdirSync(path.dirname(outputPath), { recursive: true });

fs.writeFileSync(
  outputPath,
  JSON.stringify(albums, null, 2),
  "utf8",
);

console.log(
  `Álbuns estáticos gerados: ${albums.length}`,
);
