import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, Bell } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface ForgeHeaderProps {
  onBack?: () => void;
  showProfile?: boolean;
  profileName?: string;
  showNotification?: boolean;
  subtitle?: string;
  rightAction?: React.ReactNode;
}

export const ForgeHeader: React.FC<ForgeHeaderProps> = ({
  onBack,
  showProfile,
  profileName,
  showNotification,
  subtitle,
  rightAction,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      <View style={styles.leftSection}>
        {onBack && (
          <TouchableOpacity onPress={onBack} activeOpacity={0.7} style={styles.backButtonWrapper}>
            <LinearGradient
              colors={['rgba(175, 168, 255, 0.3)', 'rgba(255, 255, 255, 0.05)']}
              style={styles.backButtonBorder}
            >
              <View style={styles.backButtonInner}>
                <ChevronLeft color="#F7F5FF" size={24} />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.centerSection}>
        <Text style={styles.wordmark}>FORGE AI</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>

      <View style={styles.rightSection}>
        {rightAction ? (
           rightAction
        ) : (
          <>
            {showNotification && (
              <TouchableOpacity style={styles.iconButton}>
                <Bell color="#AAA7BA" size={20} />
              </TouchableOpacity>
            )}
            {showProfile && (
              <TouchableOpacity style={styles.profileAvatar}>
                <Text style={styles.profileInitial}>
                  {profileName ? profileName.charAt(0).toUpperCase() : 'U'}
                </Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 16,
    zIndex: 10,
  },
  leftSection: {
    flex: 1,
    alignItems: 'flex-start',
  },
  centerSection: {
    flex: 2,
    alignItems: 'center',
  },
  rightSection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 12,
  },
  wordmark: {
    fontFamily: 'System',
    fontWeight: '900',
    fontSize: 16,
    letterSpacing: 2,
    color: '#F7F5FF',
  },
  subtitle: {
    fontFamily: 'System',
    fontSize: 10,
    color: '#43E6D0',
    letterSpacing: 1,
    marginTop: 2,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  backButtonWrapper: {
    borderRadius: 24,
    shadowColor: '#665CFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  backButtonBorder: {
    padding: 1,
    borderRadius: 24,
  },
  backButtonInner: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(27, 27, 42, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(102, 92, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(102, 92, 255, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInitial: {
    color: '#43E6D0',
    fontWeight: '900',
    fontSize: 16,
  }
});
