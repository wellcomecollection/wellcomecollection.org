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
    return (
      <InPageNavigationSimple
        data-component="in-page-navigation-simple"
        {...props}
      />
    );
  }

  if (variant === 'sticky') {
    return (
      <InPageNavigationSticky
        data-component="in-page-navigation-sticky"
        {...props}
      />
    );
  }
};

export default InPageNavigation;
