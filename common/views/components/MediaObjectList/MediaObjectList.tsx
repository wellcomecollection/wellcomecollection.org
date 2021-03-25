import { FunctionComponent, ReactElement } from 'react';
import MediaObject, {
  Props as MediaObjectProps,
} from '../../components/MediaObject/MediaObject';

type Props = {
  items: MediaObjectProps[];
};

const MediaObjectList: FunctionComponent<Props> = ({
  items,
}: Props): ReactElement<Props> => {
  return (
    <div className="body-text">
      {items.map((mediaObject, index) => {
        return (
          <MediaObject
            {...mediaObject}
            key={index}
            sizesQueries="(min-width: 1400px) 109px, (min-width: 960px) calc(10vw - 29px), (min-width: 600px) calc(13.82vw - 32px), calc(16.79vw - 21px)"
          />
        );
      })}
    </div>
  );
};

export default MediaObjectList;
