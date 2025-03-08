import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator, Dimensions, FlatList, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Button } from '../../../components/Button';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { rooftopService } from '../services/rooftop.service';
import { Rooftop } from '../types/rooftop.types';
// import MapView, { Marker } from 'react-native-maps';
import ReviewCard from '../../reviewDetailCard';
import { useBookmarkStore } from '../store/bookmark.store';
import { useReviewStore } from '../../reviews/store/review.store';
import { useAuthStore } from '../../auth/store/auth.store';

const VIEW_ON_DATA = [
  { id: '1', title: 'Lorem Ipsum' },
  { id: '2', title: 'Dolor sit' },
  { id: '3', title: 'Amet conqueous' },
  { id: '4', title: 'Vivamus Magna' },
  { id: '5', title: 'Sed Consequat' },
  { id: '6', title: 'Mauris Placerat' },
];

const MOCK_ROOFTOPS = [
  { id: '1', name: 'Sunset Lounge', location: 'Rio de Janeiro', distance: '1.2km' },
  { id: '2', name: 'Sky Garden', location: 'Rio de Janeiro', distance: '1.5km' },
  { id: '3', name: 'Cloud Bar', location: 'Rio de Janeiro', distance: '1.8km' },
  { id: '4', name: 'Vista Heights', location: 'Rio de Janeiro', distance: '2.0km' },
  { id: '5', name: 'Rooftop 360', location: 'Rio de Janeiro', distance: '2.2km' },
  { id: '6', name: 'Urban Oasis', location: 'Rio de Janeiro', distance: '2.5km' },
  { id: '7', name: 'Sky Deck', location: 'Rio de Janeiro', distance: '2.7km' },
  { id: '8', name: 'The Summit', location: 'Rio de Janeiro', distance: '3.0km' },
  { id: '9', name: 'Altitude Bar', location: 'Rio de Janeiro', distance: '3.2km' },
];

export const RooftopDetailsScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [rooftop, setRooftop] = useState<Rooftop | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addBookmark, removeBookmark, isBookmarked, fetchBookmarks } = useBookmarkStore();
  const [isBookmarkLoading, setIsBookmarkLoading] = useState(false);
  const { reviews, fetchRooftopReviews, getAverageRating, isLoading: isReviewsLoading } = useReviewStore();
  const { user } = useAuthStore();

  useEffect(() => {
    loadRooftop();
    fetchBookmarks();
    if (id) {
      fetchRooftopReviews(id);
    }

    // Cleanup function
    return () => {
      // Clear reviews when navigating away
      useReviewStore.getState().clearReviews();
    };
  }, [id]);

  const loadRooftop = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await rooftopService.getRooftop(id);

      if (!data || !data.images || data.images.length === 0) {
        throw new Error('Invalid rooftop data');
      }
      setRooftop(data);
    } catch (err: any) {
      console.error('Failed to load rooftop:', err);
      setError('Failed to load rooftop details: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToMyTops = async () => {
    if (!rooftop) return;
    
    try {
      setIsBookmarkLoading(true);
      
      if (isBookmarked(rooftop.id)) {
        await removeBookmark(rooftop.id);
      } else {
        await addBookmark(rooftop.id);
      }
    } catch (err: any) {
      console.error('Failed to update bookmark:', err);
    } finally {
      setIsBookmarkLoading(false);
    }
  };

  const handleBook = () => {
    // TODO: Implement booking flow
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error || !rooftop) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>{error || 'Rooftop not found'}</Text>
        <Button 
          title="Go Back" 
          onPress={() => router.push('/')}
          variant="secondary"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.contentScrollView}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.rooftopBasicInfo}>
          <Text style={styles.rooftopTitle}>{rooftop.title}</Text>
          {/* TODO: Add height as API's response */}
          <Text style={styles.rooftopCity}>Location: {rooftop.city}, Height: 1000m</Text>
          <Text style={styles.rooftopRating}>
            <Ionicons name="star" size={16} color={'yellow'} />
            <Ionicons name="star" size={16} color={'yellow'} />
            <Ionicons name="star" size={16} color={'yellow'} />
            <Ionicons name="star" size={16} color={'yellow'} />
            <Ionicons name="star" size={16} color={'yellow'}/>
          </Text>
        </View>

        <View style={styles.imageContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carouselContent}
            snapToInterval={Dimensions.get('window').width}
          >
            {[1, 2, 3, 4].map((_, index) => (
              <View key={index} style={styles.carouselSlide}>
                <Image 
                  source={{ uri: rooftop.images[0] }} 
                  style={styles.carouselImage}
                  resizeMode="cover"
                />
              </View>
            ))}

            {rooftop.images && rooftop.images.length > 0 ? (
              <Image 
                source={{ uri: rooftop.images[0] }} 
                style={styles.carouselImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.carouselImage}>
                <Text>No image available</Text>
              </View>
            )}
          </ScrollView>
        </View>

        <View style={styles.content}>
          <View style={styles.actionButtons}>
            <Button
              title={isBookmarked(rooftop?.id || '') ? "Remove from My Tops" : "Add to My Tops"}
              onPress={handleAddToMyTops}
              variant="secondary"
              loading={isBookmarkLoading}
              icon={<Ionicons name={isBookmarked(rooftop?.id || '') ? "heart" : "heart-outline"} size={20} color={colors.text.primary} />}
            />
            <Button
              title="Book Now"
              onPress={handleBook}
              variant="primary"
            />
          </View>

          <View style={styles.vibesContainer}>
            <Text style={styles.vibesTitle}>Vibes</Text>
            <View style={styles.vibes}>
              <Text style={styles.vibe}>public</Text>
              <Text style={styles.vibe}>private</Text>
              <Text style={styles.vibe}>relax</Text>
              <Text style={styles.vibe}>socialize</Text>
              <Text style={styles.vibe}>sunbathing</Text>
              <Text style={styles.vibe}>nature view</Text>
            </View>
          </View>

          <View style={styles.aboutContainer}>
            <Text style={styles.aboutTitle}>About</Text>
            <Text style={styles.aboutText}>{rooftop.description}</Text>
          </View>

          {/* <View style={styles.mapContainer}>
            <Text style={styles.mapTitle}>Map</Text>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: -22.951804,
                longitude: -43.210760,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
              }}
            >
              <Marker
                coordinate={{
                  latitude: -22.951804,
                  longitude: -43.210760
                }}
                title={rooftop.title}
                description={rooftop.city}
              />
            </MapView>
          </View> */}

          <View style={styles.viewOnContainer}>
            <Text style={styles.viewOnTitle}>View on</Text>
            <FlatList
              data={VIEW_ON_DATA}
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToInterval={Dimensions.get('window').width - (spacing.lg * 2)}
              renderItem={({ item }) => (
                <View style={styles.viewItem}>
                  <Image 
                    source={{ uri: rooftop.images[0] }} 
                    style={styles.imageView}
                    resizeMode="cover"
                  />
                  <Text style={styles.viewDescription}>{item.title}</Text>
                </View>
              )}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.viewOnList}
            />
          </View>

          <View style={styles.reviewsContainer}>
            <View style={styles.reviewsHeader}>
              <Text style={styles.reviewsTitle}>Reviews</Text>
              <View style={styles.ratingInfo}>
                <Text style={styles.averageRating}>{getAverageRating()}</Text>
                <View style={styles.starsContainer}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <MaterialIcons 
                      key={star} 
                      name="star" 
                      size={16} 
                      color={star <= getAverageRating() ? "#FFD700" : "#CCCCCC"} 
                      style={styles.star}
                    />
                  ))}
                </View>
                <Text style={styles.reviewCount}>({reviews.length} reviews)</Text>
              </View>
            </View>
            
            {isReviewsLoading ? (
              <ActivityIndicator size="small" color={colors.primary} style={styles.reviewsLoading} />
            ) : reviews.length > 0 ? (
              <View style={styles.reviews}>
                {reviews.map(review => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </View>
            ) : (
              <Text style={styles.noReviews}>No reviews yet. Be the first to review!</Text>
            )}
          </View>

          <View style={styles.nearbyContainer}>
            <Text style={styles.sectionTitle}>Grooftops Nearby</Text>
            <FlatList
              data={MOCK_ROOFTOPS}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <View style={styles.gridItem}>
                  <Image 
                    source={{ uri: rooftop.images[0] }}
                    style={styles.gridImage}
                    resizeMode="cover"
                  />
                  <View style={styles.locationTag}>
                    <MaterialIcons name="location-on" size={12} color="white" />
                    <Text style={styles.locationText}>{item.distance}</Text>
                  </View>
                  <Text style={styles.gridTitle}>{item.name}</Text>
                  <Text style={styles.gridSubtitle}>Location: {item.location}</Text>
                </View>
              )}
              keyExtractor={item => `nearby-${item.id}`}
              contentContainerStyle={styles.horizontalListContent}
            />
          </View>

          <View style={styles.suggestionsContainer}>
            <Text style={styles.sectionTitle}>Grooftops you might like</Text>
            <FlatList
              data={MOCK_ROOFTOPS}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <View style={styles.gridItem}>
                  <Image 
                    source={{ uri: rooftop.images[0] }}
                    style={styles.gridImage}
                    resizeMode="cover"
                  />
                  <View style={styles.favoriteButton}>
                    <Text style={styles.favoriteText}>
                      <Ionicons name="heart" size={10} color="yellow"/> soulmate
                    </Text>
                  </View>
                  <Text style={styles.gridTitle}>{item.name}</Text>
                  <Text style={styles.gridSubtitle}>Location: {item.location}</Text>
                </View>
              )}
              keyExtractor={item => `suggestion-${item.id}`}
              contentContainerStyle={styles.horizontalListContent}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
    paddingTop: spacing.md,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  error: {
    color: colors.error,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  rooftopBasicInfo: {
    paddingHorizontal: spacing.lg,
    flex: 1,
  },
  rooftopTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
  },
  rooftopCity: {
    fontSize: 12,
    color: colors.text.primary,
    marginTop: spacing.xs
  },
  rooftopRating: {
    fontSize: 12,
    marginVertical: spacing.md,
  },
  imageContainer: {
    height: 250,
    width: '100%',
  },
  carouselContent: {
    alignItems: 'center',
  },
  carouselSlide: {
    width: Dimensions.get('window').width,
    paddingHorizontal: spacing.lg,
  },
  carouselImage: {
    width: '100%',
    height: 250,
    borderRadius: 12,
  },
  pagination: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: spacing.md,
    alignSelf: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: 'white',
  },
  content: {
    padding: spacing.lg,
    backgroundColor: colors.background.primary,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.background.secondary,
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: 16,
    color: colors.text.primary,
    lineHeight: 24,
  },
  detail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  detailText: {
    fontSize: 16,
    color: colors.text.primary,
  },
  actions: {
    marginTop: spacing.sm,
    marginBottom: spacing.xxl,
  },
  spacing: {
    height: spacing.md,
  },
  contentScrollView: {
    backgroundColor: colors.background.primary,
  },


  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  vibesContainer: {
    marginTop: spacing.xl,
  },
  vibesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  vibes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  vibe: {
    fontSize: 12,
    color: colors.text.secondary,
    backgroundColor: 'white',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
    marginBottom: spacing.sm,
    marginRight: spacing.xs,
  },
  aboutContainer: {
    marginTop: spacing.xl,
  },
  aboutTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  aboutText: {
    fontSize: 16,
    color: colors.text.tertiary,
    lineHeight: 24,
  },
  mapContainer: {
    marginTop: spacing.xl,
  },
  mapTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  map: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  viewOnContainer: {
    marginTop: spacing.xxl,
  },
  viewOnTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  viewOnList: {
    paddingRight: spacing.lg,
  },
  viewItem: {
    width: (Dimensions.get('window').width - (spacing.lg * 4)) / 3,
    marginRight: spacing.md,
  },
  imageView: {
    width: '100%',
    height: 100,
    borderRadius: 12,
  },
  viewDescription: {
    fontSize: 12,
    color: colors.text.tertiary,
    marginTop: spacing.sm,
    textAlign: 'left',
  },
  reviewsContainer: {
    padding: spacing.lg,
    marginTop: spacing.md,
  },
  reviewsHeader: {
    marginBottom: spacing.md,
  },
  reviewsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  ratingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  averageRating: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginRight: spacing.sm,
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: spacing.sm,
  },
  star: {
    marginRight: 2,
  },
  reviewCount: {
    fontSize: 14,
    color: colors.text.tertiary,
  },
  reviews: {
    marginTop: spacing.md,
  },
  reviewsLoading: {
    marginTop: spacing.lg,
  },
  noReviews: {
    marginTop: spacing.lg,
    fontSize: 14,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
  nearbyContainer: {
    marginTop: spacing.xl,
  },
  suggestionsContainer: {
    marginTop: spacing.xxl,
    marginBottom: spacing.xxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  viewTabs: {
    flexDirection: 'row',
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    padding: 2,
  },
  activeTab: {
    fontSize: 12,
    color: colors.text.primary,
    backgroundColor: 'white',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 14,
  },
  inactiveTab: {
    fontSize: 12,
    color: colors.text.tertiary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  gridContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  gridItem: {
    width: (Dimensions.get('window').width - spacing.lg * 3) / 2,
    marginRight: spacing.md,
  },
  gridImage: {
    width: '100%',
    height: 150,
    borderRadius: 12,
  },
  locationTag: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  locationText: {
    color: 'white',
    fontSize: 10,
    marginLeft: 2
  },
  favoriteButton: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: '#FF00B8',
    borderRadius: 20,
    padding: spacing.xs,
  },
  favoriteText: {
    fontSize: 10,
    color: 'yellow',
  },
  gridTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.primary,
    marginTop: spacing.sm,
  },
  gridSubtitle: {
    fontSize: 12,
    color: colors.text.tertiary,
  },
  horizontalListContent: {
    paddingRight: spacing.lg,
    paddingTop: spacing.md,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  reviewButtonContainer: {
    marginBottom: spacing.md,
  },
  reviewNote: {
    fontSize: 12,
    color: colors.text.tertiary,
    marginTop: spacing.xs,
  },
});