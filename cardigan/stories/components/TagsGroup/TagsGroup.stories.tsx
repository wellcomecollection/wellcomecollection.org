import TagsGroup from '@weco/content/components/TagsGroup/TagsGroup';

const Template = args => <TagsGroup {...args} />;
export const basic = Template.bind({});
basic.args = {
  title: 'Listen or subscribe on',
  tags: [
    {
      textParts: ['Soundcloud'],
      linkAttributes: {
        href: { pathname: '/', query: '' },
        as: { pathname: '/', query: '' },
      },
    },
    {
      textParts: ['Google Podcasts'],
      linkAttributes: {
        href: { pathname: '/', query: '' },
        as: { pathname: '/', query: '' },
      },
    },
    {
      textParts: ['Spotify'],
      linkAttributes: {
        href: { pathname: '/', query: '' },
        as: { pathname: '/', query: '' },
      },
    },
    {
      textParts: ['Apple'],
      linkAttributes: {
        href: { pathname: '/', query: '' },
        as: { pathname: '/', query: '' },
      },
    },
    {
      textParts: ['Player'],
      linkAttributes: {
        href: { pathname: '/', query: '' },
        as: { pathname: '/', query: '' },
      },
    },
  ],
};
basic.storyName = 'TagsGroup';
