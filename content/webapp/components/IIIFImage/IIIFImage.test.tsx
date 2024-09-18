import { ImageType } from '@weco/common/model/image';
import { renderWithTheme } from '@weco/common/test/fixtures/test-helpers';

import IIIFImage from './IIIFImage';

describe('IIIFImage', () => {
  const props: ImageType = {
    contentUrl: 'https://iiif.wellcomecollection.org/image/V0043039/info.json',
    width: 300,
    height: 300,
    alt: '',
  };

  it('renders a IIIF image URL', async () => {
    const { getByRole } = renderWithTheme(
      <IIIFImage image={props} priority={true} layout="fixed" />
    );
    await expect(getByRole('img')).toHaveAttribute(
      'src',
      'https://iiif.wellcomecollection.org/image/V0043039/full/640%2C/0/default.jpg'
    );
  });
});
