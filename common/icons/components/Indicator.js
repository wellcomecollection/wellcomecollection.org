const SvgIndicator = props => (
  <svg viewBox="0 0 24 24" {...props}>
    <g>
      <circle
        cx={10}
        cy={10}
        r={10}
        className="icon__shape"
        fillRule="nonzero"
        transform="translate(2 2)"
      />
    </g>
  </svg>
);

export default SvgIndicator;
