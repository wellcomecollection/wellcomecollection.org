const SvgListView = props => (
  <svg width={24} height={24} {...props}>
    <g fill="none" fillRule="evenodd">
      <path fill="#FFF" d="M-120-234h504v450h-504z" />
      <path d="M0 0h24v24H0z" />
      <g fill="#000" fillRule="nonzero" transform="translate(2 3)">
        <path d="M7 3.53h12a1 1 0 0 0 0-2H7a1 1 0 1 0 0 2zm12 5H7a1 1 0 1 0 0 2h12a1 1 0 0 0 0-2zm0 7H7a1 1 0 0 0 0 2h12a1 1 0 0 0 0-2z" />
        <circle cx={2.01} cy={16.53} r={2} />
        <circle cx={2.01} cy={9.53} r={2} />
        <circle cx={2.01} cy={2.53} r={2} />
      </g>
    </g>
  </svg>
);

export default SvgListView;
