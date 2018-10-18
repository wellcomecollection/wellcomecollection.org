// @flow
import WobblyEdge from '../WobblyEdge/WobblyEdge';

type Props = {|
  backgroundTexture?: string,
  hasWobblyEdge?: boolean,
  useDefaultBackgroundTexture?: boolean
|}

const defaultBackgroundTexture = 'https://wellcomecollection.cdn.prismic.io/wellcomecollection%2F9154df28-e179-47c0-8d41-db0b74969153_wc+brand+backgrounds+2_pattern+2+colour+1.svg';
const HeaderBackground = ({
  backgroundTexture,
  hasWobblyEdge,
  useDefaultBackgroundTexture
}: Props) => {
  const texture = backgroundTexture || (useDefaultBackgroundTexture ? defaultBackgroundTexture : null);
  const backgroundStyles = texture
    ? {
      backgroundImage: `url(${texture})`,
      backgroundSize: '150%'
    } : {};

  const styles = {
    top: 0,
    zIndex: -1,
    bottom: '100px',
    ...backgroundStyles
  };

  return (
    <div className='absolute overflow-hidden full-width bg-cream' style={styles}>
      {hasWobblyEdge &&
        <div className='absolute full-width' style={{ bottom: 0 }}>
          <WobblyEdge isValley={true} intensity={100} background={'white'} />
        </div>
      }
    </div>
  );
};

export default HeaderBackground;
