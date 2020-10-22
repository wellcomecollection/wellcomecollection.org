import InfoBlock from './InfoBlock';
import { shallowWithTheme } from '../../../test/fixtures/enzyme-helpers';

const title = `InfoBlock title`;
const text = [
  {
    type: 'paragraph',
    text: 'Text in the InfoBlock',
    spans: [],
  },
];
const link = { link_type: 'Web', url: 'https://wellcomecollection.org' };
const linkText = 'InfoBlock link text';
describe('InfoBlock', () => {
  it(`should match snapshots`, () => {
    const component = shallowWithTheme(
      <InfoBlock title={title} text={text} linkText={linkText} link={link} />
    );
    const componentNoLinkText = shallowWithTheme(
      <InfoBlock title={title} text={text} linkText={null} link={link} />
    );
    const componentNoLink = shallowWithTheme(
      <InfoBlock title={title} text={text} linkText={linkText} link={null} />
    );
    const componentNoLinkNoLinkText = shallowWithTheme(
      <InfoBlock title={title} text={text} linkText={null} link={null} />
    );

    expect(component.html()).toMatchSnapshot();
    expect(componentNoLink.html()).toMatchSnapshot();
    expect(componentNoLinkText.html()).toMatchSnapshot();
    expect(componentNoLinkNoLinkText.html()).toMatchSnapshot();
  });
});
