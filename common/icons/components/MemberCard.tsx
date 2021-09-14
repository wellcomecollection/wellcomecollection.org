import { SVGProps, FunctionComponent } from 'react';
type Props = SVGProps<SVGSVGElement>;

const SvgMemberCard: FunctionComponent<Props> = props => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
    <path
      className="icon__shape"
      fillRule="nonzero"
      d="M20 3.43H4a4 4 0 0 0-4 4v10a4 4 0 0 0 4 4h16a4 4 0 0 0 4-4v-10a4 4 0 0 0-4-4zm2 14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-10a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10zm-3.2-6.71h-4.5a1 1 0 0 0 0 2h4.5a1 1 0 0 0 0-2zm-8.62 2.15a3.18 3.18 0 1 0-3.86 0A4.53 4.53 0 0 0 3.71 17a1 1 0 0 0 1 1h7.07a1 1 0 0 0 1-1 4.53 4.53 0 0 0-2.6-4.13zM8.25 9.18a1.18 1.18 0 1 1 0 2.36 1.18 1.18 0 0 1 0-2.36zM5.92 16a2.54 2.54 0 0 1 4.66 0H5.92zM18.8 7.18h-4.5a1 1 0 0 0 0 2h4.5a1 1 0 0 0 0-2z"
    />
  </svg>
);

export default SvgMemberCard;
