const SvgMinus = props => (
  <svg width={24} height={24} {...props}>
    <g fill="none" fillRule="evenodd">
      <path fill="#FFF" d="M-360-234h504v450h-504z" />
      <path d="M0 0h24v24H0z" />
      <path
        fill="#000"
        fillRule="nonzero"
        d="M20.49 11h-17a1 1 0 1 0 0 2h17a1 1 0 0 0 0-2z"
      />
    </g>
  </svg>
);

export default SvgMinus;
