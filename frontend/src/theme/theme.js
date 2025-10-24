// Tailwind CSS Theme Configuration
// This file contains the theme configuration that matches our Tailwind config

// Brand colors that match Tailwind configuration
export const brandColors = {
  primary: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
    950: '#450a0a',
  },
  secondary: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617',
  },
  accent: {
    50: '#fefdf8',
    100: '#fefbeb',
    200: '#fef3c7',
    300: '#fde68a',
    400: '#fcd34d',
    500: '#fbbf24',
    600: '#f59e0b',
    700: '#d97706',
    800: '#b45309',
    900: '#92400e',
    950: '#78350f',
  },
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
    950: '#052e16',
  },
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
    950: '#450a0a',
  },
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
    950: '#451a03',
  },
};

// Typography configuration matching Tailwind classes
export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    serif: ['Georgia', 'serif'],
    mono: ['JetBrains Mono', 'monospace'],
  },
  
  fontSize: {
    '2xs': '0.625rem',    // text-2xs
    'xs': '0.75rem',      // text-xs
    'sm': '0.875rem',     // text-sm
    'base': '1rem',       // text-base
    'lg': '1.125rem',     // text-lg
    'xl': '1.25rem',      // text-xl
    '2xl': '1.5rem',      // text-2xl
    '3xl': '1.875rem',    // text-3xl
    '4xl': '2.25rem',     // text-4xl
    '5xl': '3rem',        // text-5xl
    '6xl': '3.75rem',     // text-6xl
    '7xl': '4.5rem',      // text-7xl
    '8xl': '6rem',        // text-8xl
    '9xl': '8rem',        // text-9xl
  },
  
  fontWeight: {
    thin: '100',          // font-thin
    extralight: '200',    // font-extralight
    light: '300',         // font-light
    normal: '400',        // font-normal
    medium: '500',        // font-medium
    semibold: '600',      // font-semibold
    bold: '700',          // font-bold
    extrabold: '800',     // font-extrabold
    black: '900',         // font-black
  },
  
  lineHeight: {
    none: '1',            // leading-none
    tight: '1.25',        // leading-tight
    snug: '1.375',        // leading-snug
    normal: '1.5',        // leading-normal
    relaxed: '1.625',     // leading-relaxed
    loose: '2',           // leading-loose
  },
};

// Spacing configuration (matches Tailwind's spacing scale)
export const spacing = {
  0: '0px',      // space-0
  1: '0.25rem',  // space-1 (4px)
  2: '0.5rem',   // space-2 (8px)
  3: '0.75rem',  // space-3 (12px)
  4: '1rem',     // space-4 (16px)
  5: '1.25rem',  // space-5 (20px)
  6: '1.5rem',   // space-6 (24px)
  8: '2rem',     // space-8 (32px)
  10: '2.5rem',  // space-10 (40px)
  12: '3rem',    // space-12 (48px)
  16: '4rem',    // space-16 (64px)
  20: '5rem',    // space-20 (80px)
  24: '6rem',    // space-24 (96px)
  32: '8rem',    // space-32 (128px)
  40: '10rem',   // space-40 (160px)
  48: '12rem',   // space-48 (192px)
  56: '14rem',   // space-56 (224px)
  64: '16rem',   // space-64 (256px)
};

// Border radius configuration
export const borderRadius = {
  none: '0px',           // rounded-none
  sm: '0.125rem',        // rounded-sm
  default: '0.25rem',    // rounded
  md: '0.375rem',        // rounded-md
  lg: '0.5rem',          // rounded-lg
  xl: '0.75rem',         // rounded-xl
  '2xl': '1rem',         // rounded-2xl
  '3xl': '1.5rem',       // rounded-3xl
  '4xl': '2rem',         // rounded-4xl
  '5xl': '2.5rem',       // rounded-5xl
  full: '9999px',        // rounded-full
};

// Box shadow configuration
export const boxShadow = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',                                    // shadow-sm
  default: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)', // shadow
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)', // shadow-md
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)', // shadow-lg
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)', // shadow-xl
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',                           // shadow-2xl
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',                          // shadow-inner
  none: '0 0 #0000',                                                       // shadow-none
  
  // Custom shadows
  soft: '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
  medium: '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  strong: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  glow: '0 0 20px rgba(239, 68, 68, 0.3)',
};

// Breakpoints configuration (matches Tailwind's breakpoints)
export const breakpoints = {
  xs: '475px',      // Custom extra small
  sm: '640px',      // Small devices (landscape phones)
  md: '768px',      // Medium devices (tablets)
  lg: '1024px',     // Large devices (desktops)
  xl: '1280px',     // Extra large devices (large desktops)
  '2xl': '1536px',  // 2X large devices (larger desktops)
  '3xl': '1680px',  // Custom 3X large
  '4xl': '2048px',  // Custom 4X large
};

// Transitions and animations
export const transitions = {
  duration: {
    75: '75ms',
    100: '100ms',
    150: '150ms',
    200: '200ms',
    300: '300ms',
    500: '500ms',
    700: '700ms',
    1000: '1000ms',
  },
  
  easing: {
    linear: 'linear',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
};

// Z-index scale
export const zIndex = {
  0: '0',
  10: '10',
  20: '20',
  30: '30',
  40: '40',
  50: '50',
  auto: 'auto',
  
  // Custom z-index values
  dropdown: '1000',
  sticky: '1020',
  fixed: '1030',
  modalBackdrop: '1040',
  modal: '1050',
  popover: '1060',
  tooltip: '1070',
};

// Gradients
export const gradients = {
  primary: 'bg-gradient-to-r from-primary-500 to-primary-700',
  secondary: 'bg-gradient-to-r from-secondary-500 to-secondary-700',
  accent: 'bg-gradient-to-r from-accent-500 to-accent-700',
  success: 'bg-gradient-to-r from-success-500 to-success-700',
  error: 'bg-gradient-to-r from-error-500 to-error-700',
  warning: 'bg-gradient-to-r from-warning-500 to-warning-700',
};

// Main theme object
const theme = {
  colors: brandColors,
  typography,
  spacing,
  borderRadius,
  boxShadow,
  breakpoints,
  transitions,
  zIndex,
  gradients,
};

export default theme;