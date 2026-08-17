import React from 'react';
import { View, StyleSheet, ViewProps, StyleProp, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export type GlassCardVariant = 'default' | 'elevated' | 'selected' | 'danger' | 'hero';

interface GlassCardProps extends ViewProps {
  variant?: GlassCardVariant;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

const LAYOUT_STYLE_KEYS = new Set([
  'flexDirection',
  'alignItems',
  'justifyContent',
  'gap',
  'rowGap',
  'columnGap',
  'flexWrap',
  'padding',
  'paddingHorizontal',
  'paddingVertical',
  'paddingTop',
  'paddingBottom',
  'paddingLeft',
  'paddingRight',
]);

const splitStyles = (styleObj: any) => {
  const flat = StyleSheet.flatten(styleObj);
  if (!flat) return { container: {}, content: {} };

  const container: Record<string, any> = {};
  const content: Record<string, any> = {};

  Object.keys(flat).forEach((key) => {
    if (LAYOUT_STYLE_KEYS.has(key)) {
      content[key] = (flat as any)[key];
    } else {
      container[key] = (flat as any)[key];
    }
  });

  return { container, content };
};

export const GlassCard: React.FC<GlassCardProps> = ({
  variant = 'default',
  style,
  contentStyle,
  children,
  ...props
}) => {
  const { container: splitContainerStyle, content: splitContentStyle } = splitStyles(style);

  const getContainerStyle = (): StyleProp<ViewStyle> => {
    switch (variant) {
      case 'hero':
        return [styles.container, styles.heroContainer, splitContainerStyle];
      case 'elevated':
        return [styles.container, styles.elevatedContainer, splitContainerStyle];
      case 'selected':
        return [styles.container, styles.selectedContainer, splitContainerStyle];
      case 'danger':
        return [styles.container, styles.dangerContainer, splitContainerStyle];
      default:
        return [styles.container, splitContainerStyle];
    }
  };

  const getBorderGradient = (): readonly [string, string, ...string[]] => {
    if (variant === 'selected') {
      return ['rgba(67, 230, 208, 0.4)', 'rgba(102, 92, 255, 0.4)'];
    }
    if (variant === 'danger') {
      return ['rgba(255, 95, 109, 0.4)', 'rgba(255, 95, 109, 0.1)'];
    }
    return ['rgba(175, 168, 255, 0.20)', 'rgba(255, 255, 255, 0.05)'];
  };

  const getBgGradient = (): readonly [string, string, ...string[]] => {
    if (variant === 'hero') {
      return ['rgba(37, 37, 57, 0.90)', 'rgba(27, 27, 42, 0.85)'];
    }
    if (variant === 'selected') {
      return ['rgba(37, 37, 57, 0.95)', 'rgba(27, 27, 42, 0.9)'];
    }
    if (variant === 'danger') {
      return ['rgba(255, 95, 109, 0.1)', 'rgba(27, 27, 42, 0.8)'];
    }
    return ['rgba(37, 37, 57, 0.90)', 'rgba(27, 27, 42, 0.76)'];
  };

  return (
    <View style={getContainerStyle()} {...props}>
      <LinearGradient
        colors={getBorderGradient()}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.borderWrapper}
      >
        <LinearGradient
          colors={getBgGradient()}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.innerWrapper}
        >
          {variant === 'selected' && <View style={styles.selectedGlow} />}
          <View style={[styles.content, splitContentStyle, contentStyle]}>
            {children}
          </View>
        </LinearGradient>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 5,
    width: '100%',
  },
  heroContainer: {
    borderRadius: 28,
  },
  elevatedContainer: {
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 8,
  },
  selectedContainer: {
    shadowColor: '#43E6D0',
    shadowOpacity: 0.2,
    shadowRadius: 15,
  },
  dangerContainer: {
    shadowColor: '#FF5F6D',
    shadowOpacity: 0.2,
    shadowRadius: 15,
  },
  borderWrapper: {
    padding: 1,
    borderRadius: 24,
    width: '100%',
  },
  innerWrapper: {
    borderRadius: 23,
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
  },
  selectedGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(67, 230, 208, 0.05)',
  },
  content: {
    padding: 20,
    width: '100%',
  },
});
