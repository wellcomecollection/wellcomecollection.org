import { storiesOf } from '@storybook/react';
import Readme from '../../../common/views/components/MediaObject/README.md';
import { MediaObject } from '../../../common/views/components/MediaObject/MediaObject';
import { mockData } from '../../../common/test/fixtures/components/media-object';
import { mockImage } from '../../../common/test/fixtures/components/compact-card';

const MediaObjectExample = () => (
  <MediaObject title={mockData.title} text={mockData.text} image={mockImage} />
);
const stories = storiesOf('Components', module);
stories.add('MediaObject', MediaObjectExample, { readme: { sidebar: Readme } });
