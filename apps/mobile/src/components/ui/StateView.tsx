import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { AlertCircle, WifiOff, Camera, Inbox } from 'lucide-react-native';
import { Button } from '../forms/Button';
import { GlassCard } from './GlassCard';

export type StateViewType = 'loading' | 'empty' | 'error' | 'permission' | 'offline';

interface StateViewProps {
  type?: StateViewType;
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: any;
}

export const StateView: React.FC<StateViewProps> = ({
  type = 'empty',
  title,
  description,
  actionLabel,
  onAction,
  style,
}) => {
  const getDefaultTitle = () => {
    switch (type) {
      case 'loading':
        return 'Loading...';
      case 'empty':
        return 'No Data Available';
      case 'error':
        return 'Something Went Wrong';
      case 'permission':
        return 'Permission Required';
      case 'offline':
        return 'No Connection';
      default:
        return '';
    }
  };

  const getDefaultDescription = () => {
    switch (type) {
      case 'loading':
        return 'Please wait while we fetch your information.';
      case 'empty':
        return 'There is nothing here yet. Check back soon!';
      case 'error':
        return 'An unexpected error occurred. Please try again.';
      case 'permission':
        return 'This feature requires device permissions to operate.';
      case 'offline':
        return 'Please check your internet connection and retry.';
      default:
        return '';
    }
  };

  const renderIcon = () => {
    switch (type) {
      case 'loading':
        return <ActivityIndicator size="large" color="#42E8CF" />;
      case 'error':
        return <AlertCircle size={40} color="#FF6B78" />;
      case 'permission':
        return <Camera size={40} color="#7C6CFF" />;
      case 'offline':
        return <WifiOff size={40} color="#F6B85F" />;
      case 'empty':
      default:
        return <Inbox size={40} color="#A7ADBC" />;
    }
  };

  return (
    <View style={[styles.container, style]}>
      <GlassCard style={styles.card} contentStyle={styles.cardContent}>
        <View style={styles.iconContainer}>{renderIcon()}</View>
        <Text style={styles.title}>{title || getDefaultTitle()}</Text>
        <Text style={styles.description}>{description || getDefaultDescription()}</Text>
        {onAction && actionLabel && (
          <Button
            label={actionLabel}
            onPress={onAction}
            variant="primary"
            style={styles.button}
          />
        )}
      </GlassCard>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 360,
  },
  cardContent: {
    alignItems: 'center',
    padding: 28,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  title: {
    fontFamily: 'System',
    fontWeight: '800',
    fontSize: 20,
    color: '#F5F7FC',
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    fontFamily: 'System',
    fontWeight: '400',
    fontSize: 14,
    color: '#A7ADBC',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  button: {
    width: '100%',
  },
});
