const SvgTree = props => (
  <svg width={24} height={24} {...props}>
    <g fill="none" fillRule="evenodd">
      <path fill="#FFF" d="M-168-360h504V90h-504z" />
      <path d="M0 0h24v24H0z" />
      <path
        fill="#000"
        fillRule="nonzero"
        d="M21 18.58V15.3a3 3 0 0 0-3-3h-5v-2.14a4 4 0 1 0-2 0v2.14H6a3 3 0 0 0-3 3v3.28a2 2 0 1 0 2 0V15.3a1 1 0 0 1 1-1h5v4.28a2 2 0 1 0 2 0V14.3h5a1 1 0 0 1 1 1v3.28a2 2 0 1 0 2 0zM10 6.3a2 2 0 1 1 4 0 2 2 0 0 1-4 0z"
      />
    </g>
  </svg>
);

export default SvgTree;
