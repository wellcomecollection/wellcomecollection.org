const SvgEmbed = props => (
  <svg width={24} height={24} {...props}>
    <g fill="none" fillRule="evenodd">
      <path fill="#FFF" d="M-360-150h504v450h-504z" />
      <path d="M0 0h24v24H0z" />
      <path
        fill="#000"
        fillRule="nonzero"
        d="M6.59 7.5a1 1 0 0 0-1.41 0L1.4 11.28a1 1 0 0 0 0 1.41l3.78 3.78a1 1 0 0 0 1.41-1.41L3.52 12l3.07-3.08a1 1 0 0 0 0-1.42zm15.78 3.78L18.59 7.5a1 1 0 0 0-1.41 1.41L20.25 12l-3.07 3.07a1 1 0 1 0 1.41 1.41l3.78-3.78a1 1 0 0 0 0-1.41v-.01zm-7.49-8.85a1 1 0 0 0-1.32.66L7.77 20.62a1.051 1.051 0 0 0 2 .65l5.8-17.53a1 1 0 0 0-.69-1.31z"
      />
    </g>
  </svg>
);

export default SvgEmbed;
