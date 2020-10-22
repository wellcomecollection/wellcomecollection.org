import MediaObjecList, { MediaObject } from './MediaObject';
import { shallowWithTheme } from '../../../test/fixtures/enzyme-helpers';

const mockImage = {
  contentUrl:
    'https://images.prismic.io/wellcomecollection/c8f7b7f4-d455-4c3f-ae65-9dc7428ae60a_EP001430_0001.jpg?auto=compress,format',
  width: 3630,
  height: 2836,
  alt:
    'Two St. Bernard dogs with an avalanche victim, one tries to revive him while the other alerts the rescue party.',
  tasl: {
    title:
      'Two St. Bernard dogs with an avalanche victim, one tries to revive him while the other alerts the rescue party.',
    author: 'J. Landseer, 1831, after E. Landseer.',
    sourceName: 'Wellcome Collection',
    sourceLink:
      'https://wellcomecollection.org/works/keh5hjrh/images?id=vkqa2fhr',
    license: 'CC-BY',
    copyrightHolder: null,
    copyrightLink: null,
  },
  crops: {
    square: {
      contentUrl:
        'https://images.prismic.io/wellcomecollection/c8f7b7f4-d455-4c3f-ae65-9dc7428ae60a_EP001430_0001.jpg?auto=compress,format&rect=397,0,2836,2836&w=3200&h=3200',
      width: 3200,
      height: 3200,
      alt:
        'Two St. Bernard dogs with an avalanche victim, one tries to revive him while the other alerts the rescue party.',
      tasl: {
        title:
          'Two St. Bernard dogs with an avalanche victim, one tries to revive him while the other alerts the rescue party.',
        author: 'J. Landseer, 1831, after E. Landseer.',
        sourceName: 'Wellcome Collection',
        sourceLink:
          'https://wellcomecollection.org/works/keh5hjrh/images?id=vkqa2fhr',
        license: 'CC-BY',
        copyrightHolder: null,
        copyrightLink: null,
      },
      crops: {},
    },
  },
};

const mockData = {
  title: 'mock title',
  text: [
    {
      type: 'paragraph',
      text: 'Keep your nose and mouth covered, unless you’re exempt.',
      spans: [
        {
          start: 48,
          end: 54,
          type: 'hyperlink',
          data: {
            link_type: 'Web',
            url:
              'https://www.gov.uk/government/publications/face-coverings-when-to-wear-one-and-how-to-make-your-own#when-you-do-not-need-to-wear-a-face-covering',
          },
        },
      ],
    },
  ],
  image: mockImage,
};

describe('MediaObject', () => {
  describe('MediaObject', () => {
    const component = shallowWithTheme(
      <MediaObject
        title={mockData.title}
        text={mockData.text}
        image={mockImage}
      />
    );
    const componentHtml = component.html();
    it('Should render snapshot', () => {
      expect(componentHtml).toMatchSnapshot();
    });
    it('Should render grid system of 2 for image and 10 for text', () => {
      expect(
        componentHtml.match(
          'grid__cell grid__cell--s2 grid__cell--m2 grid__cell--l2 grid__cell--xl2'
        )
      ).toBeTruthy();
      expect(
        componentHtml.match(
          'grid__cell grid__cell--s10 grid__cell--m10 grid__cell--l10 grid__cell--xl10'
        )
      ).toBeTruthy();
    });

    it('Should render without an image', () => {
      const component = shallowWithTheme(
        <MediaObject title={mockData.title} text={mockData.text} image={null} />
      );

      expect(component.html()).toMatchSnapshot();
    });
  });

  describe('MediaObjectList', () => {
    it('MediaObjectList Should render snapshot', () => {
      const component = shallowWithTheme(<MediaObjecList items={[mockData]} />);
      expect(component.html()).toMatchSnapshot();
    });
  });
});
