const SvgEye = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
    <g className="icon__shape" fillRule="nonzero" transform="translate(2 4)">
      <path d="M10 0C4.17 0 0 6 0 8s4 8 10 8 10-6 10-8-4.2-8-10-8zm0 14c-4.76 0-8-5-8-6s3.21-6 8-6 8 5.11 8 6c0 .89-3.24 6-8 6z" />
      <circle cx={9.97} cy={8} r={3} />
    </g>
  </svg>
);

export default SvgEye;
