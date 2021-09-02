const SvgEmbed = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
    <path
      className="icon__shape"
      fillRule="nonzero"
      d="M6.59 7.5a1 1 0 0 0-1.41 0L1.4 11.28a1 1 0 0 0 0 1.41l3.78 3.78a1 1 0 0 0 1.41-1.41L3.52 12l3.07-3.08a1 1 0 0 0 0-1.42zm15.78 3.78L18.59 7.5a1 1 0 0 0-1.41 1.41L20.25 12l-3.07 3.07a1 1 0 1 0 1.41 1.41l3.78-3.78a1 1 0 0 0 0-1.41v-.01zm-7.49-8.85a1 1 0 0 0-1.32.66L7.77 20.62a1.051 1.051 0 0 0 2 .65l5.8-17.53a1 1 0 0 0-.69-1.31z"
    />
  </svg>
);

export default SvgEmbed;
