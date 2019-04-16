import { storiesOf } from '@storybook/react';
import ImagePlaceholder from '../../../common/views/components/ImagePlaceholder/ImagePlaceholder';
import Readme from '../../../common/views/components/ImagePlaceholder/README.md';
import { select } from '@storybook/addon-knobs/react';

const ImagePlaceholderExample = () => {
  return (
    <ImagePlaceholder
      color={select(
        'Colour',
        ['turquoise', 'red', 'green', 'purple'],
        'turquoise'
      )}
    />
  );
};

const stories = storiesOf('Components', module);
stories.add('ImagePlaceholder', ImagePlaceholderExample, {
  info: Readme,
});
