import * as fs from 'fs';

// Extracts the URL path segment (filename portion without query string) from a Prismic asset URL.
// e.g. "https://images.prismic.io/repo/abc_file.jpg?auto=format" -> "abc_file.jpg"
export function urlPathSegment(url: string): string {
  if (!url) return '';

  const pathname = new URL(url).pathname;
  return pathname.split('/').pop() ?? '';
}

// Reads and parses a JSON file with error handling.
export function readJsonFile<T>(filePath: string): T {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content) as T;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to read JSON from ${filePath}: ${message}`, {
      cause: error,
    });
  }
}

// Escapes regex special characters in a string for safe use in RegExp constructor.
export function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
