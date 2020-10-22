import MediaObjecList, { MediaObject } from './MediaObject';
import { shallowWithTheme } from '../../../test/fixtures/enzyme-helpers';
import {
  mockData,
  mockImage,
} from '../../../test/fixtures/components/media-object';

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
