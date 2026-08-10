import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface ForgeBackgroundProps {
  children: React.ReactNode;
  showCyanGlow?: boolean;
}

const { width, height } = Dimensions.get('window');

export const ForgeBackground: React.FC<ForgeBackgroundProps> = ({ 
  children,
  showCyanGlow = true
}) => {
  return (
    <View style={styles.container}>
      {/* Base Background */}
      <View style={styles.baseBg} />

      {/* Top Violet Glow */}
      <View style={styles.topGlowContainer}>
        <LinearGradient
          colors={['rgba(102, 92, 255, 0.15)', 'transparent']}
          style={styles.topGlow}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        />
      </View>

      {/* Bottom Cyan Glow (Optional) */}
      {showCyanGlow && (
        <View style={styles.bottomGlowContainer}>
          <LinearGradient
            colors={['transparent', 'rgba(67, 230, 208, 0.1)']}
            style={styles.bottomGlow}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
          />
        </View>
      )}

      {/* Diagonal Line 1 */}
      <View style={[styles.diagonalLine, styles.line1]} />
      
      {/* Diagonal Line 2 */}
      <View style={[styles.diagonalLine, styles.line2]} />

      {/* Content */}
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0B13',
    position: 'relative',
  },
  baseBg: {
    ...(StyleSheet.absoluteFill as any),
    backgroundColor: '#0B0B13',
  },
  topGlowContainer: {
    position: 'absolute',
    top: -height * 0.2,
    left: -width * 0.5,
    width: width * 2,
    height: height * 0.6,
    opacity: 0.8,
  },
  topGlow: {
    flex: 1,
    borderRadius: width, // Create radial effect
    transform: [{ scaleY: 0.5 }], // Flatten to ellipse
  },
  bottomGlowContainer: {
    position: 'absolute',
    bottom: -height * 0.1,
    left: 0,
    width: width,
    height: height * 0.4,
  },
  bottomGlow: {
    flex: 1,
  },
  diagonalLine: {
    position: 'absolute',
    width: width * 2,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  line1: {
    top: height * 0.3,
    left: -width * 0.5,
    transform: [{ rotate: '-15deg' }],
  },
  line2: {
    top: height * 0.7,
    left: -width * 0.5,
    transform: [{ rotate: '-15deg' }],
  },
  content: {
    flex: 1,
  },
});
