import { IconSvg } from '../types';

const SvgPicture: IconSvg = props => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
    <path
      className="icon__shape"
      fill="currentColor"
      d="M19.33 6.67h-2l-4-4.09a1.33 1.33 0 0 0-2.65 0l-4 4.09h-2a3 3 0 0 0-3 3V19a3 3 0 0 0 3 3h14.65a3 3 0 0 0 3-3V9.67a3 3 0 0 0-3-3zm-8-2.85a1.29 1.29 0 0 0 1.34 0l2.76 2.85H8.57zM4.67 8.67h14.66a1 1 0 0 1 1 1v7.82l-2-2a2.17 2.17 0 0 0-3.06 0l-1.13 1.13-4.3-4.29a2.84 2.84 0 0 0-4 0l-2.17 2.16V9.67a1 1 0 0 1 1-1zM19.33 20H4.67a1 1 0 0 1-1-1v-2.15L7 13.5a1.2 1.2 0 0 1 1.65 0l4.46 4.5a1.5 1.5 0 0 0 2.12 0l1.25-1.25a.52.52 0 0 1 .71 0l2.92 2.92a1 1 0 0 1-.78.33z"
    />
    <circle
      className="icon__shape"
      fill="currentColor"
      cx={16.33}
      cy={11.67}
      r={1.67}
    />
  </svg>
);

export default SvgPicture;
