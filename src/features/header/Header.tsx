import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Text,
  Pressable,
  TextInput,
  ScrollView,
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
  const [advancedSearchVisible, setAdvancedSearchVisible] = useState(false);
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
        <ScrollView style={styles.menuOverlay} showsVerticalScrollIndicator={false}>
          <View style={styles.searchContainer}>
            {
              !advancedSearchVisible && (
                <View style={styles.searchInputContainer}>
                  <View style={styles.inputWrapper}>
                    <TextInput 
                      placeholder="Rio de Janeiro"
                  placeholderTextColor="#999"
                  style={styles.searchInput}
                />
                <TouchableOpacity style={styles.searchButton}>
                  <Ionicons name="search" size={24} color={colors.tertiary} />
                </TouchableOpacity>
              </View>
              <TouchableOpacity 
                style={styles.filterButtonOutside}
                onPress={() => setAdvancedSearchVisible(!advancedSearchVisible)}
              >
                <Ionicons 
                  name={advancedSearchVisible ? "close-outline" : "options-outline"} 
                  size={24} 
                  color={colors.text.inverse} 
                />
              </TouchableOpacity>
            </View>
            )}
            
            {advancedSearchVisible && (
              <View style={styles.advancedSearch}>
                <TouchableOpacity style={styles.backButton} onPress={() => setAdvancedSearchVisible(false)}>
                  <Text style={styles.backButtonText}>go back to simple search</Text>
                </TouchableOpacity>
                
                <View style={styles.filterSection}>
                  <Text style={styles.filterLabel}>Location</Text>
                  <TouchableOpacity style={styles.dropdown}>
                    <Text style={styles.dropdownText}>Rio de Janeiro</Text>
                    <Ionicons name="chevron-down" size={18} color={colors.tertiary} />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.filterSection}>
                  <Text style={styles.filterLabel}>Type</Text>
                  <View style={styles.optionRow}>
                    <TouchableOpacity style={styles.optionButton}>
                      <Text style={styles.optionText}>public</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.optionButton}>
                      <Text style={styles.optionText}>private</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.optionButton}>
                      <Text style={styles.optionText}>Mirante</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                
                <View style={styles.filterSection}>
                  <Text style={styles.filterLabel}>Experiences or Goals</Text>
                  <View style={styles.tagsContainer}>
                    <TouchableOpacity style={styles.tagButton}><Text style={styles.tagText}>relax</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.tagButton}><Text style={styles.tagText}>socializing</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.tagButton}><Text style={styles.tagText}>solitude</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.tagButton}><Text style={styles.tagText}>party time</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.tagButton}><Text style={styles.tagText}>drinks</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.tagButton}><Text style={styles.tagText}>music</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.tagButton}><Text style={styles.tagText}>adult only</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.tagButton}><Text style={styles.tagText}>sunbathing</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.tagButton}><Text style={styles.tagText}>meditation</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.tagButton}><Text style={styles.tagText}>mountain view</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.tagButton}><Text style={styles.tagText}>city view</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.tagButton}><Text style={styles.tagText}>nature view</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.tagButton}><Text style={styles.tagText}>monuments view</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.tagButton}><Text style={styles.tagText}>hosting an event</Text></TouchableOpacity>
                  </View>
                </View>
                
                <View style={styles.filterSection}>
                  <Text style={styles.filterLabel}>Facilities</Text>
                  <View style={styles.tagsContainer}>
                    <TouchableOpacity style={styles.tagButton}><Text style={styles.tagText}>pet friendly</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.tagButton}><Text style={styles.tagText}>child friendly</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.tagButton}><Text style={styles.tagText}>swimming pool</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.tagButton}><Text style={styles.tagText}>sanitary</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.tagButton}><Text style={styles.tagText}>seating</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.tagButton}><Text style={styles.tagText}>BBQ</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.tagButton}><Text style={styles.tagText}>parking</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.tagButton}><Text style={styles.tagText}>bike friendly</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.tagButton}><Text style={styles.tagText}>PwD Friendly</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.tagButton}><Text style={styles.tagText}>Elevator</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.tagButton}><Text style={styles.tagText}>Jacuzzi</Text></TouchableOpacity>
                  </View>
                </View>
                
                <TouchableOpacity style={styles.showButton}>
                  <Text style={styles.showButtonText}>Show</Text>
                  <Text style={styles.showCount}>100</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {!advancedSearchVisible && <View style={styles.menuContent}>
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
              <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); router.push('/spaces') }}>
                <Text style={styles.menuItemText}>My spaces</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); router.push('/favs') }}>
                <Text style={styles.menuItemText}>My favs</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); router.push('/profile') }}>
                <Text style={styles.menuItemText}>Account</Text>
              </TouchableOpacity>
            </View>
          </View>}
        </ScrollView>
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
  },
  searchContainer: {
    padding: spacing.md,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.text.primary,
    borderRadius: 24,
    overflow: 'hidden',
    flex: 1,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 48,
    paddingHorizontal: spacing.md,
    fontSize: 16,
  },
  searchButton: {
    padding: spacing.sm,
    borderRadius: 50,
    marginRight: spacing.sm,
  },
  filterButtonOutside: {
    backgroundColor: colors.background.primary,
    padding: spacing.sm,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#444',
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterButton: {
    padding: spacing.sm,
    marginRight: spacing.sm,
  },
  advancedSearch: {
    marginTop: spacing.md,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  backButton: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
    padding: spacing.sm
  },
  backButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  filterSection: {
    marginBottom: spacing.lg,
  },
  filterLabel: {
    color: '#fff',
    fontSize: 16,
    marginBottom: spacing.sm,
  },
  dropdown: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 16,
  },
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  optionButton: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  optionText: {
    fontSize: 14,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  tagButton: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.xs,
  },
  tagText: {
    fontSize: 14,
  },
  showButton: {
    backgroundColor: colors.primary,
    borderRadius: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.lg,
    alignSelf: 'center',
    marginTop: spacing.md,
    width: 100,
  },
  showButtonText: {
    fontSize: 14,
    marginRight: spacing.xs,
  },
  showCount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.tertiary,
  },
}); 