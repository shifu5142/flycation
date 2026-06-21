import type { MetadataRoute } from "next"

function manifest(): MetadataRoute.Manifest {
  return {
    name: "Flycation – AI Travel Planner",
    short_name: "Flycation",
    description:
      "Plan your perfect trip in seconds with AI-powered itineraries, flights, and hotels.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#3b6fd9",
    icons: [
      {
        src: "/icon",
        sizes: "192x192",
        type: "image/png",
      },
    ],
  }
}

export default manifest
