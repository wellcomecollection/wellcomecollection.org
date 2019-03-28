const SvgIndicator = props => (
  <svg width={24} height={24} {...props}>
    <g fill="none" fillRule="evenodd">
      <path fill="#FFF" d="M-408-318H96v450h-504z" />
      <path d="M0 0h24v24H0z" />
      <circle
        cx={10}
        cy={10}
        r={10}
        fill="#000"
        fillRule="nonzero"
        transform="translate(2 2)"
      />
    </g>
  </svg>
);

export default SvgIndicator;
