import { eye } from '@weco/common/icons';
import { font } from '@weco/common/utils/classnames';
import Button from '@weco/common/views/components/Buttons';
import theme from '@weco/common/views/themes/default';

const ButtonSolidTemplate = args => {
  const { icon, colors, ...restOfArgs } = args;
  const getColors = colors => {
    switch (colors) {
      case 'Yellow':
        return theme.buttonColors.yellowYellowBlack;
      case 'Green border':
        return theme.buttonColors.greenTransparentGreen;
      case 'White':
        return theme.buttonColors.whiteWhiteCharcoal;
      case 'White border':
        return theme.buttonColors.whiteTransparentWhite;
      case 'Default':
      default:
        return theme.buttonColors.default;
    }
  };

  return (
    <div
      style={{
        padding: '20px',
        backgroundColor: colors.includes('White')
          ? theme.color('black')
          : undefined,
      }}
    >
      <Button
        text="Click me"
        ariaLabel="Cardigan button example"
        icon={icon ? eye : undefined}
        colors={getColors(colors)}
        link={args.variant === 'ButtonSolidLink' ? '#' : undefined}
        clickHandler={e => {
          e.preventDefault();
          window.alert(
            `oh hello, i'm a ${
              args.variant === 'ButtonSolidLink' ? 'link' : 'button'
            }`
          );
        }}
        {...restOfArgs}
      />
    </div>
  );
};
export const buttonSolid = ButtonSolidTemplate.bind({});
buttonSolid.args = {
  variant: 'ButtonSolid',
  colors: 'default',
  size: 'medium',
  icon: true,
  isIconAfter: false,
  isTextHidden: false,
  disabled: false,
};
buttonSolid.argTypes = {
  variant: {
    options: ['ButtonSolid', 'ButtonSolidLink'],
    control: { type: 'radio' },
  },
  colors: {
    options: ['Default', 'Green border', 'Yellow', 'White', 'White border'],
    control: 'select',
  },
  size: {
    options: ['small', 'medium'],
    control: { type: 'radio' },
  },
  icon: { control: 'boolean' },
  isIconAfter: { control: 'boolean' },
  isTextHidden: { control: 'boolean' },
  disabled: { control: 'boolean' },
};
buttonSolid.storyName = 'ButtonSolid';

const DropdownButtonTemplate = args => (
  <div
    className={font('intr', 6)}
    style={{
      padding: '20px',
      backgroundColor: args.isOnDark ? theme.color('black') : undefined,
    }}
  >
    <Button
      variant="DropdownButton"
      id="123"
      label="Dropdown"
      ariaLabel="Cardigan button example"
      {...args}
    >
      <span>Sign in to your library account</span>
    </Button>
  </div>
);

export const dropdownButton = DropdownButtonTemplate.bind({});
dropdownButton.args = {
  isOnDark: false,
  hasNoOptions: false, // disabled?
};
dropdownButton.argTypes = {
  isOnDark: { control: 'boolean' },
  hasNoOptions: { control: 'boolean' },
};
dropdownButton.storyName = 'DropdownButton';
