/**
 * Design tokens for dash webapp
 * Colors match the main wellcomecollection.org content app
 * All colors meet WCAG AA contrast requirements (4.5:1 for normal text)
 */

export const tokens = {
  colors: {
    // Core (from content app)
    white: '#ffffff',
    black: '#121212',
    yellow: '#ffce3c',

    // Primary (workspace theme)
    primary: {
      main: '#ffce3c', // Workspace yellow
      dark: '#323232', // Dark text, not yellow-based
      contrast: '#121212', // Text on yellow background
    },

    // Semantic colors - using content app validation colors
    success: {
      main: '#0b7051', // validation.green from content app
      light: '#e6f4f1',
      text: '#0b7051',
    },
    warning: {
      main: '#995200', // Darker orange for contrast
      light: '#fff0e6',
      text: '#995200',
    },
    error: {
      main: '#e01b2f', // validation.red from content app
      light: '#ffebee',
      text: '#e01b2f',
    },
    info: {
      main: '#27476e', // accent.blue from content app
      light: '#e1f5fe',
      text: '#27476e',
    },

    // UI colors - using content app neutrals
    text: {
      primary: '#121212', // black from content app
      secondary: '#6a6a6a', // neutral.600 from content app
      disabled: '#8f8f8f', // neutral.500 from content app
    },
    background: {
      default: '#ffffff',
      paper: '#fbfaf4', // neutral.200 from content app
      section: '#edece4', // warmNeutral.300 from content app
    },
    border: {
      default: '#d9d8d0', // warmNeutral.400 from content app
      focus: '#ffea00', // focus.yellow from content app
    },

    // Status colors
    status: {
      active: '#0b7051', // validation.green
      inactive: '#8f8f8f', // neutral.500
    },
  },

  typography: {
    fontFamily: 'Gadget, sans-serif',
    fontSize: {
      small: '0.875rem', // 14px
      base: '1rem', // 16px
      large: '1.125rem', // 18px
      h4: '1.25rem', // 20px
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
    small: '2px',
    medium: '4px',
    large: '8px',
    full: '50%',
  },

  focus: {
    outline: '0.3rem double #121212',
    boxShadow: '0 0 0 0.3rem #ffffff',
  },
} as const;

export type Tokens = typeof tokens;
