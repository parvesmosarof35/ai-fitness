import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { ForgeBackground } from '../../components/ui/ForgeBackground';
import { ForgeHeader } from '../../components/ui/ForgeHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/forms/Button';
import { Plus, Camera, Search } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';

export default function MealScreen() {
  // Placeholder for real data hook in the future
  const meals: any[] = [];
  const targetCalories = 2000;
  const consumedCalories = 0;
  
  const CIRCLE_RADIUS = 60;
  const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;
  const progress = consumedCalories / targetCalories;

  return (
    <ForgeBackground>
      <ForgeHeader />
      
      <ScrollView contentContainerStyle={{ paddingBottom: 140 }} showsVerticalScrollIndicator={false}>
        
        {/* Title */}
        <Animated.View entering={FadeInDown.duration(400).delay(100)} style={{ paddingHorizontal: 24, marginBottom: 24 }}>
          <Text style={styles.titleLine1}>FUEL YOUR</Text>
          <Text style={styles.titleLine2}>PROGRESS</Text>
        </Animated.View>

        {/* Nutrition Summary */}
        <Animated.View entering={FadeInDown.duration(400).delay(200)} style={{ paddingHorizontal: 24, marginBottom: 32 }}>
          <GlassCard style={{ padding: 24 }}>
             <View style={styles.dateSelectorRow}>
               <Text style={styles.dateText}>TODAY</Text>
             </View>

             <View style={styles.summaryContent}>
                <View style={styles.ringContainer}>
                  <Svg width={CIRCLE_RADIUS * 2 + 10} height={CIRCLE_RADIUS * 2 + 10} viewBox={`0 0 ${CIRCLE_RADIUS * 2 + 10} ${CIRCLE_RADIUS * 2 + 10}`}>
                    <Circle
                      cx={CIRCLE_RADIUS + 5}
                      cy={CIRCLE_RADIUS + 5}
                      r={CIRCLE_RADIUS}
                      stroke="rgba(255, 255, 255, 0.05)"
                      strokeWidth={8}
                      fill="none"
                    />
                    <Circle
                      cx={CIRCLE_RADIUS + 5}
                      cy={CIRCLE_RADIUS + 5}
                      r={CIRCLE_RADIUS}
                      stroke="#43E6D0"
                      strokeWidth={8}
                      fill="none"
                      strokeDasharray={CIRCLE_CIRCUMFERENCE}
                      strokeDashoffset={CIRCLE_CIRCUMFERENCE * (1 - progress)}
                      strokeLinecap="round"
                      transform={`rotate(-90 ${CIRCLE_RADIUS + 5} ${CIRCLE_RADIUS + 5})`}
                    />
                  </Svg>
                  <View style={styles.ringTextContainer}>
                    <Text style={styles.consumedText}>{consumedCalories}</Text>
                    <Text style={styles.kcalText}>KCAL</Text>
                  </View>
                </View>

                <View style={styles.macrosContainer}>
                  <View style={styles.macroRow}>
                    <View style={styles.macroHeader}>
                      <Text style={styles.macroLabel}>CARBS</Text>
                      <Text style={styles.macroValue}>0/200g</Text>
                    </View>
                    <View style={styles.macroBarBg}>
                       <LinearGradient colors={['#665CFF', '#9388FF']} style={[styles.macroBarFill, { width: '0%' }]} />
                    </View>
                  </View>
                  <View style={styles.macroRow}>
                    <View style={styles.macroHeader}>
                      <Text style={styles.macroLabel}>PROTEIN</Text>
                      <Text style={styles.macroValue}>0/150g</Text>
                    </View>
                    <View style={styles.macroBarBg}>
                       <LinearGradient colors={['#43E6D0', '#43E6B1']} style={[styles.macroBarFill, { width: '0%' }]} />
                    </View>
                  </View>
                  <View style={styles.macroRow}>
                    <View style={styles.macroHeader}>
                      <Text style={styles.macroLabel}>FAT</Text>
                      <Text style={styles.macroValue}>0/65g</Text>
                    </View>
                    <View style={styles.macroBarBg}>
                       <LinearGradient colors={['#FF8A4C', '#FFB45C']} style={[styles.macroBarFill, { width: '0%' }]} />
                    </View>
                  </View>
                </View>
             </View>
          </GlassCard>
        </Animated.View>

        {/* Meal Timeline */}
        <Animated.View entering={FadeInDown.duration(400).delay(300)} style={{ paddingHorizontal: 24 }}>
          <Text style={styles.sectionLabel}>TODAY&apos;S LOG</Text>
          
          {meals.length === 0 ? (
            <GlassCard style={styles.emptyState}>
              <View style={styles.emptyIconContainer}>
                <Camera color="#AAA7BA" size={32} />
              </View>
              <Text style={styles.emptyTitle}>NO MEALS YET</Text>
              <Text style={styles.emptySubtitle}>Scan your first meal or add it manually.</Text>
            </GlassCard>
          ) : (
            // Future implementation for real meal rows
            <View />
          )}
        </Animated.View>

      </ScrollView>

      {/* Sticky Action */}
      <View style={styles.stickyCTA}>
        <LinearGradient
          colors={['transparent', '#0B0B13', '#0B0B13']}
          style={StyleSheet.absoluteFill}
        />
        <Button 
          label="SCAN OR ADD MEAL" 
          onPress={() => { /* Open Bottom Sheet */ }} 
          variant="primary" 
          size="lg"
          leftIcon={<Plus color="#0B0B13" size={20} strokeWidth={3} />}
        />
      </View>
    </ForgeBackground>
  );
}

const styles = StyleSheet.create({
  titleLine1: {
    fontFamily: 'System',
    fontWeight: '900',
    fontSize: 40,
    color: '#FF8A4C', // Orange
    letterSpacing: -1,
    lineHeight: 40,
  },
  titleLine2: {
    fontFamily: 'System',
    fontWeight: '900',
    fontSize: 40,
    color: '#43E6D0', // Cyan
    letterSpacing: -1,
    lineHeight: 40,
  },
  dateSelectorRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  dateText: {
    color: '#F7F5FF',
    fontFamily: 'System',
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  summaryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ringContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  ringTextContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  consumedText: {
    color: '#F7F5FF',
    fontFamily: 'System',
    fontWeight: '900',
    fontSize: 24,
    lineHeight: 28,
  },
  kcalText: {
    color: '#AAA7BA',
    fontFamily: 'System',
    fontWeight: '700',
    fontSize: 10,
    letterSpacing: 1,
  },
  macrosContainer: {
    flex: 1,
    marginLeft: 24,
    gap: 16,
  },
  macroRow: {
    width: '100%',
  },
  macroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  macroLabel: {
    color: '#F7F5FF',
    fontFamily: 'System',
    fontWeight: '800',
    fontSize: 10,
    letterSpacing: 1,
  },
  macroValue: {
    color: '#AAA7BA',
    fontFamily: 'System',
    fontWeight: '700',
    fontSize: 10,
  },
  macroBarBg: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  macroBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  sectionLabel: {
    color: '#696678',
    fontFamily: 'System',
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 2,
    marginBottom: 16,
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
  },
  emptyIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    color: '#F7F5FF',
    fontFamily: 'System',
    fontWeight: '900',
    fontSize: 18,
    marginBottom: 8,
    letterSpacing: 1,
  },
  emptySubtitle: {
    color: '#AAA7BA',
    fontFamily: 'System',
    fontWeight: '600',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
  stickyCTA: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 40,
  }
});
