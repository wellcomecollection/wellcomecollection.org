export default function getPrincipleMainMedia(arr: []) {
  const video = arr.find(item => item.type === 'video');
  const picture = arr.find(item => item.type === 'picture');

  return video || picture;
}
