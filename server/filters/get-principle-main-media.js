export default function getPrincipleMainMedia(arr: []) {
  const video = arr.find(item => item.type === 'video-embed');
  const image = arr.find(item => item.image && item.image.contentUrl);

  return video || image;
}
