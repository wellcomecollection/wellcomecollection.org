// @flow
import { Fragment } from 'react';
import Tasl from '../Tasl/Tasl';
import { breakpoints } from '../../../utils/breakpoints';
import { convertImageUri } from '../../../utils/convert-image-uri';

const bps = [
  0,
  600,
  960,
  1338
];

const ResponsiveImage = ({
  contentUrl,
  width,
  height,
  alt,
  sizes,
  tasl
}: any) => {
  const gridCount = 12;
  const small = parseInt(breakpoints['medium'], 10) * (sizes.s / gridCount);
  const smallSizesQuery = `${small}px`;

  const medium = parseInt(breakpoints['medium'], 10) * (sizes.m / gridCount);
  const mediumSizesQuery = `(min-width: ${breakpoints['medium']}) ${medium}px`;

  const large = parseInt(breakpoints['large'], 10) * (sizes.l / gridCount);
  const largeSizesQuery = `(min-width: ${breakpoints['large']}) ${large}px`;

  const xlarge = parseInt(breakpoints['xlarge'], 10) * (sizes.xl / gridCount);
  const xlargeSizesQuery = `(min-width: ${breakpoints['xlarge']}) ${xlarge}px`;

  return (
    <Fragment>
      <img
        width={width}
        height={height}
        alt={alt}
        className={'image lazy-image lazyload'}
        src={convertImageUri(contentUrl, 30)}
        srcSet={bps.map(size => `${convertImageUri(contentUrl, size)} ${size}w`)}
        sizes={`${xlargeSizesQuery}, ${largeSizesQuery}, ${mediumSizesQuery}, ${smallSizesQuery}`} />
      {tasl && <Tasl {...tasl} />}
    </Fragment>
  );
};

export default ResponsiveImage;
