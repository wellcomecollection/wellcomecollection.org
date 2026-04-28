// Extracts the URL path segment (filename portion without query string) from a Prismic asset URL.
// e.g. "https://images.prismic.io/repo/abc_file.jpg?auto=format" -> "abc_file.jpg"
export function urlPathSegment(url: string): string {
  if (!url) return '';

  const pathname = new URL(url).pathname;
  return pathname.split('/').pop() ?? '';
}
