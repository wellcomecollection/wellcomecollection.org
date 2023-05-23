import LinkLabels from '@weco/common/views/components/LinkLabels/LinkLabels';
import Readme from '@weco/common/views/components/LinkLabels/README.md';
import { ReadmeDecorator } from '@weco/cardigan/config/decorators';
import { clock } from '@weco/common/icons';

const Template = args => (
  <ReadmeDecorator WrappedComponent={LinkLabels} args={args} Readme={Readme} />
);
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
basic.storyName = 'Basic LinkLabels';
basic.parameters = { chromatic: { viewports: [375, 1200] } };

export const withHeading = Template.bind({});
withHeading.args = {
  heading: 'Colours',
  items: [{ text: 'red' }, { text: 'green' }, { text: 'blue' }],
};
withHeading.storyName = 'LinkLabels with a heading';
withHeading.parameters = { chromatic: { viewports: [375, 1200] } };

export const withIcon = Template.bind({});
withIcon.args = {
  icon: clock,
  heading: 'Days',
  items: [{ text: 'Monday' }, { text: 'Tuesday' }, { text: 'Wednesday' }],
};
withIcon.storyName = 'LinkLabels with a heading and an icon';
withIcon.parameters = { chromatic: { viewports: [375, 1200] } };
