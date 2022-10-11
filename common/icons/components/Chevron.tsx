import { IconSvg } from '../types';

const SvgChevron: IconSvg = props => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
    <path
      className="icon__shape"
      fill="currentColor"
      fillRule="nonzero"
      d="M17.8 9.45a1 1 0 0 0-1.41 0L12 13.87 7.56 9.45a1 1 0 1 0-1.41 1.41L11.27 16a1 1 0 0 0 1.41 0l5.12-5.12a1 1 0 0 0 0-1.43z"
    />
  </svg>
);

export default SvgChevron;
