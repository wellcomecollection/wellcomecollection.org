import { Meta, StoryObj } from '@storybook/react';

import { KioskProvider } from '@weco/common/contexts/KioskContext';
import { ServerDataContext } from '@weco/common/server-data/Context';
import { defaultServerData } from '@weco/common/server-data/types';
import KioskNavigation from '@weco/content/views/components/KioskNavigation';

type KioskNavigationProps = React.ComponentProps<typeof KioskNavigation>;
type StoryArgs = KioskNavigationProps & {
  kioskMode: string | null;
};

const meta: Meta<StoryArgs> = {
  title: 'Components/KioskNavigation',
  component: KioskNavigation,
  args: {
    pageId: 'eudv2vbg', // AZT on trial - first work in tenderness-and-rage
    pageType: 'work',
  },
  argTypes: {
    pageId: {
      table: { disable: true },
    },
    pageType: {
      table: { disable: true },
    },
    kioskMode: {
      name: 'Kiosk Mode',
      control: 'select',
      options: [null, 'RR-iPad1', 'TR-iPad1'],
      description:
        'Select which kiosk mode to simulate. This will determine which content list is used for navigation.',
    },
  },
  decorators: [
    (Story, context) => (
      <ServerDataContext.Provider
        value={{
          ...defaultServerData,
          toggles: {
            ...defaultServerData.toggles,
            modes: {
              kioskMode: context.args.kioskMode,
            },
          },
        }}
      >
        <KioskProvider
          cookieContent={context.args.kioskMode}
          readingRoomStories={{}}
        >
          <Story />
        </KioskProvider>
      </ServerDataContext.Provider>
    ),
  ],
};

export default meta;

type Story = StoryObj<StoryArgs>;

export const Basic: Story = {
  name: 'KioskNavigation',
  args: {
    kioskMode: 'TR-iPad1',
    pageId: 'eudv2vbg',
    pageType: 'work',
  },
};
