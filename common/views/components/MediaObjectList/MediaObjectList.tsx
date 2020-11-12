import { MediaObjectType } from '../../../model/media-object';
import MediaObject from '../../components/MediaObject/MediaObject';

const MediaObjectList = ({
  items,
}: {
  items: MediaObjectType[];
}): JSX.Element => {
  return (
    <div className="body-text">
      {items.map((mediaObject, index) => {
        return <MediaObject {...mediaObject} key={index} />;
      })}
    </div>
  );
};

export default MediaObjectList;
