const SvgListView = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
    <g className="icon__shape" fillRule="nonzero" transform="translate(2 3)">
      <path d="M7 3.53h12a1 1 0 0 0 0-2H7a1 1 0 1 0 0 2zm12 5H7a1 1 0 1 0 0 2h12a1 1 0 0 0 0-2zm0 7H7a1 1 0 0 0 0 2h12a1 1 0 0 0 0-2z" />
      <circle cx={2.01} cy={16.53} r={2} />
      <circle cx={2.01} cy={9.53} r={2} />
      <circle cx={2.01} cy={2.53} r={2} />
    </g>
  </svg>
);

export default SvgListView;
