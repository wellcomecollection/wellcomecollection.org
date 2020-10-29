import MediaObjecList from './MediaObjectList';
import { shallowWithTheme } from '../../../test/fixtures/enzyme-helpers';
import { mockData } from '../../../test/fixtures/components/media-object';

describe('MediaObjectList Component', () => {
  it('MediaObjectList Should render snapshot', () => {
    const component = shallowWithTheme(<MediaObjecList items={[mockData]} />);
    expect(component.html()).toMatchSnapshot();
  });
});
