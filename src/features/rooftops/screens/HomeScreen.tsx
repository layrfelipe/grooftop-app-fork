import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useRooftopStore } from '../store/rooftop.store';
import { RooftopCard } from '../components/RooftopCard';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';

export const HomeScreen = () => {
  const router = useRouter();
  const { rooftops, fetchRooftops, setFilters } = useRooftopStore();

  useEffect(() => {
    fetchRooftops();
  }, [fetchRooftops]);

  const handleSearch = (text: string) => {
    setFilters({ city: text });
  };

  const handleRooftopPress = (id: string) => {
    router.push(`/rooftop/${id}`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background.primary} />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Find Your Perfect</Text>
          <Text style={styles.subtitle}>Rooftop Space</Text>
        </View>
        
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search rooftops..."
            placeholderTextColor={colors.text.secondary}
            onChangeText={handleSearch}
          />
        </View>

        <ScrollView 
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {rooftops.map((rooftop) => (
            <RooftopCard 
              key={rooftop.id} 
              rooftop={rooftop} 
              onPress={() => handleRooftopPress(rooftop.id)}
            />
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
  },
  searchContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  searchInput: {
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: spacing.md,
    color: colors.text.primary,
    fontSize: 16,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
  },
}); 