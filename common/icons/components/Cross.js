const SvgCross = props => (
  <svg width={24} height={24} {...props}>
    <g fill="none" fillRule="evenodd">
      <path fill="#FFF" d="M-72-150h504v450H-72z" />
      <path d="M0 0h24v24H0z" />
      <path
        fill="#000"
        fillRule="nonzero"
        d="M18.7 17.3L13.4 12l5.3-5.3c.4-.4.4-1 0-1.4-.4-.4-1-.4-1.4 0L12 10.6 6.7 5.3c-.4-.4-1-.4-1.4 0-.4.4-.4 1 0 1.4l5.3 5.3-5.3 5.3c-.4.4-.4 1 0 1.4.4.4 1 .4 1.4 0l5.3-5.3 5.3 5.3c.4.4 1 .4 1.4 0 .4-.4.4-1 0-1.4z"
      />
    </g>
  </svg>
);

export default SvgCross;
