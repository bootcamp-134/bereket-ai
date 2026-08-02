import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Bereket AI",
    short_name: "Bereket",
    description: "Bütçe ve eldeki malzemeler için güvenli tarif önerileri.",
    start_url: "/",
    display: "standalone",
    background_color: "#07130f",
    theme_color: "#07130f",
    lang: "tr",
  };
}
