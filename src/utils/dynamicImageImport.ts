export const dynamicImageImport = import.meta.glob<{ default: ImageMetadata }>(
  "/src/images/*.{jpeg,jpg,png,svg}",
);
