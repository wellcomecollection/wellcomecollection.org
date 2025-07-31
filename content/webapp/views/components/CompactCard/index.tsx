import { FunctionComponent } from 'react';

import MediaObjectBase, {
  Props as MediaObjectBaseProps,
} from './CompactCard.MediaObjectBase';

// TODO why is this a separate component..???
const CompactCard: FunctionComponent<MediaObjectBaseProps> = props => (
  <MediaObjectBase {...props} data-component="compact-card" />
);

export default CompactCard;
