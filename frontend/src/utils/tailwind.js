import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge Tailwind CSS classes
 * This combines clsx and tailwind-merge for optimal class handling
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Button variant classes
 */
export const buttonVariants = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
  secondary: 'bg-secondary-600 text-white hover:bg-secondary-700 focus:ring-secondary-500',
  outline: 'bg-transparent border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white focus:ring-primary-500',
  ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
  danger: 'bg-error-600 text-white hover:bg-error-700 focus:ring-error-500',
  success: 'bg-success-600 text-white hover:bg-success-700 focus:ring-success-500',
};

/**
 * Button size classes
 */
export const buttonSizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
  xl: 'px-8 py-4 text-lg',
};

/**
 * Input variant classes
 */
export const inputVariants = {
  default: 'border-gray-300 focus:ring-primary-500 focus:border-primary-500',
  error: 'border-error-300 focus:ring-error-500 focus:border-error-500',
  success: 'border-success-300 focus:ring-success-500 focus:border-success-500',
};

/**
 * Badge variant classes
 */
export const badgeVariants = {
  primary: 'bg-primary-100 text-primary-800',
  secondary: 'bg-secondary-100 text-secondary-800',
  success: 'bg-success-100 text-success-800',
  warning: 'bg-warning-100 text-warning-800',
  error: 'bg-error-100 text-error-800',
  info: 'bg-blue-100 text-blue-800',
};

/**
 * Card variant classes
 */
export const cardVariants = {
  default: 'bg-white border border-gray-200 shadow-soft',
  elevated: 'bg-white border border-gray-200 shadow-medium',
  outlined: 'bg-white border-2 border-gray-300',
  flat: 'bg-gray-50 border border-gray-200',
};

/**
 * Text variant classes
 */
export const textVariants = {
  h1: 'text-4xl font-bold text-gray-900',
  h2: 'text-3xl font-bold text-gray-900',
  h3: 'text-2xl font-semibold text-gray-900',
  h4: 'text-xl font-semibold text-gray-900',
  h5: 'text-lg font-semibold text-gray-900',
  h6: 'text-base font-semibold text-gray-900',
  body1: 'text-base text-gray-700',
  body2: 'text-sm text-gray-600',
  caption: 'text-xs text-gray-500',
  overline: 'text-xs font-medium uppercase tracking-wide text-gray-500',
};

/**
 * Animation classes
 */
export const animations = {
  fadeIn: 'animate-fade-in',
  slideUp: 'animate-slide-up',
  slideDown: 'animate-slide-down',
  scaleIn: 'animate-scale-in',
  bounceSubtle: 'animate-bounce-subtle',
  spin: 'animate-spin',
  pulse: 'animate-pulse',
};

/**
 * Spacing utilities
 */
export const spacing = {
  xs: 'gap-1',
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8',
  '2xl': 'gap-12',
};

/**
 * Responsive breakpoint helpers
 */
export const breakpoints = {
  sm: 'sm:',
  md: 'md:',
  lg: 'lg:',
  xl: 'xl:',
  '2xl': '2xl:',
};

/**
 * Container max widths
 */
export const containers = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
  '5xl': 'max-w-5xl',
  '6xl': 'max-w-6xl',
  '7xl': 'max-w-7xl',
  full: 'max-w-full',
  screen: 'max-w-screen-xl',
};

/**
 * Generate responsive classes
 */
export const responsive = (base, breakpoint = 'md') => {
  if (typeof base === 'object') {
    return Object.entries(base)
      .map(([bp, value]) => `${breakpoints[bp] || ''}${value}`)
      .join(' ');
  }
  return base;
};

/**
 * Focus ring utility
 */
export const focusRing = 'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500';

/**
 * Transition utilities
 */
export const transitions = {
  all: 'transition-all duration-200 ease-in-out',
  colors: 'transition-colors duration-200 ease-in-out',
  opacity: 'transition-opacity duration-200 ease-in-out',
  transform: 'transition-transform duration-200 ease-in-out',
  fast: 'transition-all duration-150 ease-in-out',
  slow: 'transition-all duration-300 ease-in-out',
};

/**
 * Shadow utilities
 */
export const shadows = {
  soft: 'shadow-soft',
  medium: 'shadow-medium',
  strong: 'shadow-strong',
  glow: 'shadow-glow',
};

/**
 * Gradient utilities
 */
export const gradients = {
  primary: 'bg-gradient-primary',
  secondary: 'bg-gradient-secondary',
  text: 'text-gradient',
};