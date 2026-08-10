import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { ForgeBackground } from '../../components/ui/ForgeBackground';
import { ForgeHeader } from '../../components/ui/ForgeHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { BarChart2, CalendarDays, Flame, Dumbbell, Clock } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function ProgressScreen() {
  const [period, setPeriod] = useState('WEEK');
  const [metric, setMetric] = useState('WORKOUTS');

  const periods = ['WEEK', 'MONTH', '3 MONTHS', 'YEAR'];
  const metrics = ['WORKOUTS', 'DURATION', 'VOLUME', 'CALORIES'];

  // No real data hook yet, so we show an empty state for the chart
  const hasData = false;

  return (
    <ForgeBackground>
      <ForgeHeader />
      
      <ScrollView contentContainerStyle={{ paddingBottom: 140 }} showsVerticalScrollIndicator={false}>
        
        {/* Title */}
        <Animated.View entering={FadeInDown.duration(400).delay(100)} style={{ paddingHorizontal: 24, marginBottom: 24 }}>
          <Text style={styles.titleLine1}>YOUR</Text>
          <Text style={styles.titleLine2}>PROGRESS</Text>
        </Animated.View>

        {/* Period Selector */}
        <Animated.View entering={FadeInDown.duration(400).delay(150)} style={styles.selectorContainer}>
          {periods.map(p => (
            <TouchableOpacity 
              key={p} 
              style={[styles.chip, period === p ? styles.chipSelected : styles.chipUnselected]}
              onPress={() => setPeriod(p)}
              activeOpacity={0.7}
            >
              <Text style={[styles.chipText, period === p ? styles.chipTextSelected : styles.chipTextUnselected]}>{p}</Text>
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* Chart Panel */}
        <Animated.View entering={FadeInDown.duration(400).delay(200)} style={{ paddingHorizontal: 24, marginBottom: 24 }}>
          <GlassCard style={{ padding: 24 }}>
            
            {/* Metric Switcher */}
            <View style={styles.metricSwitcher}>
              {metrics.map(m => (
                <TouchableOpacity 
                  key={m}
                  onPress={() => setMetric(m)}
                  style={{ borderBottomWidth: 2, borderBottomColor: metric === m ? '#665CFF' : 'transparent', paddingBottom: 8 }}
                >
                  <Text style={[styles.metricSwitcherText, { color: metric === m ? '#F7F5FF' : '#AAA7BA' }]}>{m}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Chart Area */}
            <View style={styles.chartArea}>
              {!hasData ? (
                <View style={styles.emptyChart}>
                  <BarChart2 color="#AAA7BA" size={32} />
                  <Text style={styles.emptyChartText}>No history available for this period.</Text>
                </View>
              ) : (
                <View />
              )}
            </View>
          </GlassCard>
        </Animated.View>

        {/* Metric Cards */}
        <Animated.View entering={FadeInDown.duration(400).delay(300)} style={styles.metricsGrid}>
          <GlassCard style={styles.metricCard}>
             <View style={[styles.metricIconWrapper, { backgroundColor: 'rgba(67, 230, 208, 0.15)' }]}>
               <Dumbbell color="#43E6D0" size={16} />
             </View>
             <Text style={styles.metricValue}>0</Text>
             <Text style={styles.metricLabel}>WORKOUTS</Text>
          </GlassCard>
          
          <GlassCard style={styles.metricCard}>
             <View style={[styles.metricIconWrapper, { backgroundColor: 'rgba(102, 92, 255, 0.15)' }]}>
               <Clock color="#665CFF" size={16} />
             </View>
             <Text style={styles.metricValue}>0</Text>
             <Text style={styles.metricLabel}>MINUTES</Text>
          </GlassCard>

          <GlassCard style={styles.metricCard}>
             <View style={[styles.metricIconWrapper, { backgroundColor: 'rgba(255, 138, 76, 0.15)' }]}>
               <Flame color="#FF8A4C" size={16} />
             </View>
             <Text style={styles.metricValue}>0</Text>
             <Text style={styles.metricLabel}>STREAK</Text>
          </GlassCard>

          <GlassCard style={styles.metricCard}>
             <View style={[styles.metricIconWrapper, { backgroundColor: 'rgba(255, 255, 255, 0.1)' }]}>
               <BarChart2 color="#AAA7BA" size={16} />
             </View>
             <Text style={styles.metricValue}>0</Text>
             <Text style={styles.metricLabel}>TOTAL VOLUME</Text>
          </GlassCard>
        </Animated.View>

        {/* Consistency Calendar */}
        <Animated.View entering={FadeInDown.duration(400).delay(400)} style={{ paddingHorizontal: 24, marginTop: 24 }}>
          <Text style={styles.sectionLabel}>CONSISTENCY</Text>
          <GlassCard style={{ padding: 24, alignItems: 'center' }}>
            <CalendarDays color="#AAA7BA" size={32} style={{ marginBottom: 16 }} />
            <Text style={styles.emptyChartText}>Complete more workouts to see your heatmap.</Text>
          </GlassCard>
        </Animated.View>

      </ScrollView>
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
  selectorContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 24,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  chipSelected: {
    backgroundColor: 'rgba(102, 92, 255, 0.15)',
    borderColor: '#665CFF',
  },
  chipUnselected: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'transparent',
  },
  chipText: {
    fontFamily: 'System',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  chipTextSelected: {
    color: '#665CFF',
  },
  chipTextUnselected: {
    color: '#AAA7BA',
  },
  metricSwitcher: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  metricSwitcherText: {
    fontFamily: 'System',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  chartArea: {
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
    paddingTop: 24,
  },
  emptyChart: {
    alignItems: 'center',
    gap: 12,
  },
  emptyChartText: {
    color: '#AAA7BA',
    fontFamily: 'System',
    fontWeight: '600',
    fontSize: 12,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 24,
    gap: 12,
  },
  metricCard: {
    width: '48%',
    padding: 16,
    alignItems: 'flex-start',
  },
  metricIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricValue: {
    color: '#F7F5FF',
    fontFamily: 'System',
    fontWeight: '900',
    fontSize: 20,
    marginBottom: 2,
  },
  metricLabel: {
    color: '#696678',
    fontFamily: 'System',
    fontWeight: '700',
    fontSize: 10,
    letterSpacing: 1,
  },
  sectionLabel: {
    color: '#696678',
    fontFamily: 'System',
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 2,
    marginBottom: 16,
  },
});
