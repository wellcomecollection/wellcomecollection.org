// @flow
type Props = {|
  backgroundTexture: string
|}

const TexturedBackground = ({
  backgroundTexture
}: Props) => (
  <div className='absolute overflow-hidden full-width bg-cream' style={{
    top: 0,
    zIndex: -1,
    bottom: '100px',
    backgroundImage: `url(${backgroundTexture})`,
    backgroundSize: '150%'
  }}>
  </div>
);

export default TexturedBackground;
