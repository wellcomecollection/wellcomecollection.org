import { SVGProps, FunctionComponent } from 'react';
type Props = SVGProps<SVGSVGElement>;

const SvgAttatch: FunctionComponent<Props> = props => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
    <path
      className="icon__shape"
      fillRule="nonzero"
      d="M21.57 10.13l-5.32-5.32a1 1 0 0 0-1.41 0l-7.63 7.63a3.083 3.083 0 0 0 4.36 4.36l5-5a1 1 0 0 0-1.41-1.41l-5 5a1.082 1.082 0 0 1-1.53-1.53l6.93-6.93 3.9 3.9-7.29 7.28a4.44 4.44 0 0 1-6.28-6.28l8-8a1 1 0 0 0-1.41-1.41l-8 8a6.442 6.442 0 1 0 9.11 9.11l8-8a1 1 0 0 0-.02-1.4z"
    />
  </svg>
);

export default SvgAttatch;
