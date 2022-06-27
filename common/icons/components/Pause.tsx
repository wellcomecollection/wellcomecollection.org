import { IconSvg } from '../types';

const SvgPause: IconSvg = props => (
  <svg viewBox="0 0 24 24" {...props}>
    <path
      className="icon__shape"
      d="M19.4,3.6H16c-0.6,0-1,0.4-1,1V19c0,0.6,0.4,1,1,1h3.4c0.6,0,1-0.4,1-1V4.6C20.4,4.1,20,3.6,19.4,3.6z"
    />
    <path
      className="icon__shape"
      d="M8.5,3.6H5.1c-0.6,0-1,0.4-1,1V19c0,0.6,0.4,1,1,1h3.4c0.6,0,1-0.4,1-1V4.6C9.5,4.1,9.1,3.6,8.5,3.6z"
    />
  </svg>
);

export default SvgPause;
