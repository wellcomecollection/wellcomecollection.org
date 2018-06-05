import { storiesOf } from '@storybook/react';
import { doc, withReadme }  from 'storybook-readme';
import { text, boolean, select } from '@storybook/addon-knobs/react';
import { id, url, image, imageTall } from '../content';
import moment from 'moment';
import PromoReadme from '../../../common/views/components/Promo/README.md';
import EditorialPromoReadme from '../../../common/views/components/Promo/README-editorial.md';
import Promo from '../../../common/views/components/Promo/Promo';
import EventPromoReadme from '../../../common/views/components/EventPromo/README.md';
import EventPromo from '../../../common/views/components/EventPromo/EventPromo';
import ExhibitionPromoReadme from '../../../common/views/components/ExhibitionPromo/README.md';
import ExhibitionPromo from '../../../common/views/components/ExhibitionPromo/ExhibitionPromo';
import WorkPromoReadme from '../../../common/views/components/WorkPromo/README.md';
import WorkPromo from '../../../common/views/components/WorkPromo/WorkPromo';

const sizes = '(min-width: 1340px) calc(15vw + 120px), (min-width: 960px) calc(40vw - 84px), (min-width: 600px) calc(60vw - 83px), calc(75vw - 72px)';
const datePublished = '1685';

const EditorialPromoExample = () => {
  const title = text('Title', 'Some sort of title');
  const description = text('Description', 'A description goes here a description goes here');
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

const WorkPromoExample = () => {
  const title = text('Title', 'Diogenes, sitting in front of his barrel and being offered whatever he wants by Alexander the Great, asks Alexander to step aside so that he can see the sun. Etching by S. Rosa.');
  return (
    <WorkPromo
      url={url}
      id={id}
      image={imageTall()}
      title={title}
      datePublished={datePublished}
    />
  );
};

const EventPromoExample = () => { // TODO all possible things to display on/off
  const title = text('Title', 'Tell Us the Tooth and other stories');
  const description = text('Description', 'Join us for a workshop about storytelling with writer, storyteller and former pharmacist Navreet Chawla.');
  const start = '2018-06-06T14:00:00+0000';
  const end = '2018-06-06T16:00:00+0000';
  const isFullyBooked = false;
  const hasNotFullyBookedTimes = {startDateTime: '2018-05-31T18:00:00+0000', endDateTime: '2018-05-31T20:00:00+0000', isFullyBooked: null};
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

function statusDate(type, status) {
  const todaysDate = moment();
  switch (status) {
    case 'Coming soon':
      return (type === 'start') ? todaysDate.clone().add(3, 'days') : todaysDate.clone().add(3, 'months');
    case 'Past':
      return (type === 'start') ? todaysDate.clone().subtract(3, 'months') : todaysDate.clone().subtract(3, 'days');
    case 'Final week':
      return (type === 'start') ? todaysDate.clone().subtract(3, 'months') : todaysDate.clone().add(3, 'days');
    case 'Now on':
      return (type === 'start') ? todaysDate.clone().subtract(3, 'months') : todaysDate.clone().add(14, 'days');
  }
}

const ExhibitionPromoExample = () => {
  const permanent = boolean('Permanent', false);
  const status = select('Status', [
    'Coming soon',
    'Now on',
    'Final week',
    'Past'
  ], 'Coming soon');
  const statusOverride = text('Status override', null);
  const title = text('Title', 'Medicine Now');

  return (
    <ExhibitionPromo
      id={id}
      url={url}
      format={permanent ? {title: 'Permanent'} : null}
      image={image()}
      title={title}
      start={statusDate('start', status)}
      end={statusDate('end', status)}
      statusOverride={statusOverride}
    />
  );
};

const stories = storiesOf('Components', module);

stories
  .add('Promos', doc(PromoReadme))
  .add('Promos / Editorial promo', withReadme(EditorialPromoReadme, EditorialPromoExample))
  .add('Promos / Event promo', withReadme(EventPromoReadme, EventPromoExample))
  .add('Promos / Exhibition promo', withReadme(ExhibitionPromoReadme, ExhibitionPromoExample))
  .add('Promos / Work promo', withReadme(WorkPromoReadme, WorkPromoExample));

// LEFT TODO
// THIS PR
// .add('Book promo', withReadme(BookPromoReadme, BookPromo));
// Make text editable in Storybook for each promo

// NEXT PR
// Refactor Promo - to take chapter indicators etc as props
// Write proper READMEs
