import { useState } from 'react';
import TabNav from '@weco/common/views/components/TabNav/TabNav';
import TabNavV2 from '@weco/common/views/components/TabNav/TabNavV2';

const Template = args => <TabNav {...args} />;
export const basic = Template.bind({});
basic.args = {
  items: [
    {
      text: 'All',
      link: {
        href: {
          pathname: '',
        },
      },
      selected: true,
    },
    {
      text: 'Books',
      link: {
        href: {
          pathname: '',
        },
      },

      selected: false,
    },
    {
      text: 'Pictures',
      link: {
        href: {
          pathname: '',
        },
      },

      selected: false,
    },
  ],
};
basic.storyName = 'TabNav';

const TemplateV2 = ({ items, ...rest }) => {
  const [selectedTab, setSelectedTab] = useState(items[0].id); //eslint-disable-line

  const itemsSelector = items.map(item => ({
    ...item,
    selected: selectedTab === item.id,
  }));

  return (
    <TabNavV2 items={itemsSelector} {...rest} setSelectedTab={setSelectedTab} />
  );
};
export const basicV2 = TemplateV2.bind({});
basicV2.args = {
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

basicV2.argTypes = {
  color: {
    type: 'select',
    options: ['', 'newPaletteYellow', 'newPaletteOrange', 'newPaletteBlue'],
  },
  setSelectedTab: {
    table: { disable: true },
  },
};

basicV2.storyName = 'TabNavV2';
