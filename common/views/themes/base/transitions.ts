export const transitions = `
  @view-transition {
    navigation: auto;
  }

  @keyframes out {
    from {
      transform: translateX(0%)
    }

    to {
      transform: translateX(100%)
    }
  }

  @keyframes in {
    from {
      transform: translateX(-100%)
    }

    to {
      transform: translateX(0%)
    }
  }

  ::view-transition-old(player-previous) {
    animation: 200ms out ease-in;
  }
  ::view-transition-new(player-previous) {
    animation: 200ms in ease-in;
  }

  ::view-transition-old(player-next) {
    animation: 200ms out ease-in reverse;
  }
  ::view-transition-new(player-next) {
    animation: 200ms in ease-in reverse;
  }

  @media (prefers-reduced-motion: reduce) {
	  * {
      view-transition-name: none !important;
    }
  }
`;
