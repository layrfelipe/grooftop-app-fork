import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../auth/store/auth.store';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const MenuItem = ({ icon, title, subtitle, onPress, index, variant = 'default' }) => (
  <AnimatedPressable
    onPress={onPress}
    style={styles.menuItem}
    entering={FadeInDown.delay(index * 100)}
  >
    <BlurView intensity={20} tint="dark" style={styles.menuItemContent}>
      <View style={[styles.menuIcon, variant === 'danger' && styles.menuIconDanger]}>
        <Ionicons 
          name={icon} 
          size={24} 
          color={variant === 'danger' ? colors.error : colors.primary} 
        />
      </View>
      <View style={styles.menuText}>
        <Text style={[
          styles.menuTitle,
          variant === 'danger' && styles.menuTitleDanger
        ]}>{title}</Text>
        <Text style={styles.menuSubtitle}>{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.text.secondary} />
    </BlurView>
  </AnimatedPressable>
);

export const ProfileScreen = () => {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={colors.background.gradient}
        style={styles.gradient}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            style={styles.header}
            entering={FadeInUp.duration(500)}
          >
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.name}>{user?.name || 'Guest'}</Text>
          </Animated.View>

          <View style={styles.menu}>
            <MenuItem
              icon="person-outline"
              title="Edit Profile"
              subtitle="Update your personal information"
              onPress={() => router.push('/(app)/profile/edit')}
              index={0}
            />
            <MenuItem
              icon="calendar-outline"
              title="My Bookings"
              subtitle="View your booking history"
              onPress={() => router.push('/(app)/bookings')}
              index={1}
            />
            <MenuItem
              icon="heart-outline"
              title="Favorites"
              subtitle="Your saved rooftop spaces"
              onPress={() => {}}
              index={2}
            />
            <MenuItem
              icon="settings-outline"
              title="Settings"
              subtitle="App preferences and account settings"
              onPress={() => {}}
              index={3}
            />
            <MenuItem
              icon="help-circle-outline"
              title="Help & Support"
              subtitle="Get assistance and FAQs"
              onPress={() => {}}
              index={4}
            />
            <MenuItem
              icon="log-out-outline"
              title="Logout"
              subtitle="Sign out of your account"
              onPress={handleLogout}
              index={5}
              variant="danger"
            />
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  gradient: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
  },
  header: {
    marginBottom: spacing.xl,
  },
  greeting: {
    fontSize: 16,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  name: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  menu: {
    gap: spacing.md,
  },
  menuItem: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.glass.background,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIconDanger: {
    backgroundColor: colors.error + '20',
  },
  menuText: {
    flex: 1,
    marginLeft: spacing.md,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 2,
  },
  menuTitleDanger: {
    color: colors.error,
  },
  menuSubtitle: {
    fontSize: 14,
    color: colors.text.secondary,
  },
}); 