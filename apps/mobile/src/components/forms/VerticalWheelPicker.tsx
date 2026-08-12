import React, { useRef, useState, useEffect } from 'react';
import { View, Text, FlatList, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';

const ITEM_HEIGHT = 60; // Height of each number item

interface VerticalWheelPickerProps {
  value?: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  unit?: string;
}

export function VerticalWheelPicker({ value, onChange, min, max, unit }: VerticalWheelPickerProps) {
  const items = Array.from({ length: max - min + 1 }, (_, i) => i + min);
  const flatListRef = useRef<FlatList>(null);
  const [activeIndex, setActiveIndex] = useState(() => {
    const initialIndex = value ? items.indexOf(value) : Math.floor(items.length / 2);
    return initialIndex >= 0 ? initialIndex : Math.floor(items.length / 2);
  });
  
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.y;
    const index = Math.round(scrollPosition / ITEM_HEIGHT);
    if (index !== activeIndex && index >= 0 && index < items.length) {
      setActiveIndex(index);
      onChange(items[index]);
    }
  };

  useEffect(() => {
    if (flatListRef.current && activeIndex >= 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToOffset({
          offset: activeIndex * ITEM_HEIGHT,
          animated: false,
        });
      }, 50);
    }
  }, []);

  return (
    <View style={{ height: ITEM_HEIGHT * 3, overflow: 'hidden', position: 'relative', width: '100%' }}>
      {/* Top and Bottom Fades */}
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: ITEM_HEIGHT, zIndex: 10, backgroundColor: 'rgba(19,18,28,0.7)', pointerEvents: 'none' }} />
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: ITEM_HEIGHT, zIndex: 10, backgroundColor: 'rgba(19,18,28,0.7)', pointerEvents: 'none' }} />
      
      {/* Center Highlight Line */}
      <View style={{ position: 'absolute', top: ITEM_HEIGHT, left: 0, right: 0, height: 1, backgroundColor: 'rgba(68,234,195,0.3)', shadowColor: '#44eac3', shadowOffset: {width: 0, height: 0}, shadowOpacity: 0.5, shadowRadius: 8, zIndex: 5 }} />
      <View style={{ position: 'absolute', bottom: ITEM_HEIGHT, left: 0, right: 0, height: 1, backgroundColor: 'rgba(68,234,195,0.3)', shadowColor: '#44eac3', shadowOffset: {width: 0, height: 0}, shadowOpacity: 0.5, shadowRadius: 8, zIndex: 5 }} />

      <FlatList
        ref={flatListRef}
        data={items}
        keyExtractor={(item) => item.toString()}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingVertical: ITEM_HEIGHT }}
        renderItem={({ item, index }) => {
          const isActive = index === activeIndex;
          return (
            <View style={{ height: ITEM_HEIGHT, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
              <Text style={{
                fontSize: isActive ? 36 : 20,
                fontWeight: '900',
                color: isActive ? '#44eac3' : '#918ea1',
              }}>
                {item}
              </Text>
              {unit && isActive && (
                <Text style={{ color: '#44eac3', fontSize: 14, fontWeight: '700', marginLeft: 4, marginTop: 10, fontFamily: 'monospace' }}>{unit}</Text>
              )}
            </View>
          );
        }}
      />
    </View>
  );
}
