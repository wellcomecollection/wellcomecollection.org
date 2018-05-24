
type Props = {|
  title: string,
  latitude: number,
  longitude: number
|}

const Map = ({title, latitude, longitude}: Props) => (
  <div className='js-map map' data-title={title} data-latitude={latitude} data-longitude={longitude}></div>
);

export default Map;
