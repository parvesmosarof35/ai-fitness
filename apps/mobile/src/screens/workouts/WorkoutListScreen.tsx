import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { WorkoutStackParamList } from '../../navigation/types';
import { useWorkouts } from '../../hooks/useWorkouts';
import { ForgeBackground } from '../../components/ui/ForgeBackground';
import { ForgeHeader } from '../../components/ui/ForgeHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Dumbbell, Clock, ChevronRight, Play } from 'lucide-react-native';
import { Button } from '../../components/forms/Button';
import Animated, { FadeInDown } from 'react-native-reanimated';

type Props = NativeStackScreenProps<WorkoutStackParamList, 'WorkoutList'>;

export default function WorkoutListScreen({ navigation }: Props) {
  const { plans, loading, error, refresh } = useWorkouts();
  const [filter, setFilter] = useState<string>('For You'); 

  const filters = ['For You', 'My Plans', 'Completed', 'Duration', 'Difficulty', 'Equipment'];

  if (loading) {
    return (
      <ForgeBackground>
        <ForgeHeader />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#43E6D0" />
          <Text style={{ color: '#AAA7BA', marginTop: 16, fontFamily: 'System', fontWeight: '700', fontSize: 12, letterSpacing: 1, textTransform: 'uppercase' }}>
            Loading your plans...
          </Text>
        </View>
      </ForgeBackground>
    );
  }

  if (error) {
    return (
      <ForgeBackground>
        <ForgeHeader />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
          <Text style={{ color: '#FF5F6D', marginBottom: 16, fontFamily: 'System', fontWeight: '600' }}>{error}</Text>
          <Button label="Retry" onPress={refresh} variant="secondary" />
        </View>
      </ForgeBackground>
    );
  }

  const featuredPlan = plans.length > 0 ? plans[0] : null;
  const regularPlans = plans.length > 1 ? plans.slice(1) : [];

  return (
    <ForgeBackground>
      <ForgeHeader />
      
      <FlatList
        data={regularPlans}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            {/* Title */}
            <Animated.View entering={FadeInDown.duration(400).delay(100)} style={{ paddingHorizontal: 24, marginBottom: 24 }}>
              <Text style={styles.titleLine1}>YOUR</Text>
              <Text style={styles.titleLine2}>WORKOUTS</Text>
            </Animated.View>

            {/* Filters */}
            <Animated.View entering={FadeInDown.duration(400).delay(150)} style={{ marginBottom: 24 }}>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 24, gap: 12 }}
                data={filters}
                keyExtractor={(item) => item}
                renderItem={({ item }) => {
                  const isSelected = filter === item;
                  return (
                    <TouchableOpacity 
                      activeOpacity={0.7}
                      onPress={() => setFilter(item)}
                      style={[
                        styles.chip,
                        isSelected ? styles.chipSelected : styles.chipUnselected
                      ]}
                    >
                      <Text style={[
                        styles.chipText,
                        isSelected ? styles.chipTextSelected : styles.chipTextUnselected
                      ]}>
                        {item}
                      </Text>
                    </TouchableOpacity>
                  );
                }}
              />
            </Animated.View>

            {/* Featured Workout */}
            {featuredPlan && (
              <Animated.View entering={FadeInDown.duration(400).delay(200)} style={{ paddingHorizontal: 24, marginBottom: 24 }}>
                <Text style={styles.sectionLabel}>FEATURED</Text>
                <GlassCard variant="hero" style={{ padding: 0 }}>
                  <View style={styles.featuredImageContainer}>
                    <Dumbbell color="#1B1B2A" size={64} />
                    <View style={styles.featuredOverlay} />
                    <View style={styles.featuredContent}>
                      <Text style={styles.featuredGoal}>Build Strength</Text>
                      <Text style={styles.featuredTitle}>{featuredPlan.title}</Text>
                      <View style={styles.featuredMetaRow}>
                        <Text style={styles.featuredMetaText}>{featuredPlan.estimatedDurationMinutes} MIN</Text>
                        <View style={styles.dot} />
                        <Text style={styles.featuredMetaText}>{featuredPlan.difficulty}</Text>
                      </View>
                    </View>
                  </View>
                  <View style={{ padding: 20 }}>
                    <Button 
                      label="Start Workout" 
                      variant="primary" 
                      onPress={() => navigation.navigate('WorkoutOverview', { workoutId: featuredPlan.id })}
                    />
                  </View>
                </GlassCard>
              </Animated.View>
            )}

            {regularPlans.length > 0 && (
               <Animated.View entering={FadeInDown.duration(400).delay(250)} style={{ paddingHorizontal: 24, marginBottom: 12 }}>
                 <Text style={styles.sectionLabel}>ALL PLANS</Text>
               </Animated.View>
            )}
          </>
        }
        ListEmptyComponent={
          !featuredPlan ? (
            <View style={{ padding: 40, alignItems: 'center' }}>
              <Text style={{ color: '#AAA7BA', fontFamily: 'System', fontWeight: '600' }}>No plans found.</Text>
            </View>
          ) : null
        }
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInDown.duration(400).delay(300 + (index * 50))} style={{ paddingHorizontal: 24, marginBottom: 16 }}>
            <TouchableOpacity 
              activeOpacity={0.8}
              onPress={() => navigation.navigate('WorkoutOverview', { workoutId: item.id })}
            >
              <GlassCard style={{ padding: 16, flexDirection: 'row', alignItems: 'center' }}>
                <View style={styles.thumbnail}>
                  <Dumbbell color="#43E6D0" size={20} />
                </View>
                
                <View style={{ flex: 1, marginLeft: 16 }}>
                  <Text style={styles.listTitle} numberOfLines={1}>{item.title}</Text>
                  <View style={styles.listMetaRow}>
                    <Clock color="#AAA7BA" size={12} />
                    <Text style={styles.listMetaText}>{item.estimatedDurationMinutes} MIN</Text>
                    <View style={styles.dotMuted} />
                    <Text style={styles.listMetaTextCyan}>{item.difficulty}</Text>
                    <View style={styles.dotMuted} />
                    <Text style={styles.listMetaText}>{item.targetMuscles[0] || 'FULL BODY'}</Text>
                  </View>
                </View>
                
                <ChevronRight color="#AAA7BA" size={20} />
              </GlassCard>
            </TouchableOpacity>
          </Animated.View>
        )}
      />
    </ForgeBackground>
  );
}

const styles = StyleSheet.create({
  titleLine1: {
    fontFamily: 'System',
    fontWeight: '900',
    fontSize: 40,
    color: '#665CFF', // Violet
    letterSpacing: -1,
    lineHeight: 40,
  },
  titleLine2: {
    fontFamily: 'System',
    fontWeight: '900',
    fontSize: 40,
    color: '#F7F5FF', // White
    letterSpacing: -1,
    lineHeight: 40,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipSelected: {
    backgroundColor: 'rgba(67, 230, 208, 0.1)',
    borderColor: '#43E6D0',
  },
  chipUnselected: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'transparent',
  },
  chipText: {
    fontFamily: 'System',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  chipTextSelected: {
    color: '#43E6D0',
  },
  chipTextUnselected: {
    color: '#AAA7BA',
  },
  sectionLabel: {
    color: '#696678',
    fontFamily: 'System',
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 2,
    marginBottom: 12,
  },
  featuredImageContainer: {
    height: 160,
    backgroundColor: '#10101A',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  featuredOverlay: {
    ...(StyleSheet.absoluteFill as any),
    backgroundColor: 'rgba(102, 92, 255, 0.15)',
  },
  featuredContent: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  featuredGoal: {
    color: '#FF8A4C', // Orange
    fontFamily: 'System',
    fontWeight: '800',
    fontSize: 10,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  featuredTitle: {
    color: '#F7F5FF',
    fontFamily: 'System',
    fontWeight: '900',
    fontSize: 24,
    marginBottom: 8,
  },
  featuredMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featuredMetaText: {
    color: '#AAA7BA',
    fontFamily: 'System',
    fontWeight: '700',
    fontSize: 10,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#665CFF',
  },
  dotMuted: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#696678',
  },
  thumbnail: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(67, 230, 208, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listTitle: {
    color: '#F7F5FF',
    fontFamily: 'System',
    fontWeight: '800',
    fontSize: 16,
    marginBottom: 6,
  },
  listMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  listMetaText: {
    color: '#AAA7BA',
    fontFamily: 'System',
    fontWeight: '700',
    fontSize: 10,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  listMetaTextCyan: {
    color: '#43E6D0',
    fontFamily: 'System',
    fontWeight: '800',
    fontSize: 10,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  }
});
