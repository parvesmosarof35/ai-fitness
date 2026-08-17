import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Platform } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Home, Utensils, Dumbbell, LineChart, User } from 'lucide-react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BrandGradient } from './BrandGradient';

export function FloatingTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 16) }]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        let Icon = Home;
        let label = '';
        if (route.name === 'Home') { Icon = Home; label = 'Home'; }
        else if (route.name === 'Meals') { Icon = Utensils; label = 'Nutrition'; }
        else if (route.name === 'Workouts') { Icon = Dumbbell; label = 'Training'; }
        else if (route.name === 'Progress') { Icon = LineChart; label = 'Progress'; }
        else if (route.name === 'Profile') { Icon = User; label = 'Profile'; }

        // The center FAB (Workouts)
        const isCenterButton = route.name === 'Workouts';

        const color = isFocused && !isCenterButton ? '#44eac3' : '#918ea1';
        const opacity = isFocused || isCenterButton ? 1 : 0.6;

        if (isCenterButton) {
          return (
            <TouchableOpacity
              key={route.name}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              onPress={onPress}
              onLongPress={onLongPress}
              style={[styles.tabButton, { position: 'relative', top: -16 }]}
              activeOpacity={0.8}
            >
              <BrandGradient
                colors={['#6c5cff', '#44eac3'] as any}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.fabGradient}
              >
                <Icon color="#13121c" size={28} />
              </BrandGradient>
            </TouchableOpacity>
          );
        }

        return (
          <TouchableOpacity
            key={route.name}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabButton}
            activeOpacity={0.7}
          >
            <View style={{ alignItems: 'center', opacity }}>
              <Icon color={color} size={24} />
              <Text style={{ 
                color, 
                fontSize: 10, 
                fontFamily: 'System',
                textTransform: 'uppercase', 
                marginTop: 4,
                fontWeight: '700',
                letterSpacing: 0.5,
              }}>
                {label}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: 'rgba(32, 31, 40, 0.95)',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 12,
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6c5cff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  }
});
