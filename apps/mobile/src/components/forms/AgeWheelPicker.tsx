import React, { useRef, useState, useEffect } from 'react';
import { View, Text, FlatList, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';

const ages = Array.from({ length: 87 }, (_, i) => i + 14); // 14 to 100
const ITEM_WIDTH = 60; // Width of each number item

interface AgeWheelPickerProps {
  value?: number;
  onChange: (age: number) => void;
}

export function AgeWheelPicker({ value, onChange }: AgeWheelPickerProps) {
  const flatListRef = useRef<FlatList>(null);
  const [activeIndex, setActiveIndex] = useState(() => {
    const initialIndex = value ? ages.indexOf(value) : 10; // Default to index 10 (24)
    return initialIndex >= 0 ? initialIndex : 10;
  });
  const [scrollerWidth, setScrollerWidth] = useState(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / ITEM_WIDTH);
    if (index !== activeIndex && index >= 0 && index < ages.length) {
      setActiveIndex(index);
      onChange(ages[index]);
    }
  };

  useEffect(() => {
    // Initial scroll when layout is ready and width is calculated
    if (flatListRef.current && activeIndex >= 0 && scrollerWidth > 0) {
      // Need a small timeout to ensure FlatList has rendered its items
      setTimeout(() => {
        flatListRef.current?.scrollToOffset({
          offset: activeIndex * ITEM_WIDTH,
          animated: false,
        });
      }, 50);
    }
  }, [scrollerWidth]);

  return (
    <View style={{
      backgroundColor: 'rgba(255,255,255,0.03)',
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.1)',
      borderRadius: 16,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      height: 100,
    }}>
      <View style={{ borderRightWidth: 1, borderRightColor: 'rgba(255,255,255,0.1)', paddingRight: 12, width: '30%', justifyContent: 'center' }}>
        <Text style={{ color: '#c8c4d8', fontSize: 10, fontWeight: '700', letterSpacing: 1.5 }} numberOfLines={1}>SELECT</Text>
        <Text style={{ color: '#c8c4d8', fontSize: 10, fontWeight: '700', letterSpacing: 1.5 }} numberOfLines={1}>AGE</Text>
        <Text style={{ color: '#918ea1', fontSize: 9, marginTop: 4 }}>Years of power</Text>
      </View>

      <View 
        style={{ flex: 1, overflow: 'hidden', position: 'relative', height: '100%' }}
        onLayout={(e) => setScrollerWidth(e.nativeEvent.layout.width)}
      >
        <FlatList
          ref={flatListRef}
          horizontal
          data={ages}
          keyExtractor={(item) => item.toString()}
          showsHorizontalScrollIndicator={false}
          snapToInterval={ITEM_WIDTH}
          decelerationRate="fast"
          getItemLayout={(_, index) => ({
            length: ITEM_WIDTH,
            offset: ITEM_WIDTH * index,
            index,
          })}
          onScroll={handleScroll}
          onMomentumScrollEnd={handleScroll}
          onScrollEndDrag={handleScroll}
          scrollEventThrottle={16}
          contentContainerStyle={{ paddingHorizontal: scrollerWidth > 0 ? (scrollerWidth - ITEM_WIDTH) / 2 : 100 }}
          renderItem={({ item, index }) => {
            const isActive = index === activeIndex;
            return (
              <View style={{ width: ITEM_WIDTH, alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                {isActive && <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: '#44eac3', position: 'absolute', top: 10 }} />}
                <Text style={{
                  fontSize: isActive ? 32 : 20,
                  fontWeight: '900',
                  color: isActive ? '#e5e0ee' : '#918ea1',
                }}>
                  {item}
                </Text>
              </View>
            );
          }}
        />
      </View>
    </View>
  );
}
