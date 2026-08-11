import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, ActivityIndicator, Alert, StyleSheet, Dimensions } from 'react-native';
import { useAuthStore } from '../../store/authStore';
import { User, Settings, Shield, HelpCircle, LogOut, ChevronRight, Activity, Bell, Smartphone, Lock } from 'lucide-react-native';
import { ForgeBackground } from '../../components/ui/ForgeBackground';
import { ForgeHeader } from '../../components/ui/ForgeHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/forms/Button';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

// Need to import Utensils for the icon
import { Utensils } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const MenuOption = ({ icon: Icon, title, subtitle, onPress, destructive = false, isLast = false }: any) => (
  <TouchableOpacity 
    style={[styles.menuRow, !isLast && styles.menuRowBorder]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={[styles.menuIconWrapper, destructive ? styles.menuIconDestructive : styles.menuIconStandard]}>
      <Icon size={20} color={destructive ? '#FF5F6D' : '#AAA7BA'} />
    </View>
    <View style={styles.menuTextContainer}>
      <Text style={[styles.menuTitle, destructive && styles.menuTitleDestructive]}>{title}</Text>
      {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
    </View>
    {!destructive && <ChevronRight size={20} color="#696678" />}
  </TouchableOpacity>
);

export default function ProfileScreen() {
  const { user, signOut, isSigningOut } = useAuthStore();
  const userName = user?.email ? user.email.split('@')[0] : "Champion";
  
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleConfirmSignOut = async () => {
    setShowLogoutModal(false);
    await signOut();
  };

  return (
    <ForgeBackground>
      <ForgeHeader />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Profile Header */}
        <Animated.View entering={FadeInDown.duration(400).delay(100)} style={styles.headerArea}>
          <View style={styles.avatarContainer}>
            <LinearGradient
              colors={['rgba(67, 230, 208, 0.4)', 'rgba(102, 92, 255, 0.4)']}
              style={styles.avatarGlow}
            />
            <View style={styles.avatar}>
               <Text style={styles.avatarInitial}>{userName.charAt(0).toUpperCase()}</Text>
            </View>
          </View>
          
          <Text style={styles.userName}>{userName}</Text>
          <Text style={styles.userEmail}>{user?.email || 'No email provided'}</Text>
          <View style={styles.goalBadge}>
             <Text style={styles.goalText}>BUILD STRENGTH</Text>
          </View>
        </Animated.View>

        {/* Profile Summary */}
        <Animated.View entering={FadeInDown.duration(400).delay(200)} style={styles.section}>
          <GlassCard style={styles.summaryCard}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>ADD</Text>
              <Text style={styles.summaryLabel}>WEIGHT</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>ADD</Text>
              <Text style={styles.summaryLabel}>HEIGHT</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>0</Text>
              <Text style={styles.summaryLabel}>WORKOUTS</Text>
            </View>
          </GlassCard>
        </Animated.View>

        {/* Settings Groups */}
        <Animated.View entering={FadeInDown.duration(400).delay(300)} style={styles.section}>
          <Text style={styles.groupLabel}>PERSONAL</Text>
          <GlassCard style={styles.groupCard}>
            <MenuOption icon={User} title="Edit Profile" subtitle="Name, email and goals" onPress={() => Alert.alert('Coming Soon', 'This feature is coming soon!')} />
            <MenuOption icon={Activity} title="Body Measurements" subtitle="Track your progress" onPress={() => Alert.alert('Coming Soon', 'This feature is coming soon!')} />
            <MenuOption icon={Utensils} title="Dietary Preferences" subtitle="Vegan, keto, allergies" isLast onPress={() => Alert.alert('Coming Soon', 'This feature is coming soon!')} />
          </GlassCard>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(400).delay(350)} style={styles.section}>
          <Text style={styles.groupLabel}>EXPERIENCE</Text>
          <GlassCard style={styles.groupCard}>
            <MenuOption icon={Bell} title="Notifications" onPress={() => Alert.alert('Coming Soon', 'This feature is coming soon!')} />
            <MenuOption icon={Smartphone} title="Sounds & Haptics" onPress={() => Alert.alert('Coming Soon', 'This feature is coming soon!')} />
            <MenuOption icon={Settings} title="Units & Language" isLast onPress={() => Alert.alert('Coming Soon', 'This feature is coming soon!')} />
          </GlassCard>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(400).delay(400)} style={styles.section}>
          <Text style={styles.groupLabel}>ACCOUNT</Text>
          <GlassCard style={styles.groupCard}>
            <MenuOption icon={Lock} title="Privacy & Security" onPress={() => Alert.alert('Coming Soon', 'This feature is coming soon!')} />
            <MenuOption icon={HelpCircle} title="Help & Support" onPress={() => Alert.alert('Coming Soon', 'This feature is coming soon!')} />
            <MenuOption icon={Shield} title="About Forge AI" isLast onPress={() => Alert.alert('Coming Soon', 'This feature is coming soon!')} />
          </GlassCard>
        </Animated.View>

        {/* Sign Out */}
        <Animated.View entering={FadeInDown.duration(400).delay(450)} style={[styles.section, { marginTop: 16 }]}>
          {isSigningOut ? (
             <GlassCard style={{ padding: 24, alignItems: 'center' }}>
               <ActivityIndicator color="#FF5F6D" />
               <Text style={{ color: '#AAA7BA', marginTop: 12, fontFamily: 'System', fontWeight: '700' }}>Signing out...</Text>
             </GlassCard>
          ) : (
            <GlassCard variant="danger" style={styles.groupCard}>
              <MenuOption icon={LogOut} title="Sign Out" destructive isLast onPress={() => setShowLogoutModal(true)} />
            </GlassCard>
          )}
        </Animated.View>
        
      </ScrollView>

      {/* Logout Confirmation Modal */}
      <Modal visible={showLogoutModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIconWrapper}>
              <LogOut size={32} color="#FF5F6D" />
            </View>
            <Text style={styles.modalTitle}>SIGN OUT</Text>
            <Text style={styles.modalSubtitle}>
              Are you sure you want to sign out? You will need to log back in to access your workouts.
            </Text>
            
            <View style={styles.modalActions}>
              <Button label="CANCEL" onPress={() => setShowLogoutModal(false)} variant="secondary" style={{ flex: 1 }} />
              <View style={{ width: 12 }} />
              <Button label="SIGN OUT" onPress={handleConfirmSignOut} variant="destructive" style={{ flex: 1 }} />
            </View>
          </View>
        </View>
      </Modal>
    </ForgeBackground>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 120,
  },
  headerArea: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarContainer: {
    position: 'relative',
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarGlow: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    opacity: 0.5,
    filter: 'blur(10px)',
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#10101A',
    borderWidth: 2,
    borderColor: '#43E6D0',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  avatarInitial: {
    color: '#43E6D0',
    fontFamily: 'System',
    fontWeight: '900',
    fontSize: 40,
  },
  userName: {
    color: '#F7F5FF',
    fontFamily: 'System',
    fontWeight: '900',
    fontSize: 24,
    marginBottom: 4,
  },
  userEmail: {
    color: '#AAA7BA',
    fontFamily: 'System',
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 12,
  },
  goalBadge: {
    backgroundColor: 'rgba(255, 138, 76, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 138, 76, 0.3)',
  },
  goalText: {
    color: '#FF8A4C',
    fontFamily: 'System',
    fontWeight: '800',
    fontSize: 10,
    letterSpacing: 1,
  },
  section: {
    marginBottom: 24,
  },
  summaryCard: {
    flexDirection: 'row',
    padding: 0, // override default padding
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryItem: {
    flex: 1,
    paddingVertical: 20,
    alignItems: 'center',
  },
  summaryValue: {
    color: '#F7F5FF',
    fontFamily: 'System',
    fontWeight: '900',
    fontSize: 18,
    marginBottom: 4,
  },
  summaryLabel: {
    color: '#696678',
    fontFamily: 'System',
    fontWeight: '800',
    fontSize: 10,
    letterSpacing: 1,
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  groupLabel: {
    color: '#696678',
    fontFamily: 'System',
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 2,
    marginBottom: 12,
  },
  groupCard: {
    padding: 0,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  menuRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  menuIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuIconStandard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  menuIconDestructive: {
    backgroundColor: 'rgba(255, 95, 109, 0.1)',
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    color: '#F7F5FF',
    fontFamily: 'System',
    fontWeight: '700',
    fontSize: 14,
  },
  menuTitleDestructive: {
    color: '#FF5F6D',
  },
  menuSubtitle: {
    color: '#AAA7BA',
    fontFamily: 'System',
    fontWeight: '500',
    fontSize: 12,
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(11, 11, 19, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#10101A',
    borderRadius: 32,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  modalIconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 95, 109, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    color: '#F7F5FF',
    fontFamily: 'System',
    fontWeight: '900',
    fontSize: 20,
    letterSpacing: 1,
    marginBottom: 12,
  },
  modalSubtitle: {
    color: '#AAA7BA',
    fontFamily: 'System',
    fontWeight: '500',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
  },
  modalActions: {
    flexDirection: 'row',
    width: '100%',
  }
});
