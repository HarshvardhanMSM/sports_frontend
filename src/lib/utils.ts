export function getImageUrl(path?: string): string | undefined {
  if (!path) return undefined;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const base = process.env.NEXT_PUBLIC_IMAGES_URL || process.env.NEXT_PUBLIC_API_URL || "";
  return `${base.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;
}
