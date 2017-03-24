export default function getMainMedia(arr) {
  const video = arr.find((item) => {
    return item.type === 'video';
  });
  const picture = arr.find((item) => {
    return item.type === 'picture';
  });

  if (video) {
    return video;
  } else {
    return picture;
  }
}
