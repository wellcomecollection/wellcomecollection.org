import { storiesOf } from '@storybook/react';
import { text, boolean, select } from '@storybook/addon-knobs/react';
import { id, url, editorialSeries, eventSeries, eventSchedule, image } from '../content';
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
  const title = text('Title', 'Priests and Drugs in 17th-Century Paris');
  const isFullyBooked = boolean('Fully booked', false);
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
  const activeInterpretations = interpretations.map(i => {
    return {
      url: null,
      text: i.interpretationType.title
    };
  }).filter((interpretation) => {
    return (
      interpretation.text === 'British sign language interpreted' && britishSignLanguage ||
      interpretation.text === 'Audio described' && audioDescribed ||
      interpretation.text === 'Speech-to-Text' && speechToText ||
      interpretation.text === 'Hearing loop' && hearingLoop
    );
  });
  const audience = boolean('Has audience?', true);
  const activeAudiences = audience ? [{
    id: id,
    title: '14-19 year olds',
    description: ''
  }].map(i => {
    return {
      url: null,
      text: i.title
    };
  }) : [];

  const event = {
    'title': title,
    'contributorsTitle': '',
    'contributors': [],
    'body': [],
    'promo': {'caption': 'Come and hear Dr Emma Spary discuss her research on the often- overlooked role of priests in the history of pharmacy.', 'image': {'contentUrl': 'https://wellcomecollection.cdn.prismic.io/wellcomecollection/1689f6e5ead8d3a228d802256213e0998b15b7a2_sdp_20181009_0007.jpg', 'width': 3200, 'height': 1800, 'alt': 'Photograph showing a woman giving a talk in the Viewing Room at Wellcome Collection. She is stood at the front of the room looking at a wall mounted television screen. In the foreground are the backs of the heads of the audience.', 'tasl': {'title': 'Exploring Research event', 'author': 'Steven Pocock', 'sourceName': 'Wellcome Collection', 'sourceLink': null, 'license': 'CC-BY-NC', 'copyrightHolder': null, 'copyrightLink': null}, 'crops': {}}, 'link': null},
    'promoText': 'Come and hear Dr Emma Spary discuss her research on the often- overlooked role of priests in the history of pharmacy.',
    'promoImage': {'contentUrl': 'https://wellcomecollection.cdn.prismic.io/wellcomecollection/1689f6e5ead8d3a228d802256213e0998b15b7a2_sdp_20181009_0007.jpg', 'width': 3200, 'height': 1800, 'alt': 'Photograph showing a woman giving a talk in the Viewing Room at Wellcome Collection. She is stood at the front of the room looking at a wall mounted television screen. In the foreground are the backs of the heads of the audience.', 'tasl': {'title': 'Exploring Research event', 'author': 'Steven Pocock', 'sourceName': 'Wellcome Collection', 'sourceLink': null, 'license': 'CC-BY-NC', 'copyrightHolder': null, 'copyrightLink': null}, 'crops': {}},
    'image': {'contentUrl': 'https://wellcomecollection.cdn.prismic.io/wellcomecollection/a4e2a07674bb171ba0b7d7dc7dcf09f1694e13ff_sdp_20181009_0007.jpg', 'width': 4000, 'height': 2250, 'alt': 'Photograph showing a woman giving a talk in the Viewing Room at Wellcome Collection. She is stood at the front of the room looking at a wall mounted television screen. In the foreground are the backs of the heads of the audience.', 'tasl': {'title': 'Exploring Research event', 'author': 'Steven Pocock', 'sourceName': 'Wellcome Collection', 'sourceLink': null, 'license': 'CC-BY-NC', 'copyrightHolder': null, 'copyrightLink': null}, 'crops': {'square': {'contentUrl': 'https://wellcomecollection.cdn.prismic.io/wellcomecollection/318dba668b46078bd957578fa5fc3b2f9b86c5a0_sdp_20181009_0007.jpg', 'width': 3200, 'height': 3200, 'alt': 'Photograph showing a woman giving a talk in the Viewing Room at Wellcome Collection. She is stood at the front of the room looking at a wall mounted television screen. In the foreground are the backs of the heads of the audience.', 'tasl': {'title': 'Exploring Research event', 'author': 'Steven Pocock', 'sourceName': 'Wellcome Collection', 'sourceLink': null, 'license': 'CC-BY-NC', 'copyrightHolder': null, 'copyrightLink': null}, 'crops': {}}, '32:15': {'contentUrl': 'https://wellcomecollection.cdn.prismic.io/wellcomecollection/7b01a0b1273b96cfeb8a5c37e812bd83fe96f537_sdp_20181009_0007.jpg', 'width': 3200, 'height': 1500, 'alt': 'Photograph showing a woman giving a talk in the Viewing Room at Wellcome Collection. She is stood at the front of the room looking at a wall mounted television screen. In the foreground are the backs of the heads of the audience.', 'tasl': {'title': 'Exploring Research event', 'author': 'Steven Pocock', 'sourceName': 'Wellcome Collection', 'sourceLink': null, 'license': 'CC-BY-NC', 'copyrightHolder': null, 'copyrightLink': null}, 'crops': {}}, '16:9': {'contentUrl': 'https://wellcomecollection.cdn.prismic.io/wellcomecollection/1689f6e5ead8d3a228d802256213e0998b15b7a2_sdp_20181009_0007.jpg', 'width': 3200, 'height': 1800, 'alt': 'Photograph showing a woman giving a talk in the Viewing Room at Wellcome Collection. She is stood at the front of the room looking at a wall mounted television screen. In the foreground are the backs of the heads of the audience.', 'tasl': {'title': 'Exploring Research event', 'author': 'Steven Pocock', 'sourceName': 'Wellcome Collection', 'sourceLink': null, 'license': 'CC-BY-NC', 'copyrightHolder': null, 'copyrightLink': null}, 'crops': {}}}},
    'squareImage': {'contentUrl': 'https://wellcomecollection.cdn.prismic.io/wellcomecollection/318dba668b46078bd957578fa5fc3b2f9b86c5a0_sdp_20181009_0007.jpg', 'width': 3200, 'height': 3200, 'alt': 'Photograph showing a woman giving a talk in the Viewing Room at Wellcome Collection. She is stood at the front of the room looking at a wall mounted television screen. In the foreground are the backs of the heads of the audience.', 'tasl': {'title': 'Exploring Research event', 'author': 'Steven Pocock', 'sourceName': 'Wellcome Collection', 'sourceLink': null, 'license': 'CC-BY-NC', 'copyrightHolder': null, 'copyrightLink': null}, 'crops': {}},
    'widescreenImage': {'contentUrl': 'https://wellcomecollection.cdn.prismic.io/wellcomecollection/1689f6e5ead8d3a228d802256213e0998b15b7a2_sdp_20181009_0007.jpg', 'width': 3200, 'height': 1800, 'alt': 'Photograph showing a woman giving a talk in the Viewing Room at Wellcome Collection. She is stood at the front of the room looking at a wall mounted television screen. In the foreground are the backs of the heads of the audience.', 'tasl': {'title': 'Exploring Research event', 'author': 'Steven Pocock', 'sourceName': 'Wellcome Collection', 'sourceLink': null, 'license': 'CC-BY-NC', 'copyrightHolder': null, 'copyrightLink': null}, 'crops': {}},
    'labels': [{'url': null, 'text': 'Seminar'}].concat(activeAudiences).concat(activeInterpretations),
    'place': {'id': 'WoLtUioAACkANrUM', 'title': 'Viewing Room', 'contributors': [], 'body': [], 'labels': [], 'level': 2, 'capacity': 20, 'information': [{'type': 'paragraph', 'text': 'We’ll be in the Viewing Room. It’s next to the Library entrance on level 2, which you can reach by taking the lift or the stairs.', 'spans': []}]},
    'audiences': [],
    'bookingInformation': null,
    'bookingType': 'First come, first served',
    'cost': null,
    'format': {'id': 'WlYVBiQAACcAWcu9', 'title': 'Seminar', 'description': null},
    'policies': [{'id': 'W3RLAikAACcAF2oO', 'title': 'Limited spaces available', 'description': [{'type': 'paragraph', 'text': 'You can claim your place for this event 15 minutes before it starts. Spaces are first come, first served and may run out if we are busy.', 'spans': []}]}],
    'isDropIn': false,
    'series': series ? eventSeries : [],
    'schedule': schedule ? eventSchedule : [],
    'eventbriteId': '',
    'isCompletelySoldOut': false,
    'ticketSalesStart': null,
    'times': [{'range': {'startDateTime': new Date('2018-10-23T17:00:00.000Z'), 'endDateTime': new Date('2018-10-23T18:30:00.000Z')}, 'isFullyBooked': isFullyBooked}],
    'displayStart': new Date('2018-10-23T17:00:00.000Z'),
    'displayEnd': new Date('2018-10-23T18:30:00.000Z'),
    'dateRange': {'firstDate': new Date('2018-10-23T17:00:00.000Z'), 'lastDate': new Date('2018-10-23T18:30:00.000Z'), 'repeats': 1},
    'isPast': false,
    'isRelaxedPerformance': false};
  const position = 0;
  return (
    <EventPromo
      event={event}
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

const stories = storiesOf('Components', module);

stories
  .add('Promos', () => <div></div>, {info: PromoReadme})
  .add('Promos: Editorial', EditorialPromoExample, {info: EditorialPromoReadme})
  .add('Promos: Event', EventPromoExample, {info: EventPromoReadme})
  .add('Promos: Exhibition', ExhibitionPromoExample, {info: ExhibitionPromoReadme})
  .add('Promos: Work', WorkPromoExample, {info: WorkPromoReadme});
