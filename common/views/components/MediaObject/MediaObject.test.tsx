import MediaObject from './MediaObject';
import { shallowWithTheme } from '../../../test/fixtures/enzyme-helpers';
import { mockData } from '../../../test/fixtures/components/media-object';
import { mockImage } from '../../../test/fixtures/components/compact-card';
import { grid } from '../../../utils/classnames';

describe('MediaObject Component', () => {
  const component = shallowWithTheme(
    <MediaObject
      title={mockData.title}
      text={mockData.text}
      image={mockImage}
    />
  );
  const componentHtml = component.html();

  it('renders grid system of 2 for image and 10 for text', () => {
    expect(componentHtml.match(grid({ s: 2, m: 2, l: 2, xl: 2 }))).toBeTruthy();
    expect(
      componentHtml.match(grid({ s: 10, m: 10, l: 10, xl: 10 }))
    ).toBeTruthy();
  });
});
