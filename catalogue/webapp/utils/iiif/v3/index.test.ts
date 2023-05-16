import { b2846235x } from '@weco/catalogue/test/fixtures/iiif/manifests';
import { getPdf } from '.';

describe('getPDF', () => {
  it('finds the PDF for a digitised PDF', () => {
    const pdf = getPdf(b2846235x as any);

    expect(pdf).toStrictEqual({
      id: 'https://iiif.wellcomecollection.org/file/b2846235x_Foundations-Moral-Relativism-Expanded2ndEd.pdf',
      label: 'Foundations for moral relativism / J. David Velleman.',
      format: 'application/pdf',
    });
  });
});
