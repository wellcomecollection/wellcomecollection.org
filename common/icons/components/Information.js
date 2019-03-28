const SvgInformation = props => (
  <svg width={24} height={24} {...props}>
    <g fill="none" fillRule="evenodd">
      <path fill="#FFF" d="M-360-192h504v450h-504z" />
      <path d="M0 0h24v24H0z" />
      <g fill="#000" fillRule="nonzero" transform="translate(8 3)">
        <path d="M6.25 15.34H5V8.07a1 1 0 0 0-1-1H1.75a1 1 0 1 0 0 2H3v6.26H1.75a1 1 0 0 0 0 2h4.5a1 1 0 0 0 0-2v.01z" />
        <circle cx={4} cy={2.79} r={2.13} />
      </g>
    </g>
  </svg>
);

export default SvgInformation;
