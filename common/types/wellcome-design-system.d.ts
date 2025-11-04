declare module '@wellcometrust/wellcome-design-system/theme' {
  export const theme: {
    breakpoints: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
    font: {
      size: {
        'f-3': string;
        'f-2': string;
        'f-1': string;
        f0: string;
        f1: string;
        f2: string;
        f3: string;
        f4: string;
        f5: string;
        f6: string;
      };
      family: {
        brand: string;
        sans: string;
        mono: string;
      };
      weight: {
        light: string;
        regular: string;
        medium: string;
        semibold: string;
        bold: string;
      };
    };
    spacing: Record<string, unknown>;
    'letter-spacing': Record<string, string>;
    'line-height': Record<string, string>;
    'text-transform': Record<string, string>;
    opacity: Record<string, string>;
    grid: Record<string, unknown>;
    'border-radius': Record<string, string>;
    color: Record<string, unknown>;
  };
}
