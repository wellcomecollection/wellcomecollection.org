import { Meta, StoryObj } from '@storybook/react';
import styled, { css } from 'styled-components';

import { eye } from '@weco/common/icons';
import { typography } from '@weco/common/utils/classnames';
import Button, {
  ButtonHierarchy,
  ButtonProps,
} from '@weco/common/views/components/Buttons';
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

const Wrapper = styled.div<{ $isOnDark: boolean }>`
  padding: 20px;

  ${props =>
    props.$isOnDark &&
    css`
      background-color: ${props.theme.color('black')};
    `}
`;

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
  parameters: {
    docs: {
      description: {
        story:
          'With the brandUpdate toolbar toggle on, `hierarchy` and `isOnDark` set the brand colours. Without them, the preset picked in Colors decides.',
      },
    },
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
    hierarchy: {
      options: [undefined, 'primary', 'secondary', 'tertiary'],
      control: { type: 'radio' },
      name: 'Hierarchy (brand)',
    },
    isOnDark: { control: 'boolean', name: 'Is on dark background (brand)' },
  },
  render: args => {
    const { showIcon, storyColors, variant, ...restOfArgs } = args;
    return (
      <Wrapper $isOnDark={!!storyColors?.includes('White') || !!args.isOnDark}>
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
      </Wrapper>
    );
  },
};

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 16px;
`;

const hierarchies: ButtonHierarchy[] = ['primary', 'secondary', 'tertiary'];

export const Hierarchy: Story = {
  name: 'Hierarchy (brand)',
  parameters: {
    docs: {
      description: {
        story:
          'Primary, secondary and tertiary buttons on light and dark backgrounds. Turn the brandUpdate toolbar toggle on to see them; with it off every button uses the default preset.',
      },
    },
  },
  render: () => (
    <>
      {[false, true].map(isOnDark => (
        <Wrapper key={String(isOnDark)} $isOnDark={isOnDark}>
          {hierarchies.map(hierarchy => (
            <Row key={hierarchy}>
              <Button
                variant="ButtonSolid"
                text={hierarchy}
                hierarchy={hierarchy}
                isOnDark={isOnDark}
              />
              <Button
                variant="ButtonSolid"
                text="Disabled"
                hierarchy={hierarchy}
                isOnDark={isOnDark}
                disabled
              />
              <Button
                variant="ButtonSolidLink"
                text="Link"
                link="#"
                icon={eye}
                hierarchy={hierarchy}
                isOnDark={isOnDark}
              />
            </Row>
          ))}
        </Wrapper>
      ))}
    </>
  ),
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
    <Wrapper
      className={typography('body', 'sm', 'regular')}
      $isOnDark={args.isOnDark}
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
    </Wrapper>
  ),
};
