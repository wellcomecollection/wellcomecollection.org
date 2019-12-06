import { storiesOf } from '@storybook/react';
import { text } from '@storybook/addon-knobs/react';
import { url, image, singleLineOfText } from '../content';
import Readme from '../../../common/views/components/BookPromo/README.md';
import BookPromo from '../../../common/views/components/BookPromo/BookPromo';

const BookPromoExample = () => {
  return (
    <BookPromo
      url={url}
      image={image(
        'https://images.prismic.io/wellcomecollection/1e958377a9f21d49a5de6578212e02ad4381d473_9781781254875_0.png?auto=compress,format'
      )}
      title={text('Title', singleLineOfText(2, 6))}
      subtitle={text('Subtitle', singleLineOfText(3, 6))}
      description={text('Description', singleLineOfText(10, 20))}
    />
  );
};

const stories = storiesOf('Components', module);

stories.add('BookPromo', BookPromoExample, { readme: { sidebar: Readme } });
