import { SVGProps, FunctionComponent } from 'react';
type Props = SVGProps<SVGSVGElement>;

const SvgTwitter: FunctionComponent<Props> = props => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
    <path
      className="icon__shape"
      fillRule="nonzero"
      d="M23.39 6.06a9 9 0 0 1-2.6.71 4.54 4.54 0 0 0 2-2.5 9.06 9.06 0 0 1-2.87 1.1 4.53 4.53 0 0 0-7.71 4.13 12.85 12.85 0 0 1-9.35-4.73 4.53 4.53 0 0 0 1.4 6 4.51 4.51 0 0 1-2-.57v.06a4.53 4.53 0 0 0 3.63 4.44 4.53 4.53 0 0 1-2 .08A4.53 4.53 0 0 0 8 18a9.08 9.08 0 0 1-5.62 1.94 9.18 9.18 0 0 1-1.08-.06 12.81 12.81 0 0 0 6.94 2A12.79 12.79 0 0 0 21.14 9v-.59a9.19 9.19 0 0 0 2.25-2.35z"
    />
  </svg>
);

export default SvgTwitter;
