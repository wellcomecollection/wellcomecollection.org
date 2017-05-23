export default function getPrincipleMainMedia(arr: []) {
  const video = arr.find(item => item.type === 'video-embed');
  const picture = arr.find(item => item.type === 'picture');

  return video || picture;
}
