import { FunctionComponent } from 'react';
import TabsSwitch, { Props as TabsSwitchProps } from './Tabs.Switch';
import TabsNavigate, { Props as TabsNavigateProps } from './Tabs.Navigate';

type Props =
  | (TabsSwitchProps & { tabBehaviour: 'switch' })
  | (TabsNavigateProps & { tabBehaviour: 'navigate' });

const Tabs: FunctionComponent<Props> = props => {
  const { tabBehaviour } = props;

  return tabBehaviour === 'navigate' ? (
    <TabsNavigate {...props} />
  ) : (
    <TabsSwitch {...props} />
  );
};

export default Tabs;
