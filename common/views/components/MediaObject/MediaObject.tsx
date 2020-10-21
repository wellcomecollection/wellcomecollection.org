
import Image from '../Image/Image';
import CompactCard from '../CompactCard/CompactCard';
import { ImageType } from '../../../model/image';
import { MediaObjectType } from '../../../model/media-object-list';
import PrismicHtmlBlock from '../PrismicHtmlBlock/PrismicHtmlBlock';
import { HTMLString } from '@weco/common/services/prismic/types';

type Props = {
  id: string,
  title: string,
  text: HTMLString | null,
  image: ImageType,
};

export const MediaObject = ({ title, text, image }: Props) => {
  // size of image first iteration this is max set width to 80px
  const imageComponentStyles = {};
  const ImageComponent = image &&
    image.crops &&
    image.crops.square && <Image {...image.crops.square}  style={imageComponentStyles} />;
  const description = text && <PrismicHtmlBlock html={text} />
  return (
    <CompactCard
      url={null}
      title={title}
      Image={ImageComponent}
      partNumber={null}
      color={null}
      description={description}
      urlOverride={null}
      DateInfo={null}
      ExtraInfo={null}
      labels={{ labels: [] }}
      xOfY={{ x: null, y: null }}
      type={'mediaObject'}
    />
  );
};

const MediaObjectList = ({ items } : {items: Array<MediaObjectType>}) => {
  return <div className="body-text" >
    {items.map((mediaObject) => {
    return <MediaObject {...mediaObject}/> })}
    </div>
};

export default MediaObjectList;