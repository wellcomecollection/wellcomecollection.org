import { mountWithTheme } from '@weco/common/test/fixtures/enzyme-helpers';
import WorkDetailsText from './WorkDetailsText';

describe('WorkDetailsText', () => {
  it('renders HTML as-is', () => {
    const component = mountWithTheme(
      <WorkDetailsText
        html={['This is <strong>bold</strong> text']}
        allowDangerousRawHtml={true}
      />
    );

    expect(component.html().includes('<strong>bold</strong>')).toBeTruthy();
  });

  it('escapes HTML if passed as plain text', () => {
    const component = mountWithTheme(
      <WorkDetailsText
        text={['You write HTML with angle brackets like <em>']}
      />
    );

    expect(component.html().includes('&lt;em&gt;')).toBeTruthy();
  });

  it('renders raw React elements as-is', () => {
    const component = mountWithTheme(
      <WorkDetailsText
        contents={
          <>
            This is a <ul>React</ul> element
          </>
        }
      />
    );

    expect(component.html().includes('<ul>React</ul>')).toBeTruthy();
  });
});
