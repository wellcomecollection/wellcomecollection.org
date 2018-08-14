// @flow
const WobblyBackground = () => (
  <div className='absolute overflow-hidden full-width bg-cream' style={{
    top: 0,
    zIndex: -1,
    bottom: '100px'
  }}>
    <div className='absolute full-width' style={{ bottom: 0 }}>
      <div className='wobbly-edge wobbly-edge--white js-wobbly-edge'
        data-is-valley='true'
        data-max-intensity='100'>
      </div>
    </div>
  </div>
);

export default WobblyBackground;
