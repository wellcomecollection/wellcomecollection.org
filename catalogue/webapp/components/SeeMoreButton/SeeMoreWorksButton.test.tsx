import { mountWithTheme } from '@weco/common/test/fixtures/enzyme-helpers';
import { SeeMoreWorksButton } from './SeeMoreWorksButton';

describe('SeeMoreWorksButton', () => {
  it('correctly escapes values that need CSV quoting', () => {
    // e.g. https://wellcomecollection.org/concepts/vqrvm96d
    const component = mountWithTheme(
      <SeeMoreWorksButton
        totalResults={5}
        props={{
          'subjects.label': ['Germany, East'],
        }}
        source={'concepts/worksAbout'}
        leadingColor={'yellow'}
      />
    );
    const componentHtml = component.html();

    console.log(componentHtml);

    expect(componentHtml.includes('All works (5)')).toBeTruthy();
    expect(
      componentHtml.includes('/works?subjects.label=%22Germany%2C+East%22')
    ).toBeTruthy();
  });
});
