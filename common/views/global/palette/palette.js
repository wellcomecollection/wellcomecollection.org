import React from 'react';

class Palette extends React.Component {
  colorBlock(name, hex) {
    return (
      <div className='styleguide__palette__block'>
        <h2 className='styleguide__palette__name'>{name}</h2>
        <div className={`styleguide__palette__color styleguide__palette__color--${name}`} style={{background: hex}}></div>
        <span className='styleguide__palette__hex'>Hex: <code className='styleguide__palette__code'>{hex}</code></span>
      </div>
    );
  }
  render() {
    return (
      <div>
        <div className='styleguide__palette__section'>
          <h2 className='styleguide__palette__heading'>Primary colours</h2>
          {this.props.primary.map(color => this.colorBlock(color.name, color.hex))}
        </div>
        <div className='styleguide__palette__section'>
          <h2 className='styleguide__palette__heading'>Secondary colours</h2>
          {this.props.secondary.map(color => this.colorBlock(color.name, color.hex))}
        </div>
      </div>
    );
  }
};

export default Palette;
