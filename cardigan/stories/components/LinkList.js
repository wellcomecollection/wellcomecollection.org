import { storiesOf } from '@storybook/react';
import LinkList from '../../../common/views/components/LinkList/LinkList';
import Readme from '../../../common/views/components/LinkList/README.md';

const stories = storiesOf('Components', module);
stories.add(
  'LinkList',
  () => (
    <LinkList
      heading="Listen or subscribe on"
      links={[
        { url: '/', text: 'Soundcloud' },
        { url: '/', text: 'Google Podcasts' },
        { url: '/', text: 'Spotify' },
        { url: '/', text: 'Apple Podcasts' },
        { url: '/', text: 'Player FM' },
        { url: '/', text: 'Pocket Casts' },
        { url: '/', text: 'Podbean' },
        { url: '/', text: 'Radio Public' },
        { url: '/', text: 'Player FM' },
        { url: '/', text: 'Libsyn' },
        { url: '/', text: 'RSS' },
      ]}
    />
  ),
  { readme: { sidebar: Readme } }
);
