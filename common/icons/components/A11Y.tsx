import { SVGProps, FunctionComponent } from 'react';
type Props = SVGProps<SVGSVGElement>;

const SvgA11Y: FunctionComponent<Props> = props => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
    <g className="icon__shape" fillRule="nonzero" transform="translate(3 1)">
      <path d="M12.28 16a1 1 0 0 0-1.23.7 4.36 4.36 0 1 1-6.53-4.85 1 1 0 1 0-1.07-1.69A6.36 6.36 0 1 0 13 17.19a1 1 0 0 0-.72-1.19z" />
      <path d="M17.46 18.42l-3.14-5a1 1 0 0 0-.85-.47h-2.73l.88-2.95c.52-1.82.38-3.21-.43-4.13a3.42 3.42 0 0 0-2.94-1l-4 .5a1 1 0 0 0-.54.25L.57 8.42A1 1 0 0 0 1.9 9.91l2.9-2.59L7 7l-2 6.53a1 1 0 0 0 0 .31v.07a1 1 0 0 0 1 1h6.95l2.84 4.57a1.002 1.002 0 0 0 1.7-1.06h-.03zm-7.76-9l-1.05 3.5H7.29l1.81-6a1 1 0 0 1 .58.29c.32.31.32 1.13.02 2.19v.02z" />
      <circle cx={11.41} cy={2.23} r={2.08} />
    </g>
  </svg>
);

export default SvgA11Y;
