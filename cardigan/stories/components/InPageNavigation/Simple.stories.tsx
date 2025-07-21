import { Meta, StoryObj } from '@storybook/react';

import { ReadmeDecorator } from '@weco/cardigan/config/decorators';
import { links } from '@weco/cardigan/stories/components/InPageNavigation/links';
import InPageNavigation from '@weco/content/views/components/InPageNavigation';
import Readme from '@weco/content/views/components/InPageNavigation/README.mdx';

const InPageNavigationInSingleCol = () => {
  const fixedArgs = {
    links,
  };
  return (
    <div>
      <InPageNavigation {...fixedArgs} variant="simple" />
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

const meta: Meta<typeof InPageNavigationInSingleCol> = {
  title: 'Components/InPageNavigation',
  component: InPageNavigationInSingleCol,
  args: {},
};

export default meta;

type Story = StoryObj<typeof InPageNavigationInSingleCol>;

export const Basic: Story = {
  name: 'Simple',
  render: () => (
    <ReadmeDecorator
      WrappedComponent={InPageNavigationInSingleCol}
      Readme={Readme}
    />
  ),
};
