import { getImageUrlAtSize } from './images';
import { imageWithCrops, imageWithoutCrops } from './images.mocks';

describe('getImageUrlAtSize', () => {
  // Some images don't have the crops as the documents they were
  // added too hadn't had them added to the prismic-model yet
  it('prefers 16:9 crop with a fallback of the original', () => {
    const expectedUrlWithCrop = new URL(imageWithCrops['16:9'].url);
    const urlWithCrop = new URL(
      getImageUrlAtSize(imageWithCrops, { w: 600 }) as string
    );

    const expectedUrlWithoutCrop = new URL(imageWithCrops.url);
    const urlWithoutCrop = new URL(
      getImageUrlAtSize(imageWithoutCrops, { w: 600 }) as string
    );

    // Prismic attaches a rect=x,y,w,h to crops
    expect(urlWithCrop.searchParams.get('rect')).toEqual(
      expectedUrlWithCrop.searchParams.get('rect')
    );

    expect(urlWithoutCrop.searchParams.get('rect')).toEqual(
      expectedUrlWithoutCrop.searchParams.get('rect')
    );
    expect(urlWithoutCrop.searchParams.get('rect')).toBeNull();
  });

  it('maintains previously set search params', () => {
    // The fixture has auto=compress,format
    const urlWithCrop = new URL(
      getImageUrlAtSize(imageWithCrops, { w: 600 }) as string
    );
    expect(urlWithCrop.searchParams.get('auto')).toEqual('compress,format');
  });

  it('adds new search params', () => {
    const urlWithCrop = new URL(
      getImageUrlAtSize(imageWithCrops, { w: 1338 }) as string
    );
    expect(urlWithCrop.searchParams.get('w')).toEqual('1338');
  });

  it('overrides preset search params', () => {
    const urlWithCrop = new URL(
      getImageUrlAtSize(
        {
          ...imageWithoutCrops,
          url: `${imageWithoutCrops.url}&width=123`,
        },
        { w: 1338 }
      ) as string
    );
    expect(urlWithCrop.searchParams.get('w')).toEqual('1338');
  });

  it('removes the `h` param from the search params', () => {
    const urlWithCrop = new URL(
      getImageUrlAtSize(
        {
          ...imageWithoutCrops,
          url: `${imageWithoutCrops.url}&h=123`,
        },
        { w: 1338 }
      ) as string
    );
    expect(urlWithCrop.searchParams.get('h')).toBeNull();
  });
});
