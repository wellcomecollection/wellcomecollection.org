import TabsDefault, { Props as TabsDefaultProps } from './Tabs.Default';
import TabsLinks, { Props as TabsLinksProps } from './Tabs.Links';
import { FunctionComponent } from 'react';

type Props = TabsDefaultProps | TabsLinksProps;

const Tabs: FunctionComponent<Props> = props => {
  return props.isLinks ? <TabsLinks {...props} /> : <TabsDefault {...props} />;
};

export default Tabs;
