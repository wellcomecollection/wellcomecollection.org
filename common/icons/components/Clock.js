const SvgClock = props => (
  <svg width={24} height={24} {...props}>
    <g fill="none" fillRule="evenodd">
      <path fill="#FFF" d="M-264-108h504v450h-504z" />
      <path d="M0 0h24v24H0z" />
      <g fill="#000" fillRule="nonzero">
        <path d="M11.9 2.1a10.17 10.17 0 1 0 10.17 10.16C22.059 6.65 17.51 2.106 11.9 2.1zm0 18.33a8.17 8.17 0 1 1 0-16.34 8.17 8.17 0 0 1 0 16.34z" />
        <path d="M15.83 12.06h-3v-4.5a1 1 0 0 0-2 0v5.5a1 1 0 0 0 1 1h4a1 1 0 0 0 0-2z" />
      </g>
    </g>
  </svg>
);

export default SvgClock;
