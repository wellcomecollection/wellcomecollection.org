import { FunctionComponent } from 'react';
import { landingHeaderBackgroundLs } from '../../utils/backgrounds';
import WobblyEdge from '../WobblyEdge/WobblyEdge';

type Props = {
  backgroundTexture?: string;
  hasWobblyEdge?: boolean;
  useDefaultBackgroundTexture?: boolean;
};

const defaultBackgroundTexture = landingHeaderBackgroundLs;

const HeaderBackground: FunctionComponent<Props> = ({
  backgroundTexture,
  hasWobblyEdge,
  useDefaultBackgroundTexture,
}: Props) => {
  const texture =
    backgroundTexture ||
    (useDefaultBackgroundTexture ? defaultBackgroundTexture : null);
  const backgroundStyles = texture
    ? {
        backgroundImage: `url(${texture})`,
        backgroundSize: 'cover',
      }
    : {};

  const styles = {
    top: 0,
    zIndex: -1,
    bottom: '100px',
    ...backgroundStyles,
  };

  return (
    <div
      className="absolute overflow-hidden full-width bg-cream"
      style={styles}
    >
      {hasWobblyEdge && (
        <div className="absolute full-width" style={{ bottom: 0 }}>
          <WobblyEdge isValley={true} intensity={100} background={'white'} />
        </div>
      )}
    </div>
  );
};

export default HeaderBackground;
