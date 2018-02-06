// @flow

type Props = {|
  colorsArray: Array<{|name: string, hex: string|}>
|}

function colorBlock(name, hex) {
  if (hex.indexOf('#') !== 0) return; // Don't display e.g. 'currentColor' or 'transparent'

  return (
    <div key={name} className='styleguide__palette__block'>
      <h2 className='styleguide__palette__name'>{name}</h2>
      <div className={`styleguide__palette__color styleguide__palette__color--${name}`} style={{background: hex}}></div>
      <span className='styleguide__palette__hex'>Hex: <code className='styleguide__palette__code'>{hex}</code></span>
    </div>
  );
}

const Palette = ({colorsArray}: Props) => (
  <div>
    <div className='styleguide__palette__section'>
      {colorsArray.map(color => colorBlock(color.name, color.hex))}
    </div>
  </div>
);

export default Palette;
