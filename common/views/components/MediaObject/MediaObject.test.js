import MediaObjecList, { MediaObject } from './MediaObject';
import { shallowWithTheme } from '../../../test/fixtures/enzyme-helpers';
import { mockData } from '../../../test/fixtures/components/media-object';
import { mockImage } from '../../../test/fixtures/components/compact-card';
import { getGridClass } from '../../../test/helpers';

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
      expect(componentHtml.match(getGridClass(2))).toBeTruthy();
      expect(componentHtml.match(getGridClass(10))).toBeTruthy();
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
