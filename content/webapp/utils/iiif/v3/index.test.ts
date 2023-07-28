import {
  b28462270,
  b2846235x,
} from '@weco/content/test/fixtures/iiif/manifests';
import { getPdf, transformLabel } from '.';

describe('getPDF', () => {
  it('finds the PDF for an old-style digitised PDF', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pdf = getPdf(b2846235x as any);

    expect(pdf).toStrictEqual({
      id: 'https://iiif.wellcomecollection.org/file/b2846235x_Foundations-Moral-Relativism-Expanded2ndEd.pdf',
      label: 'Foundations for moral relativism / J. David Velleman.',
      format: 'application/pdf',
    });
  });

  it('finds the PDF for a new-style digitised PDF', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pdf = getPdf(b28462270 as any);

    expect(pdf).toStrictEqual({
      id: 'https://iiif-test.wellcomecollection.org/file/b28462270_DigitalHumanitiesPedagogy.pdf',
      label: 'Download file',
      format: 'application/pdf',
    });
  });
});

describe('transformLabel', () => {
  test.each([
    {
      label: { en: ['Foundations for moral relativism / J. David Velleman.'] },
      expected: 'Foundations for moral relativism / J. David Velleman.',
    },
    { label: { none: ['-'] }, expected: undefined },
    { label: undefined, expected: undefined },
    {
      label: 'Foundations for moral relativism / J. David Velleman.',
      expected: 'Foundations for moral relativism / J. David Velleman.',
    },
  ])('the transformed label from $label is $expected', ({ label, expected }) =>
    expect(transformLabel(label)).toBe(expected)
  );
});
