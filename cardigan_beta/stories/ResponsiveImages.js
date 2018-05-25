import { Fragment } from 'react';
import { storiesOf } from '@storybook/react';
import {image} from './content';
import Grid from '../../common/views/components/Grid/Grid';
import {UiImage} from '../../common/views/components/Images/Images';
import ResponsiveImage from '../../common/views/components/ResponsiveImage/ResponsiveImage';

const stories = storiesOf('Responsive images', module);

stories.add('In the grid', () => {
  const sizes = {s: 12, m: 6, l: 4, xl: 4};
  const sizesQueries = '(min-width: 1420px) 386px, (min-width: 960px) calc(28.64vw - 15px), (min-width: 600px) calc(50vw - 54px), calc(100vw - 36px)';

  return (
    <Fragment>
      <h1 className='h1'>Responsive image</h1>
      <Grid sizes={sizes}>
        <div style={{position: 'relative'}}>
          <ResponsiveImage
            {...image}
            contentUrl={image.contentUrl}
            sizes={sizes} />
        </div>
      </Grid>

      <h1 className='h1'>UI image</h1>
      <Grid sizes={sizes}>
        <div style={{position: 'relative'}}>
          <UiImage
            {...image}
            sizesQueries={sizesQueries} />
        </div>
      </Grid>
    </Fragment>
  );
});
