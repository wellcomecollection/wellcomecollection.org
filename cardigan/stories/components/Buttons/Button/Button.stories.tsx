import { Meta, StoryObj } from '@storybook/react';

import { eye } from '@weco/common/icons';
import { font } from '@weco/common/utils/classnames';
import Button, { ButtonProps } from '@weco/common/views/components/Buttons';
import theme from '@weco/common/views/themes/default';

function getColor(color) {
  switch (color) {
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
}

const meta: Meta<typeof Button> = {
  title: 'Components/Buttons/Basics/Button',
  component: Button,
};

export default meta;

type StoryProps = {
  showIcon: boolean;
  storyColors: 'Default' | 'Green border' | 'Yellow' | 'White' | 'White border';
};

type Story = StoryObj<ButtonProps & StoryProps>;

export const Basic: Story = {
  name: 'Solid',
  args: {
    variant: 'ButtonSolid',
    size: 'medium',
    isIconAfter: false,
    isTextHidden: false,
    disabled: false,
    storyColors: 'Default',
    showIcon: true,
  },
  argTypes: {
    variant: {
      options: ['ButtonSolid', 'ButtonSolidLink'],
      control: { type: 'radio' },
      name: 'Variant',
    },
    size: {
      options: ['small', 'medium'],
      control: { type: 'radio' },
      name: 'Size',
    },
    isIconAfter: { control: 'boolean', name: 'Icon after text' },
    isTextHidden: { control: 'boolean', name: 'Text hidden' },
    disabled: { control: 'boolean', name: 'Disabled' },
    showIcon: { control: 'boolean', name: 'Show icon' },
    storyColors: {
      options: ['Default', 'Green border', 'Yellow', 'White', 'White border'],
      control: 'select',
      name: 'Colors',
    },
  },
  render: args => {
    const { showIcon, storyColors, variant, ...restOfArgs } = args;
    return (
      <div
        style={{
          padding: '20px',
          backgroundColor: storyColors.includes('White')
            ? theme.color('black')
            : undefined,
        }}
      >
        <Button
          text="Click me"
          ariaLabel="Cardigan button example"
          icon={showIcon ? eye : undefined}
          colors={getColor(storyColors)}
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
  },
};

export const DropdownButton: Story = {
  name: 'Dropdown',
  args: {
    isOnDark: false,
    hasNoOptions: false,
    isTight: false,
  },
  argTypes: {
    isOnDark: { control: 'boolean', name: 'Is on dark background' },
    hasNoOptions: { control: 'boolean', name: 'Has no options' },
    isTight: { control: 'boolean', name: 'Has a tighter dropdown menu' },
  },
  render: args => (
    <div
      className={font('sans', -2)}
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
  ),
};
