export default ({fonts}) => (
  <div>
    {fonts.map(font => (
      <div className='styleguide__font'>
        <h2 className='styleguide__font__name'>{font.name}</h2>
        <p className={`styleguide__font__example--${font.name}`}>{font.example}</p>
        <dl className='styleguide__font__properties'>
          <dt className='styleguide__font__property'>Font-size:</dt>
          <dd className='styleguide__font__value'>{font.size}</dd>
          <dt className='styleguide__font__property'>Letter-spacing:</dt>
          <dd className='styleguide__font__value'>{font.spacing}</dd>
          <dt className='styleguide__font__property'>Line-height:</dt>
          <dd className='styleguide__font__value'>{font.lineHeight}</dd>
        </dl>
        <h2 className='styleguide__font__usage-title'>Usage:</h2>
        <p className='styleguide__font__usage-text'>{font.usage}</p>
      </div>
    ))}
  </div>
);
