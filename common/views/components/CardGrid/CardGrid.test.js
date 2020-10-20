import CardGrid from './CardGrid';
import {
  shallowWithTheme,
  mountWithTheme,
} from '../../../test/fixtures/enzyme-helpers';
import MoreLink from '../MoreLink/MoreLink';

describe('CardGrid', () => {
  // This could be moved into fixture directory if used in more places
  const mockItems = [
    {
      start: '2019-09-04T23:00:00.000Z',
      end: '2090-01-01T00:00:00.000Z',
      id: 'XNFfsxAAANwqbNWD',
      title: 'Being Human',
      contributorsTitle: '',
      contributors: [],
      body: [],
      standfirst: undefined,
      promo: {
        id: 'XNFfsxAAANwqbNWD',
        format: [Object],
        url: '/exhibitions/XNFfsxAAANwqbNWD',
        title: 'Being Human',
        shortTitle: 'Being Human',
        image: [Object],
        squareImage: [Object],
        start: '2019-09-04T23:00:00.000Z',
        end: '2090-01-01T00:00:00.000Z',
        statusOverride: 'Reopens 7 October',
      },
      promoText:
        'Our new permanent gallery explores trust, identity and health in a changing world.',
      promoImage: {
        contentUrl:
          'https://images.prismic.io/wellcomecollection/b40da45c5b49cc5dd946dffeddbf8ce114ac0003_ep_000832_058.jpg?auto=compress,format',
        width: 3200,
        height: 1800,
        alt:
          'Photograph of an exhibition gallery space, with a blue stained wood ' +
          'wall in the background, in front of which a young man looks at a ' +
          'life-size artwork of a figure resembling an astronaut. In the ' +
          'foreground a young woman sits on a wooden bench holding an audio ' +
          'speaker to her ear.',
        tasl: [],
        crops: {},
      },
      image: {
        contentUrl:
          'https://images.prismic.io/wellcomecollection/0cfe014fb55e817bb3014c0c06cabf3a2fd5a74a_ep_000832_058.jpg?auto=compress,format',
        width: 4000,
        height: 2670,
        alt:
          'Photograph of an exhibition gallery space, with a blue stained wood ' +
          'wall in the background, in front of which a young man looks at a ' +
          'life-size artwork of a figure resembling an astronaut. In the ' +
          'foreground a young woman sits on a wooden bench holding an audio ' +
          'speaker to her ear.',
        tasl: [],
        crops: [],
      },
      squareImage: {
        contentUrl:
          'https://images.prismic.io/wellcomecollection/2e7bcd148d629cd8fe670d42bac997051f4112ea_ep_000832_058.jpg?auto=compress,format',
        width: 3200,
        height: 3200,
        alt:
          'Photograph of an exhibition gallery space, with a blue stained wood ' +
          'wall in the background, in front of which a young man looks at a ' +
          'life-size artwork of a figure resembling an astronaut. In the ' +
          'foreground a young woman sits on a wooden bench holding an audio ' +
          'speaker to her ear.',
        tasl: [],
        crops: {},
      },
      widescreenImage: {
        contentUrl:
          'https://images.prismic.io/wellcomecollection/b40da45c5b49cc5dd946dffeddbf8ce114ac0003_ep_000832_058.jpg?auto=compress,format',
        width: 3200,
        height: 1800,
        alt:
          'Photograph of an exhibition gallery space, with a blue stained wood ' +
          'wall in the background, in front of which a young man looks at a ' +
          'life-size artwork of a figure resembling an astronaut. In the ' +
          'foreground a young woman sits on a wooden bench holding an audio ' +
          'speaker to her ear.',
        tasl: [],
        crops: {},
      },
      metadataDescription: '',
      labels: [],
      type: 'exhibitions',
      shortTitle: 'Being Human',
      format: {
        id: 'Wvw6wSAAAAuy63fP',
        title: 'Permanent',
        description: null,
      },
      description: [],
      intro: undefined,
      isPermanent: true,
      statusOverride: 'Reopens 7 October',
      place: {
        id: 'Wn1gdSoAACgAH_-x',
        title: 'Being Human gallery',
        contributorsTitle: undefined,
        contributors: [],
        body: [],
        standfirst: undefined,
        promo: undefined,
        promoText: undefined,
        promoImage: undefined,
        image: undefined,
        squareImage: undefined,
        widescreenImage: undefined,
        metadataDescription: undefined,
        labels: [],
        level: 1,
        capacity: undefined,
        information: [],
      },
      exhibits: [],
      galleryLevel: undefined,
      textAndCaptionsDocument: null,
      featuredImageList: [],
      resources: [],
      relatedBooks: [],
      relatedEvents: [],
      relatedGalleries: [],
      relatedArticles: [],
      relatedIds: ['XYt51BAAACIAYa4e', 'XYofFREAACQAp-Vl'],
    },
  ];

  it('Should be able to render CardGrid', () => {
    const component = shallowWithTheme(
      <CardGrid itemsPerRow={3} items={mockItems} />
    );

    expect(component.html()).toMatchSnapshot();
  });

  describe('Links inside CardGrid', () => {
    it('Should be able to render multiple links within CardGrid component', () => {
      const mockLinks = [
        {
          text: 'View all exhibitions',
          url: '/exhibitions',
        },
        {
          text: 'View all events',
          url: '/events',
        },
      ];
      const component = mountWithTheme(
        <CardGrid itemsPerRow={3} items={mockItems} links={mockLinks} />
      );
      const componentHtml = component.html();
      expect(componentHtml.includes(mockLinks[0].text)).toBeTruthy();
      expect(componentHtml.includes(mockLinks[0].url)).toBeTruthy();
      expect(componentHtml.includes(mockLinks[1].text)).toBeTruthy();
      expect(componentHtml.includes(mockLinks[1].url)).toBeTruthy();

      expect(component.find(MoreLink).length).toEqual(2);
    });
  });
});
