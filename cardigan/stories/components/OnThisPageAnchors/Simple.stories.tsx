import { Meta, StoryObj } from '@storybook/react';

import { ReadmeDecorator } from '@weco/cardigan/config/decorators';
import { links } from '@weco/cardigan/stories/components/OnThisPageAnchors/links';
import OnThisPageAnchors from '@weco/content/views/components/OnThisPageAnchors';
import Readme from '@weco/content/views/components/OnThisPageAnchors/README.mdx';

const OnThisPageAnchorsInSingleCol = () => {
  const fixedArgs = {
    isSticky: false,
    hasBackgroundBlend: false,
    links,
  };
  return (
    <div>
      <OnThisPageAnchors {...fixedArgs} />
      <div
        style={{
          padding: '16px',
          marginBottom: '16px',
        }}
      />
      {links.map(link => (
        <div
          key={link.url}
          style={{
            padding: '16px',
            backgroundColor: 'white',
            marginBottom: '16px',
          }}
        >
          <h2 id={link.url.replace('#', '')}>{link.text}</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>
        </div>
      ))}
    </div>
  );
};

const meta: Meta<typeof OnThisPageAnchorsInSingleCol> = {
  title: 'Components/OnThisPageAnchors',
  component: OnThisPageAnchorsInSingleCol,
  args: {},
};

export default meta;

type Story = StoryObj<typeof OnThisPageAnchorsInSingleCol>;

export const Basic: Story = {
  name: 'Simple',
  render: () => (
    <ReadmeDecorator
      WrappedComponent={OnThisPageAnchorsInSingleCol}
      Readme={Readme}
    />
  ),
};
