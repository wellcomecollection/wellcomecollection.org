import { IconSvg } from '../types';

const SvgCalendar: IconSvg = props => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
    <path
      className="icon__shape"
      fillRule="nonzero"
      d="M18 4.5V3a1 1 0 0 0-2 0v1.5H8V3a1 1 0 1 0-2 0v1.5a4 4 0 0 0-4 4v11a4 4 0 0 0 4 4h12a4 4 0 0 0 4-4v-11a4 4 0 0 0-4-4zm-14 4a2 2 0 0 1 2-2V8a1 1 0 1 0 2 0V6.5h8V8a1 1 0 0 0 2 0V6.5a2 2 0 0 1 2 2V10H4V8.5zm16 11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V12h16v7.5z"
    />
    <path
      className="icon__shape"
      fillRule="nonzero"
      d="M5.43 17.29h2v2h-2v-2zm3.48-3.41h2v2h-2v-2zm0 3.41h2v2h-2v-2zm3.47-3.41h2v2h-2v-2zm0 3.41h2v2h-2v-2zm3.48-3.41h2v2h-2v-2z"
    />
  </svg>
);

export default SvgCalendar;
