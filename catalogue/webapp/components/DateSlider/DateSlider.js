import { Slider, Rail, Handles, Tracks } from 'react-compound-slider';
import theme from '@weco/common/views/themes/default';
import { useState, useEffect } from 'react';

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
        backgroundColor: theme.colors.green,
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
  backgroundColor: theme.colors.green,
};

function ISODateFromYear(year, start) {
  let fullDate;
  if (start) {
    fullDate = year && new Date(year.toString());
  } else {
    fullDate = year && new Date(`${year.toString()}-12-31`);
  }
  return fullDate && fullDate.toISOString('YYYY-MM-DD').split('T')[0];
}
const DateSlider = ({ startValues, updateTo, updateFrom, formButton }) => {
  const [fromValue, setFromValue] = useState(
    ISODateFromYear(startValues.from, true)
  );
  const [toValue, setToValue] = useState(
    ISODateFromYear(startValues.to, false)
  );

  useEffect(() => {
    updateFrom(fromValue);
  }, [fromValue]);
  useEffect(() => {
    updateTo(toValue);
  }, [toValue]);

  const domain = { from: 1780, to: 2020 };
  return (
    <div style={{ marginTop: '42px' }}>
      <Slider
        rootStyle={sliderStyle}
        domain={[domain.from, domain.to]}
        step={10}
        mode={2}
        values={[startValues.from || domain.from, startValues.to || domain.to]}
        onUpdate={values => {
          setFromValue(ISODateFromYear(values[0], true));
          setToValue(ISODateFromYear(values[1], true));
        }}
        onChange={values => {
          setFromValue(ISODateFromYear(values[0], true));
          setToValue(ISODateFromYear(values[1], true));
          formButton && formButton.current && formButton.current.click();
        }}
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
