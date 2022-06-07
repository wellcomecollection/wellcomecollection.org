import { FunctionComponent, ReactElement } from 'react';
import MediaObject, {
  Props as MediaObjectProps,
} from '../MediaObject/MediaObject';

export type Props = {
  items: MediaObjectProps[];
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
