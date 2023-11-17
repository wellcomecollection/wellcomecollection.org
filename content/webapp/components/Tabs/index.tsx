import { FunctionComponent } from 'react';
import TabsSwitch, { Props as TabsSwitchProps } from './Tabs.Switch';
import TabsNavigate, { Props as TabsNavigateProps } from './Tabs.Navigate';
import { Wrapper } from './Tabs.styles';

type Props =
  | (TabsSwitchProps & { tabBehaviour: 'switch' })
  | (TabsNavigateProps & { tabBehaviour: 'navigate' });

const Tabs: FunctionComponent<Props> = props => {
  const { tabBehaviour } = props;

  return (
    <Wrapper>
      {tabBehaviour === 'navigate' ? (
        <TabsNavigate {...props} />
      ) : (
        <TabsSwitch {...props} />
      )}
    </Wrapper>
  );
};

export default Tabs;
