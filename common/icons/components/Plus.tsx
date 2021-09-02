const SvgPlus = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
    <path
      className="icon__shape"
      fillRule="nonzero"
      d="M20.49 11H13V3.52a1 1 0 0 0-2 0V11H3.51a1 1 0 1 0 0 2H11v7.49a1 1 0 0 0 2 0V13h7.49a1 1 0 0 0 0-2z"
    />
  </svg>
);

export default SvgPlus;
