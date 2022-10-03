export type Thumbnail = {
  name: string;
  width: number;
  height: number;
};

const defaultImagethumbnailSizes = [
  {
    name: '32:15',
    width: 3200,
    height: 1500,
  },
  {
    name: '16:9',
    width: 3200,
    height: 1800,
  },
  {
    name: 'square',
    width: 3200,
    height: 3200,
  },
];

export default function (label: string) {
  return {
    type: 'Image',
    config: {
      label,
      thumbnails: defaultImagethumbnailSizes,
    },
  };
}
