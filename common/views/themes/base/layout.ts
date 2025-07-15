export const layout = `
* {
  &,
  &::before,
  &::after {
    box-sizing: border-box;
  }
}

@supports selector(:has(a)) {
  body:has(dialog[open]),
  body:has([data-lock-scroll="true"]) {
    margin: 0;
    height: 100vh;
    overflow: hidden;
  }

  html:has([data-scroll-smooth="true"]) {
    @media (prefers-reduced-motion: no-preference) {
      scroll-behavior: smooth;
    }
  }
}
`;
