const SvgCalendar = props => (
  <svg width={24} height={24} {...props}>
    <g fill="none" fillRule="evenodd">
      <path fill="#FFF" d="M-168-66h504v450h-504z" />
      <path d="M0 0h24v24H0z" />
      <path
        fill="#000"
        fillRule="nonzero"
        d="M18 4.5V3a1 1 0 0 0-2 0v1.5H8V3a1 1 0 1 0-2 0v1.5a4 4 0 0 0-4 4v11a4 4 0 0 0 4 4h12a4 4 0 0 0 4-4v-11a4 4 0 0 0-4-4zm-14 4a2 2 0 0 1 2-2V8a1 1 0 1 0 2 0V6.5h8V8a1 1 0 0 0 2 0V6.5a2 2 0 0 1 2 2V10H4V8.5zm16 11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V12h16v7.5z"
      />
      <path
        fill="#000"
        fillRule="nonzero"
        d="M5.43 17.29h2v2h-2v-2zm3.48-3.41h2v2h-2v-2zm0 3.41h2v2h-2v-2zm3.47-3.41h2v2h-2v-2zm0 3.41h2v2h-2v-2zm3.48-3.41h2v2h-2v-2z"
      />
    </g>
  </svg>
);

export default SvgCalendar;
