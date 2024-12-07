import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useRooftopStore } from '../store/rooftop.store';
import { RooftopCard } from '../components/RooftopCard';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';

const { width } = Dimensions.get('window');

export const HomeScreen = () => {
  const router = useRouter();
  const { rooftops, isLoading, error, fetchRooftops } = useRooftopStore();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchRooftops();
  }, []);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    fetchRooftops({ city: text });
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    fetchRooftops();
  };

  const handleRooftopPress = (id: string) => {
    router.push(`/rooftop/${id}`);
  };

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Text 
          style={styles.retryText}
          onPress={() => fetchRooftops()}
        >
          Tap to retry
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.background.primary, colors.background.secondary]}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Find Your Perfect</Text>
          <Text style={styles.headerSubtitle}>Rooftop Space</Text>

          <View style={styles.searchContainer}>
            <MaterialIcons 
              name="search" 
              size={24} 
              color={colors.text.secondary}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by city..."
              placeholderTextColor={colors.text.secondary}
              value={searchQuery}
              onChangeText={handleSearch}
            />
            {searchQuery ? (
              <MaterialIcons
                name="close"
                size={24}
                color={colors.text.secondary}
                onPress={handleClearSearch}
                style={styles.clearIcon}
              />
            ) : null}
          </View>
        </View>

        <FlatList
          data={rooftops}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <RooftopCard
              rooftop={item}
              onPress={() => handleRooftopPress(item.id)}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            isLoading ? (
              <ActivityIndicator 
                size="large" 
                color={colors.primary}
                style={styles.loader}
              />
            ) : (
              <Text style={styles.emptyText}>
                No rooftops found
              </Text>
            )
          }
        />
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
  header: {
    padding: spacing.lg,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: spacing.lg,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  searchInput: {
    flex: 1,
    marginLeft: spacing.md,
    fontSize: 16,
    color: colors.text.primary,
    height: 24,
  },
  clearIcon: {
    marginLeft: spacing.sm,
  },
  listContent: {
    padding: spacing.lg,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.background.primary,
  },
  errorText: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  retryText: {
    fontSize: 16,
    color: colors.primary,
    textDecorationLine: 'underline',
  },
  loader: {
    marginTop: spacing.xl * 2,
  },
  emptyText: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: spacing.xl * 2,
  },
}); 