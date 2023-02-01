import LinkLabels from '@weco/common/views/components/LinkLabels/LinkLabels';
import Readme from '@weco/common/views/components/LinkLabels/README.md';
import { ReadmeDecorator } from '@weco/cardigan/config/decorators';

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
basic.storyName = 'LinkLabels';
