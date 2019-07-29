import { Slider, Rail, Handles, Tracks, Ticks } from 'react-compound-slider';
import theme from '@weco/common/views/themes/default';

const KeyboardHandle = ({
  domain: [min, max],
  handle: { id, value, percent },
  disabled,
  getHandleProps,
}) => {
  return (
    <button
      type="button"
      role="slider"
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      style={{
        left: `${percent}%`,
        position: 'absolute',
        transform: 'translate(-50%, 0)',
        borderRadius: '50%',
        backgroundColor: disabled ? '#666' : 'black',
        zIndex: 2,
        width: 24,
        height: 24,
        cursor: 'pointer',
      }}
      {...getHandleProps(id)}
    >
      <span
        style={{
          display: 'block',
          position: 'absolute',
          transform: 'translate(-50%, -36px)',
        }}
      >
        {value}
      </span>
    </button>
  );
};

const Track = ({ source, target, getTrackProps }) => {
  // your own track component
  return (
    <div
      style={{
        position: 'absolute',
        height: 10,
        zIndex: 1,
        marginTop: 6,
        backgroundColor: `${theme.colors.green}`,
        borderRadius: 5,
        cursor: 'pointer',
        left: `${source.percent}%`,
        width: `${target.percent - source.percent}%`,
      }}
      {...getTrackProps()} // this will set up events if you want it to be clickeable (optional)
    />
  );
};

const sliderStyle = {
  // Give the slider some width
  position: 'relative',
  width: '100%',
  height: 80,
};

const railStyle = {
  position: 'absolute',
  width: '100%',
  height: 10,
  marginTop: 6,
  borderRadius: 5,
  backgroundColor: `${theme.colors.green}`,
  opacity: 0.3,
};

const DateSlider = ({ values, updateTo, updateFrom, form }) => {
  const domain = { to: 0, from: 2100 };
  return (
    <div style={{ marginTop: '30px' }}>
      <Slider
        rootStyle={sliderStyle}
        domain={[domain.to, domain.from]}
        step={100}
        mode={2}
        values={[values.to || domain.to, values.from || domain.from]}
        onUpdate={values => {
          updateFrom(values[0]);
          updateTo(values[1]);
        }}
        // onChange={values => {
        //   form && form.current && form.current.click();
        // }}
      >
        <div style={railStyle} />
        <Rail>
          {(
            { getRailProps } // adding the rail props sets up events on the rail
          ) => <div style={railStyle} {...getRailProps()} />}
        </Rail>
        <Handles>
          {({ handles, getHandleProps }) => (
            <div className="slider-handles">
              {handles.map(handle => (
                <div key={handle.id}>
                  <KeyboardHandle
                    handle={handle}
                    domain={[0, 2020]}
                    getHandleProps={getHandleProps}
                    disabled={false}
                  />
                </div>
              ))}
            </div>
          )}
        </Handles>
        <Tracks right={false}>
          {({ tracks, getTrackProps }) => (
            <div className="slider-tracks">
              {tracks.map(({ id, source, target }) => (
                <Track
                  key={id}
                  source={source}
                  target={target}
                  getTrackProps={getTrackProps}
                />
              ))}
            </div>
          )}
        </Tracks>
      </Slider>
    </div>
  );
};

export default DateSlider;
