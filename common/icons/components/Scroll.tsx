import { SVGProps, FunctionComponent } from 'react';
type Props = SVGProps<SVGSVGElement>;

const SvgScroll: FunctionComponent<Props> = props => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
    <path
      className="icon__shape"
      d="M19.67 1H6.33a3 3 0 0 0-3 3v13.67h-1a1 1 0 0 0-1 1V20a3 3 0 0 0 3 3h11.34a3 3 0 0 0 3-3V6.33h3a1 1 0 0 0 1-1V4a3 3 0 0 0-3-3zM3.33 20v-.33h9.33V20a3 3 0 0 0 .18 1H4.33a1 1 0 0 1-1-1zm12.33 1a1 1 0 0 1-1-1v-1.33a1 1 0 0 0-1-1H5.33V4a1 1 0 0 1 1-1h10.51a3 3 0 0 0-.18 1v16a1 1 0 0 1-.99 1zm5-16.67h-2V4a1 1 0 1 1 2 0z"
    />
    <path
      className="icon__shape"
      d="M7 5.67h8v2H7zM7 9.33h8v2H7zM7 13h8v2H7z"
    />
  </svg>
);

export default SvgScroll;
