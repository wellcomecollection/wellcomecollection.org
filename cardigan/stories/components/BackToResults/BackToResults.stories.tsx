import BackToResults from '@weco/common/views/components/BackToResults/BackToResults';
import Readme from '@weco/common/views/components/BackToResults/README.md';
import { ReadmeDecorator } from '@weco/cardigan/config/decorators';

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

const Template = args => (
  <ReadmeDecorator
    WrappedComponent={BackToResults}
    args={args}
    Readme={Readme}
  />
);
export const basic = Template.bind({});
basic.args = {
  nextLink,
};
basic.storyName = 'BackToResults';
