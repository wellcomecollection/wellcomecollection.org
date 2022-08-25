import { mountWithTheme } from '@weco/common/test/fixtures/enzyme-helpers';
import WorkDetailsText from './WorkDetailsText';

describe('WorkDetailsText', () => {
  it('renders HTML as-is if allowRawHtml=true', () => {
    const component = mountWithTheme(
      <WorkDetailsText
        text={['This is <strong>bold</strong> text']}
        allowRawHtml={true}
      />
    );

    expect(component.html().includes('<strong>bold</strong>')).toBeTruthy();
  });

  it('escapes HTML if allowRawHtml=false', () => {
    const component = mountWithTheme(
      <WorkDetailsText
        text={['You write HTML with angle brackets like <em>']}
        allowRawHtml={false}
      />
    );

    expect(component.html().includes('&lt;em&gt;')).toBeTruthy();
  });
});
