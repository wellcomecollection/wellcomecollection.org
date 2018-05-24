// @flow
type Props = {|
  backgroundTexture: string
|}

const TexturedBackground = ({
  backgroundTexture
}: Props) => (
  <div className='row relative'>
    <div className='absolute overflow-hidden full-width bg-cream' style={{
      top: 0,
      height: '40vw',
      maxHeight: '50vh',
      minHeight: '200px',
      zIndex: -1,
      backgroundImage: `url(${backgroundTexture})`,
      backgroundSize: '150%'
    }}>
    </div>
  </div>
);

export default TexturedBackground;
