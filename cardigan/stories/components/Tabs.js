import { storiesOf } from '@storybook/react';
import Tabs from '../../../common/views/components/Tabs/Tabs';
import Readme from '../../../common/views/components/Tabs/README.md';

const TabsExample = () => {
  const tabs = [
    {
      id: 'one',
      tab: <span>Library catalogue</span>,
      tabPanel: <span>one</span>,
    },
    {
      id: 'two',
      tab: <span>Images</span>,
      tabPanel: <span>two</span>,
    },
  ];

  return <Tabs tabs={tabs} />;
};

const stories = storiesOf('Components', module);

stories.add('Tabs', TabsExample, {
  readme: { sidebar: Readme },
});
