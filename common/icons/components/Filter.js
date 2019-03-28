const SvgFilter = props => (
  <svg width={24} height={24} {...props}>
    <g fill="none" fillRule="evenodd">
      <path fill="#FFF" d="M-24-192h504v450H-24z" />
      <path d="M0 0h24v24H0z" />
      <path
        fill="#000"
        fillRule="nonzero"
        d="M3 6.26h6.28a2 2 0 0 0 3.44 0H21a1 1 0 0 0 0-2h-8.28a2 2 0 0 0-3.44 0H3a1 1 0 1 0 0 2zm18 5H7.72a2 2 0 0 0-3.44 0H3a1 1 0 1 0 0 2h1.28a2 2 0 0 0 3.44 0H21a1 1 0 0 0 0-2zm0 7h-3.28a2 2 0 0 0-3.44 0H3a1 1 0 0 0 0 2h11.28a2 2 0 0 0 3.44 0H21a1 1 0 0 0 0-2z"
      />
    </g>
  </svg>
);

export default SvgFilter;
