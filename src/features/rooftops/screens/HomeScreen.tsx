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
import { Header } from '../../header/Header';

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
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
  },
}); 