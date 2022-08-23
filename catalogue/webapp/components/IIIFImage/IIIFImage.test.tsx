import { mountWithTheme } from '@weco/common/test/fixtures/enzyme-helpers';
import { ImageType } from '@weco/common/model/image';
import IIIFImage from './IIIFImage';

describe('IIIFImage', () => {
  const props: ImageType = {
    contentUrl: 'https://iiif.wellcomecollection.org/image/V0043039/info.json',
    width: 300,
    height: 300,
    alt: '',
  };

  it('renders a IIIF image URL', () => {
    const component = mountWithTheme(
      <IIIFImage image={props} priority={true} layout="fill" />
    );

    expect(
      component
        .html()
        .includes(
          'https://iiif.wellcomecollection.org/image/V0043039/full/3840%2C/0/default.jpg'
        )
    ).toBeTruthy();
  });
});
