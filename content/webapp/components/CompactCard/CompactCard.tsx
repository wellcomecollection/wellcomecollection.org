import { FunctionComponent } from 'react';
import MediaObjectBase, {
  Props as MediaObjectBaseProps,
} from '../MediaObjectBase/MediaObjectBase';

const CompactCard: FunctionComponent<MediaObjectBaseProps> = props => (
  <MediaObjectBase {...props} />
);

export default CompactCard;
