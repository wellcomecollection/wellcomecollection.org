function colorBlock(name, hex) {
  return (
    <div className='styleguide__palette__block'>
      <h2 className='styleguide__palette__name'>{name}</h2>
      <div className={`styleguide__palette__color styleguide__palette__color--${name}`} style={{background: hex}}></div>
      <span className='styleguide__palette__hex'>Hex: <code className='styleguide__palette__code'>{hex}</code></span>
    </div>
  );
}

export default ({primary, secondary}) => (
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
