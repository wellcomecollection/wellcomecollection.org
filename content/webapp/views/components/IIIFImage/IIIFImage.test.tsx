import { ImageType } from '@weco/common/model/image';
import { renderWithTheme } from '@weco/common/test/fixtures/test-helpers';

import IIIFImage from '.';

describe('IIIFImage', () => {
  const props: ImageType = {
    contentUrl: 'https://iiif.wellcomecollection.org/image/V0043039/info.json',
    width: 300,
    height: 300,
    alt: 'image of trees',
  };

  it('renders a IIIF image URL', async () => {
    const { findByRole } = renderWithTheme(
      <IIIFImage image={props} priority={true} layout="fixed" />
    );

    const image = await findByRole('img');

    await expect(image).toHaveAttribute(
      'src',
      'https://iiif.wellcomecollection.org/image/V0043039/full/640%2C/0/default.jpg'
    );
  });
});
