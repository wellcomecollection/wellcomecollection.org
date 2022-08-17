import { useState } from 'react';
import TabNav from '@weco/common/views/components/TabNav/TabNav';

const Template = () => {
  const [selectedTab, setSelectedTab] = useState('all'); //eslint-disable-line

  const items = [
    {
      id: 'all',
      text: 'All',
      selected: selectedTab === 'all',
    },
    {
      id: 'books',
      text: 'Books',
      selected: selectedTab === 'books',
    },
    {
      id: 'pictures',
      text: 'Pictures',
      selected: selectedTab === 'pictures',
    },
  ];

  return <TabNav items={items} setSelectedTab={setSelectedTab} />;
};
export const basic = Template.bind({});

basic.storyName = 'TabNav';
