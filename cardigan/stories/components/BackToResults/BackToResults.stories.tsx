import type { Meta, StoryObj } from '@storybook/react';

import { ReadmeDecorator } from '@weco/cardigan/config/decorators';
import SearchContext from '@weco/common/contexts/SearchContext';
import BackToResults from '@weco/content/components/BackToResults';
import Readme from '@weco/content/components/BackToResults/README.mdx';

const nextLink = {
  href: {
    pathname: '/search/works',
    query: {
      query: 'sun',
      page: 2,
    },
  },
  as: {
    pathname: '/search/works',
    query: {
      query: 'sun',
      page: 2,
    },
  },
};

const meta: Meta<typeof BackToResults> = {
  title: 'Components/BackToResults',
  component: BackToResults,
};

export default meta;

type Story = StoryObj<typeof BackToResults>;

const WrappedBackToResults = () => (
  <SearchContext.Provider
    value={{
      link: nextLink,
      setLink: () => {
        /* */
      },
      extraApiToolbarLinks: [],
      setExtraApiToolbarLinks: () => {
        /* */
      },
    }}
  >
    <BackToResults />
  </SearchContext.Provider>
);

export const Basic: Story = {
  name: 'BackToResults',
  render: args => (
    <ReadmeDecorator
      WrappedComponent={WrappedBackToResults}
      args={args}
      Readme={Readme}
    />
  ),
};
