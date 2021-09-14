import { SVGProps, FunctionComponent } from 'react';
type Props = SVGProps<SVGSVGElement>;

const SvgPdf: FunctionComponent<Props> = props => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
    <path
      className="icon__shape"
      fillRule="nonzero"
      d="M21.15 5.77l-5-5a1 1 0 0 0-.71-.29h-5a4 4 0 0 0-4 4 4 4 0 0 0-4 4v11a4 4 0 0 0 4 4h7a4 4 0 0 0 4-4 4 4 0 0 0 4-4v-9a1 1 0 0 0-.29-.71zm-1.7 1.12v.59h-2a2 2 0 0 1-2-2V2.89l4 4zm-6 14.59h-7a2 2 0 0 1-2-2v-11a2 2 0 0 1 2-2v9a4 4 0 0 0 4 4h5a2 2 0 0 1-2 2zm4-4h-7a2 2 0 0 1-2-2v-11a2 2 0 0 1 2-2h3v3a4 4 0 0 0 4 4h2v6a2 2 0 0 1-2 2z"
    />
  </svg>
);

export default SvgPdf;
