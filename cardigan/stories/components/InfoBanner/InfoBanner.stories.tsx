import InfoBanner from '@weco/common/views/components/InfoBanner/InfoBanner';

const Template = args => <InfoBanner {...args} />;
export const basic = Template.bind({});
basic.args = {
  document: {
    data: {
      text: [
        {
          type: 'paragraph',
          text: `Coming from Wellcome Images? All freely available images have now been moved to the Wellcome Collection website. Here we're working to improve data quality, search relevance and tools to help you use these images more easily`,
          spans: [],
        },
      ],
    },
  },
};
basic.storyName = 'InfoBanner';
