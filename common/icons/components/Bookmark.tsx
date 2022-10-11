import { IconSvg } from '../types';

const SvgBookmark: IconSvg = props => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
    <path
      className="icon__shape"
      fill="currentColor"
      fillRule="nonzero"
      d="M17.587 2h-12a2.81 2.81 0 0 0-2.58 3v15a1.87 1.87 0 0 0 1.72 2 1.52 1.52 0 0 0 .88-.29l6-4.71 6 4.71c.256.186.564.287.88.29a1.87 1.87 0 0 0 1.72-2V5a2.81 2.81 0 0 0-2.62-3zm.58 17.64l-5.35-4.21a2 2 0 0 0-2.47 0l-5.35 4.2V5c0-.6.35-1 .58-1h12c.23 0 .58.4.58 1l.01 14.64z"
    />
  </svg>
);

export default SvgBookmark;
