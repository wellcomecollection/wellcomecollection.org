import LinkLabels from '@weco/common/views/components/LinkLabels/LinkLabels';

const Template = args => <LinkLabels {...args} />;
export const basic = Template.bind({});
basic.args = {
  items: [
    {
      url: 'https://twitter.com/mafunyane',
      text: '@mafunyane',
    },
    {
      url: 'https://strategiccontent.co.uk/',
      text: 'strategiccontent.co.uk',
    },
  ],
};
basic.storyName = 'LinkLabels';
