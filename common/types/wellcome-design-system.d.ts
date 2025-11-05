declare module '@wellcometrust/wellcome-design-system/theme' {
  export type ResponsiveSpaceValue = {
    default: string;
    sm: string;
    md: string;
  };

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
    spacing: {
      static: {
        'space.0': string;
        'space.050': string;
        'space.075': string;
        'space.100': string;
        'space.150': string;
        'space.200': string;
        'space.300': string;
        'space.400': string;
        'space.600': string;
        'space.800': string;
        'space.900': string;
        'space.1200': string;
      };
      responsive: {
        'space.2xs': ResponsiveSpaceValue;
        'space.xs': ResponsiveSpaceValue;
        'space.sm': ResponsiveSpaceValue;
        'space.md': ResponsiveSpaceValue;
        'space.lg': ResponsiveSpaceValue;
        'space.xl': ResponsiveSpaceValue;
        'space.2xl': ResponsiveSpaceValue;
      };
    };
    'letter-spacing': Record<string, string>;
    'line-height': Record<string, string>;
    'text-transform': Record<string, string>;
    opacity: Record<string, string>;
    grid: Record<string, unknown>;
    'border-radius': Record<string, string>;
    color: Record<string, unknown>;
  };
}
