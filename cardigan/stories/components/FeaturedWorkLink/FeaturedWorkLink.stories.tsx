import { Meta, StoryObj } from '@storybook/react';
import { ComponentProps, useEffect, useState } from 'react';

import FeaturedWorkLink from '@weco/common/views/components/FeaturedWorkLink';

type Props = ComponentProps<typeof FeaturedWorkLink>;
const meta: Meta<Props & { variant: 'Under image' | 'InlineText' }> = {
  title: 'Components/FeaturedWorkLink',
  component: FeaturedWorkLink,
  args: {
    link: 'https://wellcomecollection.org/works/zsgh5y3z',
    children: 'View in catalogue',
    isUnderImage: false,
    variant: 'Under image',
  },
  argTypes: {
    link: { table: { disable: true } },
    children: { table: { disable: true } },
    isUnderImage: { table: { disable: true } },
    variant: {
      control: { type: 'select' },
      options: ['Under image', 'Inline text'],
    },
  },
};

export default meta;

const Template = (args: Props & { variant: 'Under image' | 'InlineText' }) => {
  const { variant, ...rest } = args;
  const [finalArgs, setFinalArgs] = useState({
    ...rest,
    isUnderImage: variant === 'Under image',
  });
  const children = (
    <>
      some link text{' '}
      <span className="visually-hidden">(view in catalogue)</span>
    </>
  );

  useEffect(() => {
    setFinalArgs({
      ...args,
      isUnderImage: variant === 'Under image',
      children: variant === 'InlineText' ? children : undefined,
    });
  }, [args]);

  return <FeaturedWorkLink {...finalArgs} />;
};

export const Basic: StoryObj<
  Props & { variant: 'Under image' | 'InlineText' }
> = {
  args: {
    variant: 'Under image',
  },
  name: 'FeaturedWorkLink',
  render: Template,
};
