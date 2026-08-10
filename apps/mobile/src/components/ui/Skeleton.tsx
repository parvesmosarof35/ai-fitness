import React, { useEffect, useRef } from 'react';
import { View, Animated, ViewProps } from 'react-native';

interface SkeletonProps extends ViewProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
}

export function Skeleton({ width = '100%', height = 20, borderRadius = 4, className = '', style, ...rest }: SkeletonProps) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [opacity]);

  return (
    <Animated.View
      className={`bg-surface-highlight ${className}`}
      style={[
        {
          width: width as any,
          height: height as any,
          borderRadius: borderRadius,
          opacity: opacity,
        },
        style,
      ]}
      {...rest}
    />
  );
}
