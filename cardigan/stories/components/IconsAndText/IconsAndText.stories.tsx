import IconsAndText from '@weco/content/components/IconsAndText/IconsAndText';
import Readme from '@weco/content/components/IconsAndText/README.md';
import { ReadmeDecorator } from '@weco/cardigan/config/decorators';
import { mockIcons } from '@weco/common/test/fixtures/components/icons-and-text';

const Template = args => (
  <ReadmeDecorator
    WrappedComponent={IconsAndText}
    args={args}
    Readme={Readme}
  />
);
export const basic = Template.bind({});
basic.args = {
  items: [
    {
      icons: mockIcons,
      text: 'This is some text',
    },
    {
      icons: [mockIcons[0]],
      text: 'Only one icon here',
    },
    {
      icons: mockIcons.slice(1, 3),
      text: 'A couple of icons',
    },
  ],
};
basic.storyName = 'IconsAndText';
