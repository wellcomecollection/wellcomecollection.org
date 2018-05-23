
type Props = {|
  title: string,
  latitude: number,
  longitude: number
|}

const Map = ({title, latitude, longitude}: Props) => (
  <div style={{position: 'relative', width: '100%', paddingTop: '50%'}} className='js-map' data-title={title} data-latitude={latitude} data-longitude={longitude}></div>
);

export default Map;
