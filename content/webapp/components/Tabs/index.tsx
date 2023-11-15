import { FunctionComponent } from 'react';
import TabbableTabs, { Props as TabbableTabsProps } from './Tabs.Tab';
import AnchorTabs, { Props as AnchorTabsProps } from './Tabs.Anchor';

type Props =
  | (TabbableTabsProps & { behaviourVariant: 'tab' })
  | (AnchorTabsProps & { behaviourVariant: 'anchor' });

const Tabs: FunctionComponent<Props> = props => {
  const { behaviourVariant } = props;

  return behaviourVariant === 'anchor' ? (
    <AnchorTabs {...props} />
  ) : (
    <TabbableTabs {...props} />
  );
};

export default Tabs;
