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

export const GlassCard: React.FC<GlassCardProps> = ({
  variant = 'default',
  style,
  contentStyle,
  children,
  ...props
}) => {
  const getContainerStyle = (): StyleProp<ViewStyle> => {
    switch (variant) {
      case 'hero':
        return [styles.container, styles.heroContainer, style];
      case 'elevated':
        return [styles.container, styles.elevatedContainer, style];
      case 'selected':
        return [styles.container, styles.selectedContainer, style];
      case 'danger':
        return [styles.container, styles.dangerContainer, style];
      default:
        return [styles.container, style];
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
      {/* 1px glowing/transparent border via padding/gradient trick */}
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
          {variant === 'selected' && (
             <View style={styles.selectedGlow} />
          )}
          <View style={[styles.content, contentStyle]}>
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
    overflow: 'hidden', // Shadow applies to parent if needed, but inner is hidden
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 5,
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
    padding: 1, // 1px border
    borderRadius: 24,
  },
  innerWrapper: {
    borderRadius: 23, // 1px less than outer
    overflow: 'hidden',
    position: 'relative',
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
  }
});
