import ButtonInline from '@weco/common/views/components/ButtonInline/ButtonInline';
import ButtonOutlined from '@weco/common/views/components/ButtonOutlined/ButtonOutlined';

const ButtonInlineTemplate = args => <ButtonInline {...args} />;
export const buttonInline = ButtonInlineTemplate.bind({});
buttonInline.args = {
  disabled: false,
  text: 'Click me',
  isOnDark: false,
};
buttonInline.storyName = 'ButtonInline';

const ButtonOutlinedTemplate = args => <ButtonOutlined {...args} />;
export const buttonOutlined = ButtonOutlinedTemplate.bind({});
buttonOutlined.args = {
  disabled: false,
  icon: 'eye',
  text: 'Click me',
  isOnDark: false,
};
buttonOutlined.storyName = 'ButtonOutlined';
