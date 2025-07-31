import { FunctionComponent } from 'react';

import TabsNavigate, { Props as TabsNavigateProps } from './Tabs.Navigate';
import { Wrapper } from './Tabs.styles';
import TabsSwitch, { Props as TabsSwitchProps } from './Tabs.Switch';

type Props =
  | (TabsSwitchProps & { tabBehaviour: 'switch' })
  | (TabsNavigateProps & { tabBehaviour: 'navigate' });

const Tabs: FunctionComponent<Props> = props => {
  const { tabBehaviour } = props;

  return (
    <Wrapper data-component="tabs">
      {tabBehaviour === 'navigate' ? (
        <TabsNavigate {...props} />
      ) : (
        <TabsSwitch {...props} />
      )}
    </Wrapper>
  );
};

export default Tabs;
