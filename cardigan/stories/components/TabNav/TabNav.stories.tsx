import TabNav from '@weco/common/views/components/TabNav/TabNav';

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
