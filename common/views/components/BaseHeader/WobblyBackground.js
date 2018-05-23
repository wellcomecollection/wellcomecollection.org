// @flow
const WobblyBackground = () => (
  <div className='row relative'>
    <div className='absolute overflow-hidden full-width bg-cream' style={{
      top: 0,
      height: '50vw',
      maxHeight: '66vh',
      zIndex: -1
    }}>
      <div className='absolute full-width' style={{ bottom: 0 }}>
        <div className='wobbly-edge wobbly-edge--white js-wobbly-edge'
          data-is-valley='true'
          data-max-intensity='100'>
        </div>
      </div>
    </div>
  </div>
);

export default WobblyBackground;
