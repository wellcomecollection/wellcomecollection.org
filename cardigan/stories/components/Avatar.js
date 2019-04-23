import { storiesOf } from '@storybook/react';
import Avatar from '../../../common/views/components/Avatar/Avatar';
import Readme from '../../../common/views/components/Avatar/README.md';
import { person } from '../content';

const stories = storiesOf('Components', module);

const AvatarExample = () => {
  const imageProps = {
    width: 78,
    height: 78,
    contentUrl: person().image.contentUrl,
    alt: `Photograph of ${person().name}`,
  };

  return <Avatar imageProps={imageProps} />;
};

stories.add('Avatar', AvatarExample, {
  info: Readme,
});
