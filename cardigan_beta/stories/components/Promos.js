import { storiesOf } from '@storybook/react';
import { text, boolean, select } from '@storybook/addon-knobs/react';
import { id, url, image, imageTall } from '../content';
import Promo from '../../../common/views/components/Promo/Promo';

const DefaultPromo = () => {
  const contentType = select('Content type', [
    'article',
    'comic',
    'audio',
    'video',
    'gallery',
    'book',
    'event',
    'work',
    'place',
    null
  ], 'article');
  const title = text('Title', 'Some sort of title');
  const description = text('Description', 'A description goes here a description goes here');
  const series = [{'name': 'Searching for Genius', 'description': [{'type': 'paragraph', 'text': 'This five-part series is great. ', 'spans': []}], 'color': 'turquoise', 'commissionedLength': 6, 'schedule': [{'title': [{'type': 'heading1', 'text': 'First heading', 'spans': []}], 'publishDate': '2018-04-18T23: 00: 00+0000'}, {'title': [{'type': 'heading1', 'text': 'Second heading', 'spans': []}], 'publishDate': '2018-04-25T23: 00: 00+0000'}, {'title': [{'type': 'heading1', 'text': 'Third heading', 'spans': []}], 'publishDate': '2018-05-02T23: 00: 00+0000'}, {'title': [{'type': 'heading1', 'text': 'Fourth heading', 'spans': []}], 'publishDate': '2018-05-09T23: 00: 00+0000'}, {'title': [{'type': 'heading1', 'text': 'Fifth heading', 'spans': []}], 'publishDate': '2018-05-16T23: 00: 00+0000'}], 'promo': [], 'wordpressSlug': null}];
  const sizes = '(min-width: 1340px) calc(15vw + 120px), (min-width: 960px) calc(40vw - 84px), (min-width: 600px) calc(60vw - 83px), calc(75vw - 72px)';
  const datePublished = '1685';
  const positionInSeries = 2;
  const partOfSeries = boolean('Is part of a series?', false);
  const standalone = boolean('Is standalone?', false);
  return (
    <Promo
      url={url}
      id={id}
      contentType={contentType || null}
      image={contentType === 'work' ? imageTall() : image()}
      headingLevel='h2'
      title={title}
      description={description}
      sizes={sizes}
      datePublished={datePublished}
      series={partOfSeries && series}
      standalone={standalone}
      positionInSeries={partOfSeries && positionInSeries}
    />
  );
};

export default DefaultPromo;

const stories = storiesOf('Components', module);

stories
  .add('Promo', DefaultPromo);
