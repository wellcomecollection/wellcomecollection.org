import FeaturedText from '@weco/common/views/components/FeaturedText/FeaturedText';

const Template = args => <FeaturedText {...args} />;
export const basic = Template.bind({});
basic.args = {
  html: [
    {
      type: 'paragraph',
      text:
        'Walk inside an innovative mobile clinic, and follow its development from the early prototypes to the first complete version.',
      spans: [],
    },
  ],
};
basic.storyName = 'FeaturedText';
