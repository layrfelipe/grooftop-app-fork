import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Text,
  Pressable,
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
          <Pressable onPress={() => router.push('/')}>
            <Image 
              source={require('../../../assets/images/logo.png')}
              resizeMode="contain"
              style={styles.logo}
            />
          </Pressable>
          <TouchableOpacity 
            style={styles.menuButton}
            onPress={() => setMenuVisible(!menuVisible)}
          >
            <Ionicons 
              name={menuVisible ? "close" : "menu"} 
              size={32} 
              color={colors.text.inverse} 
            />
          </TouchableOpacity>
        </View>
      </View>

      {menuVisible && (
        <View style={styles.menuOverlay}>
          <View style={styles.menuContent}>
            <View>
              <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); router.push('/') }}>
                <Text style={styles.menuItemText}>Home</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); router.push('/bookings') }}>
                <Text style={styles.menuItemText}>Bookings</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); router.push('/create') }}>
                <Text style={styles.menuItemText}>Add a rooftop</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); router.push('/profile') }}>
                <Text style={styles.menuItemText}>Account</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.background.primary,
  },
  logoContainer: {
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 48,
    alignSelf: 'flex-start',
  },
  menuButton: {
    marginLeft: spacing.md,
    padding: spacing.md,
    borderRadius: 12,
  },
  menuOverlay: {
    backgroundColor: colors.background.primary,
    padding: 0,
    margin: 0,
    height: '100%',
  },
  menuContent: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  menuItem: {
    paddingVertical: spacing.md,
  },
  menuItemText: {
    color: '#fff',
    fontSize: 18,
  }
}); 