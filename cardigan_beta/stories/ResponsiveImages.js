import { storiesOf } from '@storybook/react';
import { breakpoints } from '../../common/utils/breakpoints';
import Grid from '../../common/views/components/Grid/Grid';

const stories = storiesOf('Responsive images', module);
const bps = [
  0,
  600,
  960,
  1338
];
stories.add('In the grid', () => {
  const gridCount = 12;
  const sizes = {s: 12, m: 6, l: 8, xl: 3};
  const images = bps.map(size => `https://via.placeholder.com/${size}x150`);

  const small = parseInt(breakpoints['medium'], 10) * (sizes.s / gridCount);
  const smallSizesQuery = `${small}px`;

  const medium = parseInt(breakpoints['medium'], 10) * (sizes.m / gridCount);
  const mediumSizesQuery = `(min-width: ${breakpoints['medium']}) ${medium}px`;

  const large = parseInt(breakpoints['large'], 10) * (sizes.l / gridCount);
  const largeSizesQuery = `(min-width: ${breakpoints['large']}) ${large}px`;

  const xlarge = parseInt(breakpoints['xlarge'], 10) * (sizes.xl / gridCount);
  const xlargeSizesQuery = `(min-width: ${breakpoints['xlarge']}) ${xlarge}px`;

  return (
    // TODO: srcset
    <Grid sizes={sizes}>
      <img
        src={`${images[images.length - 1]}`}
        srcSet={bps.map(size => `https://via.placeholder.com/${size}x150 ${size}w`)}
        sizes={`${xlargeSizesQuery}, ${largeSizesQuery}, ${mediumSizesQuery}, ${smallSizesQuery}`} />
    </Grid>
  );
});
