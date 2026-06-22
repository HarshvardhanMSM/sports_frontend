export function resolveImageUrl(url?: string | null): string | undefined {
  if (!url) return undefined;
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("blob:") || url.startsWith("data:")) return url;
  const base = process.env.NEXT_PUBLIC_IMAGES_URL ?? "";
  return `${base.replace(/\/+$/, "")}/${url.replace(/^\/+/, "")}`;
}
