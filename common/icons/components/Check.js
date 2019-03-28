const SvgCheck = props => (
  <svg width={24} height={24} {...props}>
    <g fill="none" fillRule="evenodd">
      <path fill="#FFF" d="M-72-108h504v450H-72z" />
      <path d="M0 0h24v24H0z" />
      <path
        fill="#000"
        fillRule="nonzero"
        d="M21.13 6.64a1 1 0 0 0-1.41 0L10 16.34l-5-5a1 1 0 0 0-1.41 1.41l5.67 5.67a1 1 0 0 0 1.41 0l10.4-10.4a1 1 0 0 0 .06-1.38z"
      />
    </g>
  </svg>
);

export default SvgCheck;
