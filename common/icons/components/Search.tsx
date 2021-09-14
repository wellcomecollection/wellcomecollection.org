import { SVGProps, FunctionComponent } from 'react';
type Props = SVGProps<SVGSVGElement>;

const SvgSearch: FunctionComponent<Props> = props => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
    <path
      className="icon__shape"
      fillRule="nonzero"
      d="M22.6 20.59l-6.25-6.25a7.53 7.53 0 1 0-1.41 1.41L21.19 22a1 1 0 0 0 1.41-1.41zM4.9 9.8a5.5 5.5 0 1 1 5.5 5.5 5.51 5.51 0 0 1-5.5-5.5z"
    />
  </svg>
);

export default SvgSearch;
