/**
 * Design tokens for dash webapp
 * Colors, font and radii follow the design system's brand update, as
 * used by the main wellcomecollection.org content app
 * All colors meet WCAG AA contrast requirements (4.5:1 for normal text)
 */

export const tokens = {
  colors: {
    // Core
    white: '#ffffff',
    black: '#111a1c', // neutral.80

    // The menu stays a dark band, in the brand's colours
    header: {
      background: '#223438', // neutral.70
      accent: '#8fc7ff', // blue.30, as the site's nav highlight
    },

    // Primary
    primary: {
      main: '#ffee00', // yellow.30
      dark: '#223438', // neutral.70
      contrast: '#111a1c', // neutral.80, text on yellow
    },

    // Semantic colors
    success: {
      main: '#2a5250', // teal.50
      light: '#e9f5f4', // teal.10
      text: '#2a5250', // teal.50
    },
    warning: {
      // A muted amber, so warnings don't read as red or as bright yellow
      main: '#c4912a',
      light: '#fdf6e3',
      text: '#704c00',
    },
    // The selected star on a starred toggle, dark enough to read as a graphic on white
    star: '#a8740a',
    error: {
      main: '#e72343', // ui.red.40
      light: '#fff0f2', // ui.red.10
      text: '#6c131d', // ui.red.60, darker than main for contrast on light
    },
    info: {
      main: '#0c4783', // blue.60
      light: '#edf6ff', // blue.10
      text: '#0c4783', // blue.60
    },

    // UI colors
    text: {
      primary: '#223438', // neutral.70
      secondary: '#445254', // neutral.60
      disabled: '#8c9593', // neutral.40
    },
    background: {
      default: '#ffffff',
      paper: '#fafbf7', // neutral.05
      section: '#f5f6ee', // neutral.10

      // Sections alternate between this and `section`
      tinted: '#d9e3b3', // green.20
    },
    border: {
      default: '#d2d6d0', // neutral.20
      focus: '#ffee00', // yellow.30
    },

    // Status colors
    status: {
      active: '#2a5250', // teal.50
      inactive: '#8c9593', // neutral.40
    },
  },

  typography: {
    fontFamily: 'Inter, sans-serif',
    fontSize: {
      small: '0.875rem', // 14px
      base: '1rem', // 16px
      large: '1.125rem', // 18px
      h3: '1.25rem', // 20px
      h2: '1.75rem', // 28px
    },
  },

  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },

  borderRadius: {
    small: '0.25rem', // border-radius.sm
    medium: '0.5rem', // border-radius.md
    large: '1rem', // border-radius.lg
    full: '50%',
  },

  focus: {
    outline: '0.3rem double #223438', // neutral.70
    boxShadow: '0 0 0 0.3rem #ffffff',
  },
} as const;

export type Tokens = typeof tokens;
