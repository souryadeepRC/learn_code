/**
 * Enterprise-grade color system supporting light and dark modes
 * Colors are organized by semantic meaning for consistency
 * All colors are WCAG AA compliant for accessibility
 */

export const colorPalette = {
  // Neutral palette - foundation colors
  neutral: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
    950: '#030712',
  },

  // Primary brand color - for CTAs and key interactions
  primary: {
    50: '#F0F9FF',
    100: '#E0F2FE',
    200: '#BAE6FD',
    300: '#7DD3FC',
    400: '#38BDF8',
    500: '#0EA5E9',
    600: '#0284C7',
    700: '#0369A1',
    800: '#075985',
    900: '#0C3D66',
    950: '#051E3E',
  },

  // Secondary brand color - for supporting interactions
  secondary: {
    50: '#F5F3FF',
    100: '#EDE9FE',
    200: '#DDD6FE',
    300: '#C4B5FD',
    400: '#A78BFA',
    500: '#8B5CF6',
    600: '#7C3AED',
    700: '#6D28D9',
    800: '#5B21B6',
    900: '#4C1D95',
    950: '#2E1065',
  },

  // AI/Feature highlight colors - for AI-powered features
  ai: {
    50: '#F0FDF4',
    100: '#DCFCE7',
    200: '#BBF7D0',
    300: '#86EFAC',
    400: '#4ADE80',
    500: '#22C55E',
    600: '#16A34A',
    700: '#15803D',
    800: '#166534',
    900: '#145231',
    950: '#0F2817',
  },

  // Semantic colors - for status and intent
  semantic: {
    success: {
      light: '#D1FAE5',
      DEFAULT: '#10B981',
      dark: '#065F46',
    },
    warning: {
      light: '#FEF3C7',
      DEFAULT: '#F59E0B',
      dark: '#92400E',
    },
    error: {
      light: '#FEE2E2',
      DEFAULT: '#EF4444',
      dark: '#7F1D1D',
    },
    info: {
      light: '#DBEAFE',
      DEFAULT: '#3B82F6',
      dark: '#1E3A8A',
    },
  },

  // Gradients for premium AI features
  gradients: {
    aiPrimary: 'linear-gradient(135deg, #0EA5E9 0%, #8B5CF6 100%)',
    aiSecondary: 'linear-gradient(135deg, #22C55E 0%, #0EA5E9 100%)',
    aiVibrant: 'linear-gradient(135deg, #EC4899 0%, #F59E0B 100%)',
    darkOverlay:
      'linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 100%)',
  },
};

/**
 * Light mode theme configuration
 * Primary focus: clarity, brightness, and professional appearance
 */
export const lightTheme = {
  background: {
    primary: colorPalette.neutral[50], // Page background
    secondary: colorPalette.neutral[100], // Card backgrounds
    tertiary: colorPalette.neutral[200], // Subtle backgrounds
  },
  surface: {
    base: '#FFFFFF',
    elevated: colorPalette.neutral[50],
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
  text: {
    primary: colorPalette.neutral[950], // Main text
    secondary: colorPalette.neutral[600], // Secondary text
    tertiary: colorPalette.neutral[400], // Disabled/hint text
    inverse: '#FFFFFF', // Text on dark backgrounds
  },
  border: {
    default: colorPalette.neutral[200],
    subtle: colorPalette.neutral[100],
    strong: colorPalette.neutral[300],
  },
  interactive: {
    primary: colorPalette.primary[500],
    secondary: colorPalette.secondary[500],
    success: colorPalette.semantic.success.DEFAULT,
    warning: colorPalette.semantic.warning.DEFAULT,
    error: colorPalette.semantic.error.DEFAULT,
    info: colorPalette.semantic.info.DEFAULT,
    disabled: colorPalette.neutral[300],
    hover: colorPalette.primary[600],
  },
  ai: {
    glow: 'rgba(14, 165, 233, 0.2)',
    accent: colorPalette.ai[500],
  },
  shadow: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    aiGlow: '0 0 20px rgba(14, 165, 233, 0.3)',
  },
};

/**
 * Dark mode theme configuration
 * Primary focus: reduced eye strain, premium appearance, AI feature prominence
 */
export const darkTheme = {
  background: {
    primary: colorPalette.neutral[950], // Page background
    secondary: colorPalette.neutral[900], // Card backgrounds
    tertiary: colorPalette.neutral[800], // Subtle backgrounds
  },
  surface: {
    base: colorPalette.neutral[950],
    elevated: colorPalette.neutral[900],
    overlay: 'rgba(0, 0, 0, 0.8)',
  },
  text: {
    primary: colorPalette.neutral[50], // Main text
    secondary: colorPalette.neutral[400], // Secondary text
    tertiary: colorPalette.neutral[600], // Disabled/hint text
    inverse: colorPalette.neutral[950], // Text on light backgrounds
  },
  border: {
    default: colorPalette.neutral[800],
    subtle: colorPalette.neutral[900],
    strong: colorPalette.neutral[700],
  },
  interactive: {
    primary: colorPalette.primary[400],
    secondary: colorPalette.secondary[400],
    success: colorPalette.semantic.success.dark,
    warning: colorPalette.semantic.warning.dark,
    error: colorPalette.semantic.error.dark,
    info: colorPalette.semantic.info.dark,
    disabled: colorPalette.neutral[700],
    hover: colorPalette.primary[300],
  },
  ai: {
    glow: 'rgba(14, 165, 233, 0.3)',
    accent: colorPalette.ai[400],
  },
  shadow: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.4)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
    aiGlow: '0 0 20px rgba(14, 165, 233, 0.4)',
  },
};

export type Theme = 'light' | 'dark';
export type ThemeConfig = typeof lightTheme;
