import { storiesOf } from '@storybook/react';
import { doc, withReadme }  from 'storybook-readme';
import { text, boolean, select } from '@storybook/addon-knobs/react';
import { id, url, image, imageTall } from '../content';
import PromoReadme from '../../../common/views/components/Promo/README.md';
import EditorialPromoReadme from '../../../common/views/components/Promo/README-editorial.md';
import WorkPromoReadme from '../../../common/views/components/Promo/README-work.md';
import Promo from '../../../common/views/components/Promo/Promo';
import EventPromoReadme from '../../../common/views/components/EventPromo/README.md';
import EventPromo from '../../../common/views/components/EventPromo/EventPromo';

const title = text('Title', 'Some sort of title');
const description = text('Description', 'A description goes here a description goes here');
const sizes = '(min-width: 1340px) calc(15vw + 120px), (min-width: 960px) calc(40vw - 84px), (min-width: 600px) calc(60vw - 83px), calc(75vw - 72px)';
const datePublished = '1685';

const EditorialPromo = () => {
  const contentType = select('Content type', [
    'article',
    'comic',
    'audio',
    'video',
    'gallery',
    'place',
    null
  ], 'article');
  const series = [{'name': 'Searching for Genius', 'description': [{'type': 'paragraph', 'text': 'This five-part series is great. ', 'spans': []}], 'color': 'turquoise', 'commissionedLength': 6, 'schedule': [{'title': [{'type': 'heading1', 'text': 'First heading', 'spans': []}], 'publishDate': '2018-04-18T23: 00: 00+0000'}, {'title': [{'type': 'heading1', 'text': 'Second heading', 'spans': []}], 'publishDate': '2018-04-25T23: 00: 00+0000'}, {'title': [{'type': 'heading1', 'text': 'Third heading', 'spans': []}], 'publishDate': '2018-05-02T23: 00: 00+0000'}, {'title': [{'type': 'heading1', 'text': 'Fourth heading', 'spans': []}], 'publishDate': '2018-05-09T23: 00: 00+0000'}, {'title': [{'type': 'heading1', 'text': 'Fifth heading', 'spans': []}], 'publishDate': '2018-05-16T23: 00: 00+0000'}], 'promo': [], 'wordpressSlug': null}];
  const positionInSeries = 2;
  const partOfSeries = boolean('Is part of a series?', false);
  return (
    <Promo
      url={url}
      id={id}
      contentType={contentType || null}
      image={image()}
      headingLevel='h2'
      title={title}
      description={description}
      sizes={sizes}
      datePublished={datePublished}
      series={partOfSeries && series}
      positionInSeries={partOfSeries && positionInSeries}
    />
  );
};

const WorkPromo = () => {
  return (
    <Promo
      url={url}
      id={id}
      contentType='work'
      image={imageTall()}
      headingLevel='h2'
      title={title}
      description={description}
      sizes={sizes}
      datePublished={datePublished}
    />
  );
};

const EventPromoExample = () => {
  const title = 'Tell Us the Tooth and other stories';
  const start = '2018-06-06T14:00:00+0000';
  const end = '2018-06-06T16:00:00+0000';
  const isFullyBooked = false;
  const hasNotFullyBookedTimes = {startDateTime: '2018-05-31T18:00:00+0000', endDateTime: '2018-05-31T20:00:00+0000', isFullyBooked: null};
  const description = 'Join us for a workshop about storytelling with writer, storyteller and former pharmacist Navreet Chawla.';
  const format = {id: 'WcKmiysAACx_A8NR', title: 'Workshop', description: null};
  const bookingType = null;
  const interpretations = [];
  const eventbriteId = null;
  const dateString = null;
  const timeString = null;
  const audience = null;
  const schedule = [];
  const series = [];
  const position = 0;
  return (
    <EventPromo
      id={id}
      title={title}
      url={url}
      start={start}
      end={end}
      isFullyBooked={isFullyBooked}
      hasNotFullyBookedTimes={hasNotFullyBookedTimes}
      description={description}
      format={format}
      bookingType={bookingType}
      image={image()}
      interpretations={interpretations}
      eventbriteId={eventbriteId}
      dateString={dateString}
      timeString={timeString}
      audience={audience}
      schedule={schedule}
      series={series}
      position={position}
    />
  );
};

const stories = storiesOf('Components', module);

stories
  .add('Promos', doc(PromoReadme))
  .add('Promos/Editorial promo', withReadme(EditorialPromoReadme, EditorialPromo))
  .add('Promos/Event promo', withReadme(EventPromoReadme, EventPromoExample))
// .add('Exhibition promo', withReadme(PromoReadme, EditorialPromo))
  .add('Promos/Work promo', withReadme(WorkPromoReadme, WorkPromo));
// .add('Book promo', withReadme(PromoReadme, EditorialPromo));
