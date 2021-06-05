import ButtonInline from '@weco/common/views/components/ButtonInline/ButtonInline';

const ButtonInlineTemplate = args => <ButtonInline {...args} />;
export const buttonInline = ButtonInlineTemplate.bind({});
buttonInline.args = {
  disabled: false,
  icon: 'eye',
  text: 'Click me',
  isOnDark: false,
};
buttonInline.storyName = 'ButtonInline';
