import { IconSvg } from '../types';

const SvgCollapse: IconSvg = props => (
  <svg viewBox="0 0 24 24" {...props}>
    <path
      className="icon__shape"
      d="M7.4,20.6h1.9v-5c0-0.6-0.4-1-1-1h-5v1.9h4L7.4,20.6z"
    />
    <path
      className="icon__shape"
      d="M8.4,9.3c0.6,0,1-0.4,1-1v-5h-2v4h-4v2H8.4z"
    />
    <path
      className="icon__shape"
      d="M16.6,20.6v-4h4v-2h-5c-0.6,0-1,0.4-1,1v5L16.6,20.6z"
    />
    <path
      className="icon__shape"
      d="M16.6,3.4h-1.9v5c0,0.6,0.4,1,1,1h5v-2h-4L16.6,3.4z"
    />
  </svg>
);

export default SvgCollapse;
