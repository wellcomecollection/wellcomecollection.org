import DescriptionList from '@weco/common/views/components/DescriptionList/DescriptionList';

const Template = args => <DescriptionList {...args} />;
export const basic = Template.bind({});
basic.args = {
  title: 'Vol 3.',
  items: [
    {
      term: 'Location/shelfmark',
      description: 'Closed stores EPB/B/14982',
    },
    {
      term: 'Status',
      description: 'Temporarily unavailable',
    },
    {
      term: 'Access',
      description: 'Closed stores',
    },
    {
      term: 'Access conditions',
      description:
        'Item is in use by another reader. Please ask at the enquiry desk',
    },
  ],
};
basic.storyName = 'DescriptionList';
