
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Henrique & Mariana",
    short_name: "H & M",

    description: "Henrique & Mariana 2027",

    start_url: "/",
    scope: "/",

    display: "standalone",
    orientation: "portrait",

    background_color: "#F7F4EF",
    theme_color: "#D9B982",
  };
}
