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
  icons: mockIcons,
  text: 'This is some text',
};
basic.storyName = 'IconsAndText';
