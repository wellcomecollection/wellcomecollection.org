import faker from 'faker';

function randomNumber(min, max) {
  return Math.floor(Math.random() * max) + min;
}

export const id = randomNumber(1000, 2000);

export const url = faker.internet.url();

export const image = (
  contentUrl = 'https://wellcomecollection.cdn.prismic.io/wellcomecollection/5b28b809814fc6d1d716b0082725b24e0a0ad6a9_ep_000012_089.jpg',
  width = 640,
  height = 480) => {
  return {
    contentUrl: contentUrl,
    width,
    height,
    alt: 'an image with some alt text',
    tasl: {
      contentUrl: contentUrl,
      title: 'The title of the image',
      author: 'The author',
      sourceName: 'Wellcome Collection',
      sourceLink: 'https://wellcomecollection.org/works',
      license: 'CC-BY-NC'
    }
  };
};

export const editorialSeries = [{'name': 'Searching for Genius', 'description': [{'type': 'paragraph', 'text': 'This five-part series is great. ', 'spans': []}], 'color': 'turquoise', 'commissionedLength': 6, 'schedule': [{'title': [{'type': 'heading1', 'text': 'First heading', 'spans': []}], 'publishDate': '2018-04-18T23: 00: 00+0000'}, {'title': [{'type': 'heading1', 'text': 'Second heading', 'spans': []}], 'publishDate': '2018-04-25T23: 00: 00+0000'}, {'title': [{'type': 'heading1', 'text': 'Third heading', 'spans': []}], 'publishDate': '2018-05-02T23: 00: 00+0000'}, {'title': [{'type': 'heading1', 'text': 'Fourth heading', 'spans': []}], 'publishDate': '2018-05-09T23: 00: 00+0000'}, {'title': [{'type': 'heading1', 'text': 'Fifth heading', 'spans': []}], 'publishDate': '2018-05-16T23: 00: 00+0000'}], 'promo': [], 'wordpressSlug': null}];

export const eventSeries = [{'id': 'Wn28GCoAACkAIYol', 'title': 'The Evidence:  Civilisations and Health', 'description': [{'type': 'paragraph', 'text': 'The BBC World Service is joining forces with Wellcome Collection for this series of events and radio programmes exploring health in the context of society and civilisation. ', 'spans': []}]}];

export const eventSchedule = [{'event': {'id': 'Wo1c-CoAACoAZG2p', 'type': 'events', 'tags': ['delist'], 'slug': 'creative-activities', 'lang': 'en-gb', 'link_type': 'Document', 'isBroken': false}, 'hideLink': null}, {'event': {'id': 'Wo1ZxioAAMLuZF_Q', 'type': 'events', 'tags': ['delist'], 'slug': 'shakti-and-seva-gender-and-health-in-south-asia', 'lang': 'en-gb', 'link_type': 'Document', 'isBroken': false}, 'hideLink': null}, {'event': {'id': 'Wo1bOSoAAHW6ZGYC', 'type': 'events', 'tags': ['delist'], 'slug': 'music-from-club-kali', 'lang': 'en-gb', 'link_type': 'Document', 'isBroken': false}, 'hideLink': null}];

export const captionedImage = () => ({
  image: image(),
  caption: [{
    type: 'paragraph',
    text: faker.random.words(randomNumber(5, 15)),
    spans: []
  }]
});

export const singleLineOfText = (min = 3, max = 8) => faker.random.words(randomNumber(min, max));

export const text = () => Array(randomNumber(1, 2)).fill().map(() => ({
  'type': 'paragraph',
  'text': `${faker.random.words(randomNumber(25, 40))}`,
  'spans': []
}));

const smallText = () => [{
  'type': 'paragraph',
  'text': `${faker.random.words(randomNumber(12, 24))}`,
  'spans': []
}];

export const videoEmbed = { embedUrl: 'https://www.youtube.com/embed/VYOjWnS4cMY' };

export const imageGallery = () => {
  const items = Array(randomNumber(3, 5)).fill().map(captionedImage);
  return {
    id: '123',
    title: singleLineOfText(),
    items: items
  };
};

export const quote = () => ({
  text: [{
    type: 'paragraph',
    text: 'Said Hamlet to Ophelia,\nI\'ll draw a sketch of thee,\nWhat kind of pencil shall I use?\n2B or not 2B?',
    spans: []
  }],
  citation: [{
    type: 'paragraph',
    text: 'Spike Milligan - A Silly Poem',
    spans: [{
      type: 'hyperlink',
      start: 0,
      end: 29,
      data: {
        url: 'https://www.poemhunter.com/poem/a-silly-poem/'
      }
    }]
  }]
});

const sameAs = [
  { link: 'https://twitter.com/mbannisy', title: '@mbannisy' },
  { link: 'http://things.com', title: 'things.com' },
  { link: 'https://google.com', title: 'This is it!' }
];
export function person() {
  return {
    id: faker.random.uuid(),
    name: faker.name.findName(),
    description: smallText(),
    image: {
      contentUrl: faker.image.avatar()
    },
    sameAs: sameAs
  };
}

export function organisation() {
  return {
    id: faker.random.uuid(),
    name: faker.company.companyName(),
    description: smallText(),
    url: 'https://wellcomecollection.org',
    image: {
      contentUrl: 'https://vignette.wikia.nocookie.net/logopedia/images/4/42/BBC_Worldwide_1995.svg/revision/latest?cb=20180114133014'
    },
    sameAs: []
  };
}
