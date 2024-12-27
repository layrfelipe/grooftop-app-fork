import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Text,
  Modal,
  TextInput,
} from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface HeaderProps {
  onSearch: (text: string) => void;
}

export const Header = ({ onSearch }: HeaderProps) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const router = useRouter();

  return (
    <>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../../assets/images/logo.png')}
            resizeMode="contain"
            style={styles.logo}
          />
          <TouchableOpacity 
            style={styles.menuButton}
            onPress={() => setMenuVisible(true)}
          >
            <Ionicons name="menu" size={32} color={colors.text.inverse} />
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        visible={menuVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setMenuVisible(false)}
      >
        <View style={styles.menuModal}>
          <View style={styles.menuContent}>
            <View style={styles.menuHeader}>
              <Image 
                source={require('../../../assets/images/logo.png')}
                style={styles.menuLogo}
                resizeMode="contain"
              />
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setMenuVisible(false)}
              >
                <Ionicons name="close" size={24} color={colors.text.inverse} />
              </TouchableOpacity>
            </View>

            <View style={styles.menuItems}>
              <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/')}>
                <Text style={styles.menuItemText}>Home</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); router.push('/bookings') }}>
                <Text style={styles.menuItemText}>Bookings</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); router.push('/create') }}>
                <Text style={styles.menuItemText}>Add your rooftop</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/profile')}>
                <Text style={styles.menuItemText}>Account</Text>
              </TouchableOpacity>
            </View>

            {/* <View style={styles.actionButtons}>
              <TouchableOpacity style={[styles.actionButton, styles.primaryButton]}>
                <Ionicons name="home" size={24} color="#000" />
                <View>
                  <Text style={styles.actionButtonTitle}>Become a Grooftopper</Text>
                  <Text style={styles.actionButtonSubtitle}>make your space available</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]}>
                <Ionicons name="calendar" size={24} color="#000" />
                <View>
                  <Text style={styles.actionButtonTitle}>Organize an Event</Text>
                  <Text style={styles.actionButtonSubtitle}>gather folks on a rooftop</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.actionButton, styles.darkButton]}>
                <Ionicons name="camera" size={24} color="#fff" />
                <View>
                  <Text style={[styles.actionButtonTitle, styles.darkButtonText]}>Become a topographer</Text>
                  <Text style={[styles.actionButtonSubtitle, styles.darkButtonText]}>take photos of grooftop (events)</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.actionButton, styles.darkButton]}>
                <Ionicons name="happy" size={24} color="#fff" />
                <View>
                  <Text style={[styles.actionButtonTitle, styles.darkButtonText]}>Become a GroofArtist</Text>
                  <Text style={[styles.actionButtonSubtitle, styles.darkButtonText]}>share your art or skills from a height</Text>
                </View>
              </TouchableOpacity>
            </View> */}
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.background.primary,
    paddingVertical: spacing.lg,
  },
  logoContainer: {
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  logo: {
    width: 120,
    height: 48,
    alignSelf: 'flex-start',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    color: '#000',
  },
  searchIcon: {
    position: 'absolute',
    right: 70,
    padding: spacing.sm,
  },
  menuButton: {
    marginLeft: spacing.md,
    padding: spacing.sm,
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
  },
  menuModal: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  menuContent: {
    flex: 1,
    padding: spacing.lg,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  menuLogo: {
    width: 120,
    height: 40,
  },
  closeButton: {
    padding: spacing.sm,
  },
  searchWrapper: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  filterButton: {
    backgroundColor: '#333',
    padding: spacing.sm,
    borderRadius: 8,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItems: {
    marginBottom: spacing.xl,
  },
  menuItem: {
    paddingVertical: spacing.md,
  },
  menuItemText: {
    color: '#fff',
    fontSize: 18,
  },
  actionButtons: {
    gap: spacing.md,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 12,
    gap: spacing.md,
  },
  primaryButton: {
    backgroundColor: '#E6FF00',
  },
  secondaryButton: {
    backgroundColor: '#00E5FF',
  },
  darkButton: {
    backgroundColor: '#333',
  },
  actionButtonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  actionButtonSubtitle: {
    fontSize: 12,
    color: '#333',
  },
  darkButtonText: {
    color: '#fff',
  },
}); 