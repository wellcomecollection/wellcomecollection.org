import { mountWithTheme } from '@weco/common/test/fixtures/enzyme-helpers';
import { Props as ImageProps } from '@weco/common/views/components/Image/Image';
import ImageCard from './ImageCard';

describe('ImageCard', () => {
  const props: ImageProps = {
    contentUrl: 'https://iiif.wellcomecollection.org/image/V0043039/info.json',
    width: 300,
    height: 300,
    alt: '',
  };

  it('renders a IIIF image URL', () => {
    const component = mountWithTheme(
      <ImageCard
        id="1"
        workId="zxahbyqz"
        image={props}
        onClick={event => {
          console.log(event);
        }}
      />
    );

    console.log(component.html());

    expect(
      component
        .html()
        .includes(
          'https://iiif.wellcomecollection.org/image/V0043039/full/300%2C/0/default.jpg'
        )
    ).toBeTruthy();
  });
});
