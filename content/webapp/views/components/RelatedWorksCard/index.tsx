import { FunctionComponent } from 'react';

import RelatedWorksCardDefault, {
  Props as BaseProps,
} from './RelatedWorksCard.Default';
import RelatedWorksCardHover from './RelatedWorksCard.Hover';

type Props = BaseProps & {
  variant: 'default' | 'hover';
};

const RelatedWorksCard: FunctionComponent<Props> = props => {
  const { variant } = props;

  if (variant === 'default') {
    return <RelatedWorksCardDefault {...props} />;
  }

  if (variant === 'hover') {
    return <RelatedWorksCardHover {...props} />;
  }
};

export default RelatedWorksCard;
