import youtubeEmbedUrl from './youtube-embed-url';

// We could do this automatically with `fs`, but that's unnecessary I/O
// And doesn't allow us to exclude some.
module.exports = new Map([
  ['youtubeEmbedUrl', youtubeEmbedUrl]
]);
