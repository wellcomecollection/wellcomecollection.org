import { SVGProps, FunctionComponent } from 'react';
type Props = SVGProps<SVGSVGElement>;

const SvgWebsite: FunctionComponent<Props> = props => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
    <g className="icon__shape" fillRule="nonzero">
      <path d="M17.8 3.2h-12a4 4 0 0 0-4 4v10a4 4 0 0 0 4 4h12a4 4 0 0 0 4-4v-10a4 4 0 0 0-4-4zm-14 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2.3h-16V7.2zm16 10a2 2 0 0 1-2 2h-12a2 2 0 0 1-2-2v-5.7h16v5.7z" />
      <path d="M7.51 6.69a1 1 0 0 0-1.41 0 .87.87 0 0 0-.22.31 1 1 0 0 0-.08.39 1 1 0 0 0 1 .99 1 1 0 0 0 .38-.07.92.92 0 0 0 .33-.22 1 1 0 0 0 .21-.32.84.84 0 0 0 .08-.37 1 1 0 0 0-.29-.71zm9.29-.29h-7a1 1 0 1 0 0 2h7a1 1 0 0 0 0-2z" />
    </g>
  </svg>
);

export default SvgWebsite;
