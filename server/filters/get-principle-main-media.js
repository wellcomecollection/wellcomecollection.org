export default function getPrincipleMainMedia(arr) {
  const video = arr.find((item) => {
    return item.type === 'video';
  });
  const picture = arr.find((item) => {
    return item.type === 'picture';
  });

  return video || picture;
}
