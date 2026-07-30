// PIDE Organization Color Scheme
// Pakistan Institute of Development Economics

export const COLORS = {
  // Primary PIDE green
  primary: '#00843D',
  primaryDark: '#005C2B',
  primaryLight: '#4CAF73',

  // Pakistan flag green & white
  secondary: '#FFFFFF',
  accent: '#C8A951', // gold accent

  // Status colors for results
  goodFit: '#00843D',
  potentialFit: '#F59E0B',
  noFit: '#DC2626',

  // Neutral
  background: '#F5F7FA',
  surface: '#FFFFFF',
  border: '#E2E8F0',
  textPrimary: '#1A202C',
  textSecondary: '#4A5568',
  textMuted: '#A0AEC0',

  // Gradients
  gradientStart: '#00843D',
  gradientEnd: '#005C2B',
};

export const FONTS = {
  regular: 'System',
  bold: 'System',
  sizes: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 18,
    xl: 22,
    xxl: 28,
    xxxl: 34,
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
};

export const SHADOW = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 8,
  },
};
