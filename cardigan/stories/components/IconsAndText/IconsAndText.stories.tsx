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

const BackToBackIconsAndText = args => (
  <>
    <IconsAndText {...args.one} />
    <IconsAndText {...args.two} />
  </>
);

const BackToBackTemplate = args => (
  <ReadmeDecorator
    WrappedComponent={BackToBackIconsAndText}
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

export const backToBack = BackToBackTemplate.bind({});
backToBack.args = {
  one: {
    icons: mockIcons,
    text: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Animi consectetur voluptatibus natus maxime voluptatem, optio, dolor, architecto dolore ipsa repudiandae perferendis at doloribus recusandae. Unde pariatur omnis tempora at eius?',
  },
  two: {
    icons: mockIcons.slice(2, 5),
    text: 'Animi consectetur voluptatibus natus maxime voluptatem, optio, dolor, architecto dolore ipsa repudiandae perferendis at doloribus recusandae. Unde pariatur omnis',
  },
};
backToBack.storyName = 'backToBack';
