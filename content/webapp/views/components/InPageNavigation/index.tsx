import { FunctionComponent } from 'react';

import InPageNavigationSimple, {
  Props as InPageNavigationSimpleProps,
} from './InPageNavigation.Simple';
import InPageNavigationSticky, {
  Props as InPageNavigationStickyProps,
} from './InPageNavigation.Sticky';

type Props =
  | (InPageNavigationSimpleProps & { variant: 'simple' })
  | (InPageNavigationStickyProps & { variant: 'sticky' });

const InPageNavigation: FunctionComponent<Props> = props => {
  const { variant } = props;

  if (variant === 'simple') {
    return <InPageNavigationSimple {...props} />;
  }

  if (variant === 'sticky') {
    return <InPageNavigationSticky {...props} />;
  }

  throw new Error(`Unknown variant: ${variant}`);
};

export default InPageNavigation;
