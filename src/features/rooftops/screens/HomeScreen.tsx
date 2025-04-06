import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useRooftopStore } from '../store/rooftop.store';
import { RooftopCard } from '../components/RooftopCard';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { MaterialIcons } from '@expo/vector-icons';
import { Rooftop } from '../types/rooftop.types';
import { useMetadataStore } from '../store/metadata.store';

export const HomeScreen = () => {
  const router = useRouter();
  const { rooftops, fetchRooftops, setFilters, isLoading: rooftopsLoading } = useRooftopStore();
  const { experiences, fetchExperiences, isLoading: experiencesLoading } = useMetadataStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchRooftops();
    fetchExperiences();
  }, [fetchRooftops, fetchExperiences]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchRooftops()
    await fetchExperiences()
    setRefreshing(false);
  };

  const handleSearch = (text: string) => {
    setFilters({ city: text });
  };

  const handleRooftopPress = (id: string) => {
    router.push(`/rooftop/${id}`);
  };

  const renderStars = () => (
    <View style={styles.starsContainer}>
      {[1, 2, 3, 4, 5].map((star) => (
        <MaterialIcons 
          key={star} 
          name="star" 
          size={16} 
          color="#FFD700" 
          style={styles.star}
        />
      ))}
    </View>
  );

  const renderTopRooftop = ({ item }: { item: Rooftop }) => (
    <Pressable style={styles.topRooftopCardWrapper} onPress={() => handleRooftopPress(item.id)}>
      <View
        style={styles.topRooftopCard}
      >
        <Image 
          source={{ uri: item.images[0] }}
          style={styles.topRooftopImage}
          resizeMode="cover"
        />
      </View>
      <View style={styles.topRooftopContent}>
        <View>
          <Text style={styles.topRooftopTitle}>{item.title}</Text>
          <View style={styles.topRooftopLocation}>
            <MaterialIcons name="location-on" size={12} color={colors.text.primary}/>
            <Text style={styles.topRooftopLocationText}>{item.city}</Text>
          </View>
        </View>
        <View style={styles.starsContainer}>
          {renderStars()}
        </View>
      </View>
    </Pressable>
  );

  const renderExperienceCard = ({ item }: { item: any }) => (
    <Pressable 
      style={styles.experienceCard}
      onPress={() => {}}
    >
      <View style={styles.experienceImageContainer}>
        <Image 
          source={{ uri: item.image }}
          style={styles.experienceImage}
          resizeMode="cover"
        />
      </View>
      <View style={styles.experienceTitleContainer}>
        <Text style={styles.experienceTitle}>{item.name}</Text>
      </View>
    </Pressable>
  );

  return (
    <>
      {(rooftopsLoading || experiencesLoading) && !refreshing && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}
      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>People's TOPs</Text>
          <FlatList
            horizontal
            data={rooftops.slice(0, 5)}
            renderItem={renderTopRooftop}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.topRooftopsContainer}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Choose your experience</Text>
          <FlatList
            horizontal
            data={experiences}
            renderItem={renderExperienceCard}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.experiencesContainer}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Other Grooftops</Text>
          <View style={styles.gridContainer}>
            <FlatList
              data={rooftops}
              renderItem={({ item }: any) => (
                <RooftopCard 
                  rooftop={item} 
                  onPress={() => handleRooftopPress(item.id)}
                />
              )}
              keyExtractor={(item) => item.id}
              numColumns={2}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
              columnWrapperStyle={styles.rooftopGridRow}
            />
          </View>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  // Loading overlay
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 1,
  },

  // Main container styles
  scrollContainer: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
  },

  // Section common styles
  section: {
    padding: spacing.lg,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: spacing.md,
  },

  // Star rating styles
  starsContainer: {
    flexDirection: 'row'
  },
  star: {
    marginRight: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.5,
    shadowRadius: 1,
  },

  // Top Rooftops section
  topRooftopsContainer: {
    paddingRight: spacing.lg,
  },
  topRooftopCardWrapper: {
    width: 280,
    marginRight: spacing.md,
  },
  topRooftopCard: {
    width: 280,
    height: 200,
    overflow: 'hidden',
    borderRadius: 16,
  },
  topRooftopImage: {
    width: '100%',
    height: '100%',
  },
  topRooftopContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: spacing.sm,
    maxWidth: 280
  },
  topRooftopTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  topRooftopLocation: {
    fontSize: 12,
    color: colors.text.primary,
    flexDirection: 'row',
    alignItems: 'center',
  },
  topRooftopLocationText: {
    fontSize: 12,
    color: colors.text.primary,
    marginLeft: spacing.xs,
  },

  // Experience section
  experiencesContainer: {
    paddingRight: spacing.lg,
  },
  experienceCard: {
    width: 180,
    marginRight: spacing.md
  },
  experienceImageContainer: {
    width: 180,
    overflow: 'hidden',
    borderRadius: 16,
    maxWidth: 180,
    maxHeight: 120
  },
  experienceImage: {
    width: 180,
    height: 120,
  },
  experienceTitleContainer: {
    alignItems: 'center',
  },
  experienceTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginVertical: spacing.xs,
    marginTop: spacing.sm
  },

  // Other rooftops section
  gridContainer: {
    marginTop: spacing.sm
  },
  rooftopGridRow: {
    justifyContent: 'space-between',
    marginBottom: spacing.lg
  },
}); 