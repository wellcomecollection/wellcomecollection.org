// @flow

type Props = {|
  primary: {|name: string, hex: string|},
  secondary: {|name: string, hex: string|}
|}

function colorBlock(name, hex) {
  return (
    <div className='styleguide__palette__block'>
      <h2 className='styleguide__palette__name'>{name}</h2>
      <div className={`styleguide__palette__color styleguide__palette__color--${name}`} style={{background: hex}}></div>
      <span className='styleguide__palette__hex'>Hex: <code className='styleguide__palette__code'>{hex}</code></span>
    </div>
  );
}

const Palette = ({primary, secondary}: Props) => (
  <div>
    <div className='styleguide__palette__section'>
      <h2 className='styleguide__palette__heading'>Primary colours</h2>
      {primary.map(color => colorBlock(color.name, color.hex))}
    </div>
    <div className='styleguide__palette__section'>
      <h2 className='styleguide__palette__heading'>Secondary colours</h2>
      {secondary.map(color => colorBlock(color.name, color.hex))}
    </div>
  </div>
);

export default Palette;
