import { mountWithTheme } from '@weco/common/test/fixtures/enzyme-helpers';
import SeeMoreImagesButton from './SeeMoreImagesButton';

describe('SeeMoreImagesButton', () => {
  it('correctly escapes values that need CSV quoting', () => {
    // e.g. https://wellcomecollection.org/concepts/vqrvm96d
    const component = mountWithTheme(
      <SeeMoreImagesButton
        totalResults={5}
        props={{
          'source.subjects.label': ['Germany, East'],
        }}
        source={'concepts/imagesAbout'}
        leadingColor={'yellow'}
      />
    );
    const componentHtml = component.html();

    expect(componentHtml.includes('All images (5)')).toBeTruthy();
    expect(
      componentHtml.includes(
        '/images?source.subjects.label=%22Germany%2C+East%22'
      )
    ).toBeTruthy();
  });
});
