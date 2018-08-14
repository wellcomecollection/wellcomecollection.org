import { storiesOf } from '@storybook/react';
import { text } from '@storybook/addon-knobs/react';
import { url, image, singleLineOfText } from '../content';
import BookPromoReadme from '../../../common/views/components/BookPromo/README.md';
import BookPromo from '../../../common/views/components/BookPromo/BookPromo';

const BookPromoExample = () => {
  return (
    <BookPromo
      url={url}
      image={image('https://iiif.wellcomecollection.org/image/prismic:1e958377a9f21d49a5de6578212e02ad4381d473_9781781254875_0.png/full/full/0/default.png')}
      title={text('Title', singleLineOfText(2, 6))}
      subtitle={text('Subtitle', singleLineOfText(3, 6))}
      description={text('Description', singleLineOfText(10, 20))}
    />
  );
};

const stories = storiesOf('Components (WIP)/Promos', module);

stories
  .add('Book promo', BookPromoExample, {info: BookPromoReadme});
