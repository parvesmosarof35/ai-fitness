export const tokens = {
  colors: {
    bg: {
      base: '#080A10',
      raised: '#0E111A',
      card: '#121624',
    },
    surface: {
      glass: 'rgba(20, 24, 36, 0.72)',
      glassStrong: 'rgba(27, 31, 46, 0.88)',
      soft: 'rgba(255, 255, 255, 0.045)',
      card: 'rgba(255, 255, 255, 0.06)',
    },
    border: {
      subtle: 'rgba(255, 255, 255, 0.08)',
      highlight: 'rgba(255, 255, 255, 0.16)',
      brand: 'rgba(124, 108, 255, 0.3)',
      cyan: 'rgba(66, 232, 207, 0.3)',
    },
    brand: {
      violet: '#7C6CFF',
      cyan: '#42E8CF',
      gradientStart: '#7C6CFF',
      gradientEnd: '#42E8CF',
    },
    accent: {
      warm: '#FF9B6A',
      electric: '#00F2FE',
    },
    text: {
      primary: '#F5F7FC',
      secondary: '#A7ADBC',
      muted: '#6F7687',
      inverse: '#080A10',
    },
    status: {
      success: '#48D7A5',
      warning: '#F6B85F',
      danger: '#FF6B78',
    },
  },
  radii: {
    sm: 12,
    md: 16,
    lg: 20,
    xl: 28,
    full: 9999,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
  },
  typography: {
    fontFamily: 'System',
    display: {
      fontSize: 36,
      lineHeight: 42,
      fontWeight: '900' as const,
      letterSpacing: -0.5,
    },
    title: {
      fontSize: 26,
      lineHeight: 32,
      fontWeight: '800' as const,
    },
    subtitle: {
      fontSize: 18,
      lineHeight: 24,
      fontWeight: '700' as const,
    },
    body: {
      fontSize: 15,
      lineHeight: 22,
      fontWeight: '400' as const,
    },
    caption: {
      fontSize: 12,
      lineHeight: 16,
      fontWeight: '600' as const,
      letterSpacing: 0.5,
    },
    label: {
      fontSize: 11,
      lineHeight: 14,
      fontWeight: '700' as const,
      letterSpacing: 1,
    },
  },
} as const;

export type Tokens = typeof tokens;
