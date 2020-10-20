
import Image from '../Image/Image';
import CompactCard from '../CompactCard/CompactCard';
import { ImageType } from '../../../model/image';
import { MediaObjectType } from '../../../model/media-object-list';

type Props = {
  id: string,
  title: string,
  text: any,
  image: ImageType,
};

export const MediaObject = ({ id, title, text, image }: Props) => {
  const ImageComponent = image &&
    image.crops &&
    image.crops.square && <Image {...image.crops.square} />;

  return (
    <CompactCard
      url={null}
      title={title}
      Image={ImageComponent}
      partNumber={null}
      color={null}
      description={null}
      urlOverride={null}
      DateInfo={null}
      ExtraInfo={null}
      labels={{ labels: [] }}
      xOfY={{ x: undefined, y: undefined }}
    />
  );
};

const MediaObjectList = ({ items } : {items: Array<MediaObjectType>}) => {
  return items.map((mediaObject) => {
    return <MediaObject {...mediaObject}/> 
  });
};
export default MediaObjectList;