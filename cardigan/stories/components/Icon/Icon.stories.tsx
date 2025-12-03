import { Meta, StoryObj } from '@storybook/react';
import { themeColors } from '@weco/cardigan/.storybook/preview';
import { ComponentProps, useEffect, useState } from 'react';

import * as Icons from '@weco/common/icons';
import { font } from '@weco/common/utils/classnames';
import Icon from '@weco/common/views/components/Icon';

type StoryProps = Omit<ComponentProps<typeof Icon>, 'icon'> & {
  icon: string;
};

const meta: Meta<StoryProps> = {
  title: 'Components/Icon',
  component: Icon,
  args: {
    icon: 'a11YVisual',
    rotate: 0,
    iconColor: 'black',
    matchText: false,
  },
  argTypes: {
    icon: { control: { type: 'select' }, options: Object.keys(Icons) },
    rotate: { control: 'number', name: 'Rotation (degrees)' },
    iconColor: {
      control: { type: 'select' },
      options: themeColors.map(c => c.name),
      name: 'Icon color',
    },
    matchText: { control: 'boolean', name: 'Match surrounding text size' },
    title: { table: { disable: true } },
    attrs: { table: { disable: true } },
    sizeOverride: { table: { disable: true } },
  },
};

export default meta;

type Story = StoryObj<StoryProps>;

const Template = args => {
  const { icon } = args;
  const [currentIcon, setCurrentIcon] = useState(icon);

  useEffect(() => {
    setCurrentIcon(icon);
  }, [icon]);

  return (
    <>
      {args.matchText ? (
        <span className={font('intr', 1)}>
          <Icon {...args} icon={Icons[currentIcon]} />
          <span style={{ marginLeft: '5px' }}>Some text</span>
        </span>
      ) : (
        <div style={{ maxWidth: '50px' }}>
          <Icon {...args} icon={Icons[currentIcon]} />
        </div>
      )}
    </>
  );
};

export const Basic: Story = {
  name: 'Icon',
  render: Template,
};
