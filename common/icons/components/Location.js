const SvgLocation = props => (
  <svg width={24} height={24} {...props}>
    <g fill="none" fillRule="evenodd">
      <path fill="#FFF" d="M-168-234h504v450h-504z" />
      <path d="M0 0h24v24H0z" />
      <g fill="#000" fillRule="nonzero" transform="translate(4 1)">
        <circle cx={8} cy={8.14} r={2} />
        <path d="M8 .14a8 8 0 0 0-8 8c0 3.77 5 14 8 14s8-10.23 8-14a8 8 0 0 0-8-8zm0 20c-1.49-.56-6-8.51-6-12a6 6 0 1 1 12 0c0 3.46-4.51 11.41-6 11.99v.01z" />
      </g>
    </g>
  </svg>
);

export default SvgLocation;
