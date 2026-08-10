import React from 'react';
import { ViewProps, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export interface BrandGradientProps extends ViewProps {
  colors?: readonly [string, string, ...string[]];
  start?: { x: number; y: number };
  end?: { x: number; y: number };
  rounded?: boolean;
}

export function BrandGradient({ 
  children, 
  style, 
  className = '',
  colors = ['#22d3ee', '#a855f7'], 
  start = { x: 0, y: 0 }, 
  end = { x: 1, y: 1 },
  rounded = true,
  ...rest 
}: BrandGradientProps) {
  return (
    <LinearGradient
      colors={colors}
      start={start}
      end={end}
      style={[rounded ? styles.rounded : null, style]}
      className={className}
      {...rest}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  rounded: {
    borderRadius: 9999, // full rounded by default
  }
});
