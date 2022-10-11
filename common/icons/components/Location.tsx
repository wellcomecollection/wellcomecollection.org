import { IconSvg } from '../types';

const SvgLocation: IconSvg = props => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
    <g
      className="icon__shape"
      fill="currentColor"
      fillRule="nonzero"
      transform="translate(4 1)"
    >
      <circle cx={8} cy={8.14} r={2} />
      <path d="M8 .14a8 8 0 0 0-8 8c0 3.77 5 14 8 14s8-10.23 8-14a8 8 0 0 0-8-8zm0 20c-1.49-.56-6-8.51-6-12a6 6 0 1 1 12 0c0 3.46-4.51 11.41-6 11.99v.01z" />
    </g>
  </svg>
);

export default SvgLocation;
