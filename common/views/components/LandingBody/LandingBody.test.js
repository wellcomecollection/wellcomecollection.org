import LandingBody from './LandingBody';
import { shallowWithTheme } from '../../../test/fixtures/enzyme-helpers';
import {
  landingBody,
  landingBodyWithEmptyContentListItems,
} from '../../../test/fixtures/components/landing-body';

describe('LandingBody', () => {
  it(`should match snapshot of LandingBody with empty contentList items`, () => {
    const component = shallowWithTheme(
      <LandingBody
        body={landingBodyWithEmptyContentListItems}
        pageId={'test'}
      />
    );
    const componentHtml = component.html();
    expect(componentHtml).toMatchSnapshot();
  });

  it(`should match snapshot of LandingBody with present contentList items`, () => {
    const component = shallowWithTheme(
      <LandingBody body={landingBody} pageId={'test'} />
    );
    const componentHtml = component.html();
    expect(componentHtml).toMatchSnapshot();
  });
});
