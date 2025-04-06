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
import DateAvailabilityDialog from '../components/DateAvailabilityDialog';

const VIEW_ON_DATA = [
  { id: '1', title: 'Lorem Ipsum' },
  { id: '2', title: 'Dolor sit' },
  { id: '3', title: 'Amet conqueous' },
  { id: '4', title: 'Vivamus Magna' },
  { id: '5', title: 'Sed Consequat' },
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
  const [nearbyRooftops, setNearbyRooftops] = useState<any>([]);
  const [recommendedRooftops, setRecommendedRooftops] = useState<any>([]);
  const [isNearbyLoading, setIsNearbyLoading] = useState(false);
  const [isDateDialogVisible, setIsDateDialogVisible] = useState(false);

  useEffect(() => {
    loadRooftop();
    fetchBookmarks();
    if (id) {
      fetchRooftopReviews(id);
    }
    loadNearbyAndRecommended();

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

  const loadNearbyAndRecommended = async () => {
    try {
      setIsNearbyLoading(true);
      
      // Fetch nearby rooftops using default coordinates
      const nearbyData = await rooftopService.getNearbyRooftops();
      setNearbyRooftops(nearbyData);

      // Fetch recommended rooftops if user is logged in
      if (user) {
        const recommendedData = await rooftopService.getRecommendedRooftops();
        setRecommendedRooftops(recommendedData);
      }
    } catch (error) {
      console.error('Error loading nearby/recommended rooftops:', error);
    } finally {
      setIsNearbyLoading(false);
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
    setIsDateDialogVisible(true);
  };

  const handleCloseDialog = () => {
    setIsDateDialogVisible(false);
  };

  const handleDialogNext = () => {
    handleCloseDialog();
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

        <View style={styles.rooftopImageContainer}>
          <Image 
            source={{ uri: rooftop.images[0] }} 
            style={styles.rooftopImage}
            resizeMode="cover"
          />
        </View>

        <View style={styles.content}>
          <View style={styles.actionButtons}>
            <Button
              title={isBookmarked(rooftop?.id || '') ? "Remove from My Favs" : "Add to My Favs"}
              onPress={handleAddToMyTops}
              variant="outlineColored"
              loading={isBookmarkLoading}
              size="small"
              icon={<Ionicons name={isBookmarked(rooftop?.id || '') ? "heart" : "heart-outline"} size={20} color={colors.primary} />}
            />
          </View>

          <View style={styles.rooftopMainInfoContainer}>
            <Text style={styles.rooftopTitle}>{rooftop.title}</Text>
            <Text style={styles.rooftopLocationDescription}>Rooftop privativo localizado em ...</Text>
            <Text style={styles.rooftopSecondaryInfo}>120 guests | Pool | Jacuzzi</Text>
          </View>

          <View style={styles.rooftopOwnerInfoContainer}>
            <View style={styles.rooftopOwnerImageContainer}>
              <Image 
                source={{ 
                  uri: 'https://i.pravatar.cc/145'
                }} 
                style={styles.rooftopOwnerImage} 
              />
            </View>
            <View style={styles.rooftopOwnerTextContainer}>
              <Text style={styles.rooftopOwnerName}>Host: João da Silva</Text>
              <Text style={styles.rooftopOwnerDescription}>1 year hosting</Text>
            </View>
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

          <View style={styles.facilitiesContainer}>
            <Text style={styles.facilitiesTitle}>Facilities</Text>
            <View style={styles.facilities}>
              <Text style={styles.facility}>pet friendly</Text>
              <Text style={styles.facility}>child friendly</Text>
              <Text style={styles.facility}>swimming pool</Text>
              <Text style={styles.facility}>sanitary</Text>
              <Text style={styles.facility}>seating</Text>
              <Text style={styles.facility}>BYOB</Text>
              <Text style={styles.facility}>BYOM</Text>
              <Text style={styles.facility}>parking</Text>
              <Text style={styles.facility}>bike friendly</Text>
              <Text style={styles.facility}>pwd friendly</Text>
              <Text style={styles.facility}>elevator</Text>
            </View>
          </View>

          <View style={styles.rulesContainer}>
            <View style={styles.rulesHeader}>
              <MaterialIcons name="warning" size={24} color={colors.primary} />
              <Text style={styles.rulesTitle}>Rules</Text>
            </View>
            <View style={styles.rules}>
              <Text style={styles.rule}>No outside alcohol</Text>
              <Text style={styles.rule}>Live events allowed</Text>
              <Text style={styles.rule}>No smoking indoors</Text>
            </View>
          </View>

          <View style={styles.viewOfContainer}>
            <Text style={styles.viewOfTitle}>View of</Text>
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
              contentContainerStyle={styles.viewOfList}
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
            {isNearbyLoading ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <FlatList
                data={nearbyRooftops}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }: any) => (
                  <Pressable 
                    style={styles.gridItem}
                    onPress={() => router.push(`/rooftop/${item.id}`)}
                  >
                    <Image 
                      source={{ uri: item.images[0] }}
                      style={styles.gridImage}
                      resizeMode="cover"
                    />
                    <View style={styles.locationTag}>
                      <MaterialIcons name="location-on" size={12} color="white" />
                      <Text style={styles.locationText}>{item.distance || '< 5km'}km</Text>
                    </View>
                    <Text style={styles.gridTitle}>{item.title}</Text>
                    <Text style={styles.gridSubtitle}>{item.city}</Text>
                  </Pressable>
                )}
                keyExtractor={item => `nearby-${item.id}`}
                contentContainerStyle={styles.horizontalListContent}
              />
            )}
          </View>

          <View style={styles.suggestionsContainer}>
            <Text style={styles.sectionTitle}>Grooftops you might like</Text>
            {user ? (
              <FlatList
                data={recommendedRooftops}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }: any) => (
                  <Pressable 
                    style={styles.gridItem}
                    onPress={() => router.push(`/rooftop/${item.id}`)}
                  >
                    <Image 
                      source={{ uri: item.images[0] }}
                      style={styles.gridImage}
                      resizeMode="cover"
                    />
                    <View style={styles.favoriteButton}>
                      <Text style={styles.favoriteText}>
                        <Ionicons name="heart" size={10} color="yellow"/> soulmate
                      </Text>
                    </View>
                    <Text style={styles.gridTitle}>{item.title}</Text>
                    <Text style={styles.gridSubtitle}>{item.city}</Text>
                  </Pressable>
                )}
                keyExtractor={item => `suggestion-${item.id}`}
                contentContainerStyle={styles.horizontalListContent}
              />
            ) : (
              <Text style={styles.error}>Please log in to see recommended rooftops</Text>
            )}
          </View>
        </View>
      </ScrollView>

      <View style={styles.callToActionRowContainer}>
        <View style={styles.bookingConditions}>
          <Text style={styles.conditionsText}>R$10.000,00</Text>
          <Text style={styles.conditionsText}>até 12 horas de evento</Text>
        </View>

        <View style={styles.bookingButton}>
          <Button
            title="Check availability"
            onPress={handleBook}
            variant="cta"
            size="small"
          />
        </View>
      </View>

      <DateAvailabilityDialog 
        visible={isDateDialogVisible}
        onClose={handleCloseDialog}
        onNext={handleDialogNext}
        rooftop={{
          title: rooftop?.title || '',
          host: rooftop?.owner?.name || '',
          price: rooftop?.pricePerHour ? rooftop.pricePerHour * 12 : 12500, // 12 hours default duration
          image: rooftop?.images?.[0],
          rating: getAverageRating()
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
    width: '100%',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: colors.error,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  contentScrollView: {
    backgroundColor: colors.background.primary,
  },
  content: {
    padding: spacing.lg,
    backgroundColor: colors.background.primary,
  },
  rooftopImageContainer: {
    width: '100%',
    height: 250
  },
  rooftopImage: {
    width: '100%',
    height: '100%'
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  rooftopMainInfoContainer: {},
  rooftopTitle: {
    fontSize: 20,
    color: colors.primary,
    fontWeight: 'bold',
  },
  rooftopLocationDescription: {
    fontSize: 14,
    color: colors.text.primary,
    marginTop: spacing.xs,
    fontWeight: 'bold',
  },
  rooftopSecondaryInfo: {
    fontSize: 13,
    color: colors.text.tertiary,
    marginTop: spacing.sm,
  },
  rooftopOwnerInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.text.dark,
    paddingVertical: spacing.sm,
    marginTop: spacing.lg
  },
  rooftopOwnerImageContainer: {
    marginRight: spacing.md,
  },
  rooftopOwnerImage: {
    width: 48,
    height: 48,
    borderRadius: 24
  },
  rooftopOwnerTextContainer: {
    flex: 1,
  },
  rooftopOwnerName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  rooftopOwnerDescription: {
    fontSize: 12,
    color: colors.text.primary
  },
  vibesContainer: {
    marginTop: spacing.lg
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
  facilitiesContainer: {
    marginTop: spacing.xl
  },
  facilitiesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  facilities: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  facility: {
    fontSize: 12,
    color: colors.text.secondary,
    backgroundColor: 'white',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
    marginBottom: spacing.sm,
    marginRight: spacing.xs,
  },
  rulesContainer: {
    marginTop: spacing.xl
  },
  rulesHeader: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  rulesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginLeft: spacing.sm,
  },
  rules: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  rule: {
    fontSize: 12,
    color: colors.text.primary,
    backgroundColor: 'transparent',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 6,
    marginBottom: spacing.sm,
    marginRight: spacing.xs,
    borderWidth: 1,
    borderColor: colors.text.primary,
  },
  viewOfContainer: {
    marginTop: spacing.xl,
  },
  viewOfTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  viewOfList: {
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
    marginTop: spacing.xl,
  },
  reviewsHeader: {
    marginBottom: spacing.sm,
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
    marginTop: spacing.sm,
  },
  reviewsLoading: {
    marginTop: spacing.sm,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.sm,
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
  callToActionRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.tertiary,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  bookingConditions: {
    flex: 1,
  },
  conditionsText: {
    fontSize: 14,
    color: colors.text.primary,
  },
  bookingButton: {
    flex: 1,
  },
});