export {};

declare global {
  interface Window {
    // eslint-disable-next-line
    dataLayer: Record<string, any>[] | undefined;

    // CivicUK
    CookieControl: {
      open: () => void;
    };
  }

  // Prefixed fullscreen APIs, still required for Safari
  interface Document {
    webkitFullscreenElement?: Element | null;
    webkitExitFullscreen?: () => void;
  }

  interface HTMLElement {
    webkitRequestFullscreen?: () => void;
  }
}
