export default function getPrincipleMainMedia(arr: []) {
  const video = arr.find(item => item.type === 'video');
  const mainPicture = arr.find(item => item.isMain);
  const picture = arr.find(item => item.type === 'picture');

  return video || mainPicture || picture;
}
