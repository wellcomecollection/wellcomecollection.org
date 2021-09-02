const SvgFilter = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72" {...props}>
    <path
      className="icon__shape"
      d="M44,10a12,12,0,0,0-11.6,9H11a3,3,0,0,0,0,6H32.4A12,12,0,1,0,44,10Zm0,18a6,6,0,1,1,6-6A6,6,0,0,1,44,28Z"
    />
    <path
      className="icon__shape"
      d="M61,25H56a3,3,0,0,1,0-6h5a3,3,0,0,1,0,6Z"
    />
    <path
      className="icon__shape"
      d="M61,47H39.6a12,12,0,0,0-23.22,0A3,3,0,0,0,16,47H11a3,3,0,0,0,0,6h5a3,3,0,0,0,.38,0A12,12,0,0,0,39.6,53H61a3,3,0,0,0,0-6ZM28,56a6,6,0,1,1,6-6A6,6,0,0,1,28,56Z"
    />
  </svg>
);

export default SvgFilter;
