// @flow
type Props = {|
  backgroundTexture?: string,
  hasWobblyEdge?: boolean
|}

const HeaderBackground = ({
  backgroundTexture,
  hasWobblyEdge
}: Props) => {
  const backgroundStyles = backgroundTexture
    ? {
      backgroundImage: `url(${backgroundTexture})`,
      backgroundSize: '150%'
    }
    : {};

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
          <div className='wobbly-edge wobbly-edge--white js-wobbly-edge'
            data-is-valley='true'
            data-max-intensity='100'>
          </div>
        </div>
      }
    </div>
  );
};

export default HeaderBackground;
