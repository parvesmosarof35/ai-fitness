import React from 'react';
import { TouchableOpacity, Text, TouchableOpacityProps, ActivityIndicator, View, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'destructive' | 'icon' | 'chip';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<TouchableOpacityProps, 'style'> {
  label?: string;
  loading?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  style?: any;
}

export function Button({ 
  label, 
  loading, 
  variant = 'primary', 
  size = 'md',
  leftIcon,
  rightIcon,
  fullWidth,
  style,
  ...props 
}: ButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }]
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const opacity = props.disabled || loading ? 0.5 : 1;

  // Render Inner Content
  const renderContent = (textColor: string, textSize: number, fontWeight: '500' | '600' | '700' = '600') => (
    <View style={styles.contentRow}>
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <>
          {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
          {label ? (
            <Text style={[
              styles.labelText, 
              { color: textColor, fontSize: textSize, fontWeight },
              variant === 'chip' && { textTransform: 'uppercase', letterSpacing: 1, fontSize: 10, fontWeight: '700' }
            ]}>
              {label}
            </Text>
          ) : null}
          {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
        </>
      )}
    </View>
  );

  // Layout Dimensions based on size
  let height = 56;
  let paddingHorizontal = 24;
  let fontSize = 16;
  let borderRadius = 28;

  if (size === 'sm') {
    height = 36;
    paddingHorizontal = 16;
    fontSize = 14;
    borderRadius = 18;
  } else if (size === 'lg') {
    height = 64;
    paddingHorizontal = 32;
    fontSize = 18;
    borderRadius = 32;
  }

  if (variant === 'icon') {
    paddingHorizontal = 0;
    height = size === 'sm' ? 44 : size === 'lg' ? 64 : 56;
    borderRadius = height / 2;
  } else if (variant === 'chip') {
    height = 32;
    paddingHorizontal = 16;
    borderRadius = 16;
  }

  const baseStyle = [
    styles.base,
    { height, paddingHorizontal, borderRadius, opacity },
    fullWidth && styles.fullWidth,
    variant === 'icon' && { width: height },
    style
  ];

  if (variant === 'primary') {
    return (
      <Pressable
        disabled={props.disabled || loading}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={props.onPress}
      >
        <Animated.View style={[baseStyle, styles.primaryShadow, animatedStyle]}>
          <LinearGradient
            colors={['#665CFF', '#43E6D0']}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={[StyleSheet.absoluteFill, { borderRadius }]}
          />
          {renderContent('#0B0B13', fontSize, '700')}
        </Animated.View>
      </Pressable>
    );
  }

  let bgColor = 'rgba(255, 255, 255, 0.05)';
  let borderColor = 'rgba(175, 168, 255, 0.2)';
  let textColor = '#F7F5FF';

  if (variant === 'destructive') {
    bgColor = 'rgba(255, 95, 109, 0.15)';
    borderColor = 'rgba(255, 95, 109, 0.3)';
    textColor = '#FF5F6D';
  } else if (variant === 'tertiary') {
    bgColor = 'transparent';
    borderColor = 'transparent';
    textColor = '#AAA7BA';
  }

  return (
    <Pressable
      disabled={props.disabled || loading}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={props.onPress}
    >
      <Animated.View style={[
        baseStyle, 
        animatedStyle,
        { backgroundColor: bgColor, borderWidth: variant === 'tertiary' ? 0 : 1, borderColor }
      ]}>
        {renderContent(textColor, fontSize)}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  fullWidth: {
    width: '100%',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
  labelText: {
    fontFamily: 'System',
  },
  primaryShadow: {
    shadowColor: '#43E6D0',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  }
});
