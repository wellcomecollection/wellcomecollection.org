import { FunctionComponent, ReactElement } from 'react';
import { MediaObjectType } from '../../../model/media-object';
import MediaObject from '../../components/MediaObject/MediaObject';

type Props = {
  items: MediaObjectType[];
};

const MediaObjectList: FunctionComponent<Props> = ({
  items,
}: Props): ReactElement<Props> => {
  return (
    <div className="body-text">
      {items.map((mediaObject, index) => {
        return <MediaObject {...mediaObject} key={index} />;
      })}
    </div>
  );
};

export default MediaObjectList;
