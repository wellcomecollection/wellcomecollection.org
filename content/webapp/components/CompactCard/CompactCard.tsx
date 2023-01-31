import { FunctionComponent } from 'react';
import { trackGaEvent } from '@weco/common/utils/ga';
import MediaObjectBase, {
  Props as MediaObjectBaseProps,
} from '../MediaObjectBase/MediaObjectBase';

const CompactCard: FunctionComponent<MediaObjectBaseProps> = props => (
  <MediaObjectBase
    onClick={(): void => {
      trackGaEvent({
        category: 'CompactCard',
        action: 'follow link',
        label: props.title,
      });
    }}
    {...props}
  />
);

export default CompactCard;
