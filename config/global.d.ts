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
}
