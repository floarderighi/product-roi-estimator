/**
 * Delva Design System - Design Tokens
 * Extrait du site https://www.delva.co/
 */

export const colors = {
  // Primary Colors
  primary: {
    50: '#F5F0FF',
    100: '#EBE0FF',
    200: '#D6C1FF',
    300: '#C2A3FF',
    400: '#9966FF',
    500: '#6B1FFF', // Violet principal Delva
    600: '#5519CC',
    700: '#401399',
    800: '#2A0D66',
    900: '#150633',
  },

  // Background Colors
  background: {
    primary: '#FFFFFF',
    secondary: '#F5F3EF', // Beige clair Delva
    dark: '#2D0F5C', // Violet foncé pour hero
    purple: '#3E1F7D', // Violet intermédiaire
  },

  // Text Colors
  text: {
    primary: '#1A1A1A',
    secondary: '#6B7280',
    inverse: '#FFFFFF',
    muted: '#9CA3AF',
  },

  // Semantic Colors
  success: {
    50: '#ECFDF5',
    500: '#10B981',
    700: '#047857',
  },
  warning: {
    50: '#FFFBEB',
    500: '#F59E0B',
    700: '#B45309',
  },
  error: {
    50: '#FEF2F2',
    500: '#EF4444',
    700: '#B91C1C',
  },
  info: {
    50: '#EFF6FF',
    500: '#3B82F6',
    700: '#1D4ED8',
  },
} as const;

export const spacing = {
  0: '0',
  1: '0.25rem', // 4px
  2: '0.5rem', // 8px
  3: '0.75rem', // 12px
  4: '1rem', // 16px
  5: '1.25rem', // 20px
  6: '1.5rem', // 24px
  8: '2rem', // 32px
  10: '2.5rem', // 40px
  12: '3rem', // 48px
  16: '4rem', // 64px
  20: '5rem', // 80px
  24: '6rem', // 96px
} as const;

export const typography = {
  fontFamily: {
    sans: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  fontSize: {
    xs: '0.75rem', // 12px
    sm: '0.875rem', // 14px
    base: '1rem', // 16px
    lg: '1.125rem', // 18px
    xl: '1.25rem', // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem', // 48px
    '6xl': '3.75rem', // 60px
    '7xl': '4.5rem', // 72px
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75',
  },
} as const;

export const borderRadius = {
  none: '0',
  sm: '0.25rem', // 4px
  base: '0.5rem', // 8px
  md: '0.75rem', // 12px
  lg: '1rem', // 16px
  xl: '1.5rem', // 24px
  '2xl': '2rem', // 32px
  full: '9999px', // Pill shape (boutons Delva)
} as const;

export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  none: 'none',
} as const;

export const transitions = {
  fast: '150ms',
  base: '200ms',
  slow: '300ms',
  ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
} as const;

// Component-specific tokens
export const components = {
  button: {
    primary: {
      background: colors.primary[500],
      backgroundHover: colors.primary[600],
      text: colors.text.inverse,
      borderRadius: borderRadius.full,
      padding: '1rem 2rem',
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.semibold,
    },
    secondary: {
      background: colors.background.primary,
      backgroundHover: colors.background.secondary,
      text: colors.text.primary,
      borderRadius: borderRadius.full,
      padding: '1rem 2rem',
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.semibold,
    },
  },
  card: {
    background: colors.background.primary,
    borderRadius: borderRadius.xl,
    shadow: shadows.md,
    padding: spacing[6],
  },
  input: {
    background: colors.background.primary,
    border: '1px solid #E5E7EB',
    borderRadius: borderRadius.lg,
    padding: spacing[4],
    fontSize: typography.fontSize.base,
  },
} as const;

export type Colors = typeof colors;
export type Spacing = typeof spacing;
export type Typography = typeof typography;
export type BorderRadius = typeof borderRadius;
export type Shadows = typeof shadows;
