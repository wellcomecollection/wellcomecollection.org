export default function youtubeEmbedUrl(youtubeWatchUri) {
  const matches = youtubeWatchUri.match(/\/watch\?v=(.*)$/);
  const id = matches && matches.length > 0 && matches[1];

  return `https://youtube.com/embed/${id}`;
}
