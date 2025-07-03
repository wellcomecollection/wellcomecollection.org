import { renderWithTheme } from '@weco/common/test/fixtures/test-helpers';
import WorkDetailsText from '@weco/content/views/works/work/WorkDetails/WorkDetails.Text';

describe('WorkDetailsText', () => {
  it('renders HTML as-is', () => {
    const { container } = renderWithTheme(
      <WorkDetailsText
        html={['This is <strong>bold</strong> text']}
        allowDangerousRawHtml={true}
      />
    );

    expect(container.outerHTML.includes('<strong>bold</strong>')).toBe(true);
  });

  it('escapes HTML if passed as plain text', () => {
    const { container } = renderWithTheme(
      <WorkDetailsText
        text={['You write HTML with angle brackets like <em>']}
        allowDangerousRawHtml={true}
      />
    );
    expect(container.outerHTML.includes('&lt;em&gt;')).toBe(true);
  });

  it('renders raw React elements as-is', () => {
    const { container } = renderWithTheme(
      <WorkDetailsText
        contents={
          <>
            This is a <p>React</p>
            element
          </>
        }
      />
    );

    expect(container.outerHTML.includes('<p>React</p>')).toBe(true);
  });
});
