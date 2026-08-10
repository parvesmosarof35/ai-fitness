import React from 'react';
import { View, ViewProps, SafeAreaView, Platform, StatusBar } from 'react-native';

export interface ScreenProps extends ViewProps {
  safeArea?: boolean;
}

export function Screen({ children, style, safeArea = true, className = '', ...rest }: ScreenProps) {
  const Container = safeArea ? SafeAreaView : View;
  
  return (
    <Container 
      className={`flex-1 bg-background ${className}`} 
      style={[{ paddingTop: safeArea && Platform.OS === 'android' ? StatusBar.currentHeight : 0 }, style]}
      {...rest}
    >
      {children}
    </Container>
  );
}
