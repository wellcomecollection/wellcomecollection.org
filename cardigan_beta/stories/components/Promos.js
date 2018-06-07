import { storiesOf } from '@storybook/react';
import { doc, withReadme }  from 'storybook-readme';
import { text, boolean, select } from '@storybook/addon-knobs/react';
import { id, url, editorialSeries, eventSeries, eventSchedule, image, singleLineOfText } from '../content';
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
import BookPromoReadme from '../../../common/views/components/BookPromo/README.md';
import BookPromo from '../../../common/views/components/BookPromo/BookPromo';

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
      series={partOfSeries && editorialSeries}
      positionInSeries={partOfSeries && positionInSeries}
    />
  );
};

const EventPromoExample = () => {
  const title = text('Title', 'Tell Us the Tooth and other stories');
  const start = '2018-06-06T14:00:00+0000';
  const end = '2018-06-06T16:00:00+0000';
  const isFullyBooked = boolean('Fully booked', false);
  const hasNotFullyBookedTimes = boolean('Has more dates available', true);
  const format = {id: 'WcKmiysAACx_A8NR', title: 'Workshop', description: null};
  const schedule = boolean('Has a schedule?', false);
  const series = boolean('Is part of a series?', false);
  const britishSignLanguage = boolean('British sign language interpreted', false);
  const audioDescribed = boolean('Audio described', true);
  const speechToText = boolean('Speech-to-Text', false);
  const hearingLoop = boolean('Hearing Loop', false);
  const interpretations = [{
    interpretationType: {
      id: 'id',
      title: 'British sign language interpreted',
      description: '',
      primaryDescription: ''
    },
    isPrimary: false
  },
  {
    interpretationType: {
      id: 'id',
      title: 'Audio described',
      description: '',
      primaryDescription: ''
    },
    isPrimary: false
  },
  {
    interpretationType: {
      id: 'id',
      title: 'Speech-to-Text',
      description: '',
      primaryDescription: ''
    },
    isPrimary: true
  },
  {
    interpretationType: {
      id: 'id',
      title: 'Hearing loop',
      description: '',
      primaryDescription: ''
    },
    isPrimary: false
  }];
  const eventbriteId = null;
  const audience = boolean('Has audience?', true);
  const position = 0;
  return (
    <EventPromo
      id={id}
      title={title}
      url={url}
      start={start}
      end={end}
      isFullyBooked={isFullyBooked}
      hasNotFullyBookedTimes={hasNotFullyBookedTimes ? {startDateTime: '2018-07-31T18:00:00+0000', endDateTime: '2018-07-31T20:00:00+0000', isFullyBooked: null} : null}
      format={format}
      image={image()}
      interpretations={interpretations.filter((interpretation) => {
        return (
          interpretation.interpretationType.title === 'British sign language interpreted' && britishSignLanguage ||
          interpretation.interpretationType.title === 'Audio described' && audioDescribed ||
          interpretation.interpretationType.title === 'Speech-to-Text' && speechToText ||
          interpretation.interpretationType.title === 'Hearing loop' && hearingLoop
        );
      })}
      eventbriteId={eventbriteId}
      audience={audience ? {
        id: id,
        title: '14-19 year olds',
        description: ''
      } : null}
      schedule={schedule ?  eventSchedule : []}
      series={series ? eventSeries : []}
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

const WorkPromoExample = () => {
  const title = text('Title', 'Diogenes, sitting in front of his barrel and being offered whatever he wants by Alexander the Great, asks Alexander to step aside so that he can see the sun. Etching by S. Rosa.');
  return (
    <WorkPromo
      url={url}
      id={id}
      image={image('https://iiif.wellcomecollection.org/image/V0049964ER.jpg/full/full/0/default.jpg', 800, 1309)}
      title={title}
      datePublished={datePublished}
    />
  );
};
const BookPromoExample = () => {
  return (
    <BookPromo
      url={url}
      image={image('https://iiif.wellcomecollection.org/image/prismic:1e958377a9f21d49a5de6578212e02ad4381d473_9781781254875_0.png/full/full/0/default.png')}
      title={text('Title', singleLineOfText(2, 6))}
      subTitle={text('Sub title', singleLineOfText(3, 6))}
      description={text('Description', singleLineOfText(10, 20))}
    />
  );
};

const stories = storiesOf('Components', module);

stories
  .add('Promos', doc(PromoReadme))
  .add('Promos / Editorial promo', withReadme(EditorialPromoReadme, EditorialPromoExample))
  .add('Promos / Event promo', withReadme(EventPromoReadme, EventPromoExample))
  .add('Promos / Exhibition promo', withReadme(ExhibitionPromoReadme, ExhibitionPromoExample))
  .add('Promos / Work promo', withReadme(WorkPromoReadme, WorkPromoExample))
  .add('Promos / Book promo', withReadme(BookPromoReadme, BookPromoExample));
