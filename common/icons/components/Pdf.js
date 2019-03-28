const SvgPdf = props => (
  <svg width={24} height={24} {...props}>
    <g fill="none" fillRule="evenodd">
      <path fill="#FFF" d="M-24-276h504v450H-24z" />
      <path d="M0 0h24v24H0z" />
      <path
        fill="#000"
        fillRule="nonzero"
        d="M21.15 5.77l-5-5a1 1 0 0 0-.71-.29h-5a4 4 0 0 0-4 4 4 4 0 0 0-4 4v11a4 4 0 0 0 4 4h7a4 4 0 0 0 4-4 4 4 0 0 0 4-4v-9a1 1 0 0 0-.29-.71zm-1.7 1.12v.59h-2a2 2 0 0 1-2-2V2.89l4 4zm-6 14.59h-7a2 2 0 0 1-2-2v-11a2 2 0 0 1 2-2v9a4 4 0 0 0 4 4h5a2 2 0 0 1-2 2zm4-4h-7a2 2 0 0 1-2-2v-11a2 2 0 0 1 2-2h3v3a4 4 0 0 0 4 4h2v6a2 2 0 0 1-2 2z"
      />
    </g>
  </svg>
);

export default SvgPdf;
