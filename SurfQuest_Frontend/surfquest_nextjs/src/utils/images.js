// utils/images.js
export function normalizeImages(images) {
  if (!Array.isArray(images)) return [];

  if (images.length > 0 && typeof images[0] === "string") return images;
  if (images.length > 0 && typeof images[0] === "object")
    return images.map((img) => img?.image).filter(Boolean);

  return [];
}

// A utiliser comme ceci:

// import { normalizeImages } from "@/utils/images";
// const images = normalizeImages(surfzone.zone_images);