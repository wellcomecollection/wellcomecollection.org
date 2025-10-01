import { Meta, StoryObj } from '@storybook/react';
import { ComponentProps } from 'react';

import untransformedBody from '@weco/cardigan/stories/data/untransformed-body';
import { transformOnThisPage } from '@weco/content/services/prismic/transformers/pages';
import Body from '@weco/content/views/components/Body';

// Extend the story type
type BodyStoryProps = ComponentProps<typeof Body> & {
  hasIntroText: boolean;
  hasStaticContent: boolean;
};

const meta: Meta<BodyStoryProps> = {
  title: 'Components/Body',
  component: Body,
  args: {
    untransformedBody,
    introText: [
      {
        type: 'paragraph',
        text: 'Our collections are at the heart of what we do. Find out what we have by searching online or visiting our library. If you’re interested in exploring and researching our collections, we’re here to support you.',
        spans: [],
        direction: 'ltr',
      },
    ],
    hasIntroText: false,
    onThisPage: transformOnThisPage(untransformedBody),
    showOnThisPage: true,
    isDropCapped: false,
    isOfficialLandingPage: false,
    hasStaticContent: false,
    staticContent: (
      <>
        <h2>Injected static content from the codebase</h2>
        <p>Could be</p>
        <ul>
          <li>anything</li>
          <li>at</li>
          <li>all</li>
        </ul>
        <p>
          <strong>but would always be injected in this location.</strong>
        </p>
      </>
    ),
  },
  argTypes: {
    untransformedBody: {
      table: {
        disable: true,
      },
    },
    introText: {
      table: {
        disable: true,
      },
    },
    onThisPage: {
      table: {
        disable: true,
      },
    },
    pageId: {
      table: {
        disable: true,
      },
    },
    staticContent: {
      table: {
        disable: true,
      },
    },
    comicPreviousNext: {
      table: {
        disable: true,
      },
    },
    contentType: {
      name: "Content type: injects different styles based on whether it's one of these",
    },
    hasStaticContent: {
      name: 'Has static content to inject',
    },
    isOfficialLandingPage: {
      name: 'Official landing page: applies specific layout styles such as Header',
    },
    showOnThisPage: {
      name: 'Show in page navigation',
    },
    hasLandingPageFormat: {
      name: 'Displays a content list if there is one',
    },
    minWidth: {
      name: 'Minimum grid',
    },
    isDropCapped: {
      name: 'Is drop capped: apply drop cap styling',
    },
    hasIntroText: {
      name: 'Has intro text: display the intro text if there is one',
      control: {
        type: 'boolean',
      },
    },
  },
};

export default meta;

type Story = StoryObj<BodyStoryProps>;

export const Basic: Story = {
  name: 'Body',
  render: args => {
    const {
      hasIntroText,
      introText,
      hasStaticContent,
      staticContent,
      ...rest
    } = args;

    return (
      <Body
        introText={hasIntroText ? introText : undefined}
        staticContent={hasStaticContent ? staticContent : undefined}
        {...rest}
      />
    );
  },
};
