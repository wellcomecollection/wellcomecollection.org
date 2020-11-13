declare module '@segment/snippet' {
  type Options = {
    apiKey: string;
    page: boolean;
  };

  export function max(opts: Options): string;
  export function min(opts: Options): string;
}
