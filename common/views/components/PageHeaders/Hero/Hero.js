// @flow
import {spacing} from '../../../../utils/classnames';
import Picture from '../../Picture/Picture';
import ScrollToInfo from '../../ScrollToInfo/ScrollToInfo';
import WobblyEdge from '../../WobblyEdge/WobblyEdge';
import Grid from '../../layout/Grid';
import Container from '../../layout/Container';
import type {Picture as PictureProps} from '../../../../model/picture';

type Props = {|
  images: PictureProps[],
  whiteBox: React.Node
|}

const Hero = ({ images, whiteBox }: Props) => (
  <div className='exhibition-hero'>
    <Picture
      images={images}
      extraClasses='exhibition-hero__picture'
      isFull={true} />

    <div className={`
      exhibition-hero__copy
      ${spacing({l: 10}, {margin: ['bottom']})}
    `}>
      <div className='is-hidden-l is-hidden-xl'>
        <WobblyEdge background='white' />
      </div>
      <div className={`relative ${spacing({s: 3}, { margin: ['bottom'] })}`} style={{ zIndex: 20 }}>
        <div className='pointer-events-none'>
          <ScrollToInfo elementId='exhibition-content' extraClasses='bg-charcoal bg-hover-charcoal border-color-charcoal' />
        </div>
      </div>
      <Container>
        <Grid sizes={{s: 12, m: 10, shiftM: 1, l: 12, xl: 12}}>
          <div className={`
            bg-white
            inline-block
            exhibition-hero__box
            rounded-diagonal
            ${spacing({s: 4}, {padding: ['top', 'bottom']})}
            ${spacing({l: 4}, {padding: ['right', 'left']})}
          `}>
            {whiteBox}
          </div>
        </Grid>
      </Container>
    </div>
  </div>
);

export default Hero;
