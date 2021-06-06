import BackToResults from '@weco/common/views/components/BackToResults/BackToResults';

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

const Template = args => <BackToResults {...args} />;
export const basic = Template.bind({});
basic.args = {
  nextLink,
};
basic.storyName = 'BackToResults';
