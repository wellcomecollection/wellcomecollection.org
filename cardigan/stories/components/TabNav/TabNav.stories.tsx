import { useState } from 'react';
import TabNav from '@weco/common/views/components/TabNav/TabNav';

const Template = ({ items, ...rest }) => {
  const [selectedTab, setSelectedTab] = useState(items[0].id); //eslint-disable-line

  const itemsSelector = items.map(item => ({
    ...item,
    selected: selectedTab === item.id,
  }));

  return (
    <TabNav items={itemsSelector} {...rest} setSelectedTab={setSelectedTab} />
  );
};
export const basic = Template.bind({});
basic.args = {
  items: [
    {
      id: 'all',
      text: 'All',
    },
    {
      id: 'slightly-longer',
      text: 'Slightly longer title to test with',
    },
    {
      id: 'pictures',
      text: 'Pictures',
    },
  ],
};

basic.argTypes = {
  color: {
    type: 'select',
    options: ['', 'newPaletteYellow', 'newPaletteOrange', 'newPaletteBlue'],
  },
  setSelectedTab: {
    table: { disable: true },
  },
};

basic.storyName = 'TabNav';
