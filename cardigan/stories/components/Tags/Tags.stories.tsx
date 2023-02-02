import Tags from '@weco/common/views/components/Tags/Tags';
import Readme from '@weco/common/views/components/Tags/README.md';
import { ReadmeDecorator } from '@weco/cardigan/config/decorators';

const nextLink = {
  href: {
    pathname: '/works',
    query: {
      query: 'sun',
      page: 2,
    },
  },
  as: {
    pathname: '/works',
    query: {
      query: 'sun',
      page: 2,
    },
  },
};

const Template = args => (
  <ReadmeDecorator WrappedComponent={Tags} args={args} Readme={Readme} />
);
export const basic = Template.bind({});
basic.args = {
  isFirstPartBold: false,
  tags: [
    {
      textParts: ['Medical illustration'],
      linkAttributes: nextLink,
    },
    {
      textParts: ['Dentistry', 'History'],
      linkAttributes: nextLink,
    },
    {
      textParts: ['Teeth', 'Care and hygiene', 'History', 'Pictorial works'],
      linkAttributes: nextLink,
    },
  ],
};
basic.storyName = 'Tags';
