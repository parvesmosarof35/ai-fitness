import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Home, Dumbbell, Utensils, LineChart, User } from 'lucide-react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function FloatingTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const TAB_COUNT = state.routes.length;
  // A small active indicator width
  const INDICATOR_WIDTH = 20;
  
  return (
    <View style={[styles.wrapper, { paddingBottom: Math.max(insets.bottom, 16) }]}>
      <View style={styles.container}>
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
          if (route.name === 'Home') Icon = Home;
          else if (route.name === 'Workouts') Icon = Dumbbell;
          else if (route.name === 'Meals') Icon = Utensils;
          else if (route.name === 'Progress') Icon = LineChart;
          else if (route.name === 'Profile') Icon = User;

          const color = isFocused ? '#43E6D0' : '#696678';
          const iconSize = isFocused ? 24 : 22;

          return (
            <TouchableOpacity
              key={route.name}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
        testID={(options as any).tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tabButton}
              activeOpacity={0.7}
            >
              <Animated.View style={[{ alignItems: 'center' }]}>
                <Icon color={color} size={iconSize} />
                {isFocused && (
                  <View style={styles.indicator} />
                )}
              </Animated.View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  container: {
    flexDirection: 'row',
    backgroundColor: 'rgba(27, 27, 42, 0.95)',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(102, 92, 255, 0.2)',
    height: 64,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  indicator: {
    width: 20,
    height: 3,
    backgroundColor: '#43E6D0',
    borderRadius: 2,
    position: 'absolute',
    bottom: -8,
    shadowColor: '#43E6D0',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 4,
  }
});
