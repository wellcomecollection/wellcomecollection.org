import { IconSvg } from '../types';

const SvgIndicator: IconSvg = props => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
    <g>
      <circle
        cx={10}
        cy={10}
        r={10}
        className="icon__shape"
        fill="currentColor"
        fillRule="nonzero"
        transform="translate(2 2)"
      />
    </g>
  </svg>
);

export default SvgIndicator;
