const SvgChevron = props => (
  <svg width={24} height={24} {...props}>
    <g fill="none" fillRule="evenodd">
      <path fill="#FFF" d="M-120-108h504v450h-504z" />
      <path d="M0 0h24v24H0z" />
      <path
        fill="#000"
        fillRule="nonzero"
        d="M17.8 9.45a1 1 0 0 0-1.41 0L12 13.87 7.56 9.45a1 1 0 1 0-1.41 1.41L11.27 16a1 1 0 0 0 1.41 0l5.12-5.12a1 1 0 0 0 0-1.43z"
      />
    </g>
  </svg>
);

export default SvgChevron;
