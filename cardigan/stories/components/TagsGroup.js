import { storiesOf } from '@storybook/react';
import TagsGroup from '../../../common/views/components/TagsGroup/TagsGroup';
import Readme from '../../../common/views/components/TagsGroup/README.md';

const stories = storiesOf('Components', module);
stories.add(
  'TagsGroup',
  () => (
    <TagsGroup
      title="Listen or subscribe on"
      tags={[
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
      ]}
    />
  ),
  { readme: { sidebar: Readme } }
);
