import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Button } from '../../../components/Button';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { rooftopService } from '../services/rooftop.service';
import { Rooftop } from '../types/rooftop.types';
import MapView, { Marker } from 'react-native-maps';
import ReviewCard from '../../reviewDetailCard';

export const RooftopDetailsScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [rooftop, setRooftop] = useState<Rooftop | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRooftop();
  }, [id]);

  const loadRooftop = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await rooftopService.getRooftop(id);
      setRooftop(data);
    } catch (err) {
      console.error('Failed to load rooftop:', err);
      setError('Failed to load rooftop details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBook = () => {
    // TODO: Implement booking flow
  };

  const handleReview = () => {
    router.push(`/(app)/(hasHeader)/rooftop/${id}/review`);
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
          onPress={() => router.back()}
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
          {/* {rooftop.images.map((image, index) => (
            <Image 
              key={index}
              source={{ uri: image }} 
              style={styles.image}
              resizeMode="cover"
            />
          ))} */}

          <Image 
            source={{ uri: rooftop.images[0] }} 
            style={styles.image}
            resizeMode="cover"
          />
        </View>

        <View style={styles.content}>
          {/* <View style={styles.detailsContainer}>
            <View style={styles.detail}>
              <MaterialIcons name="people" size={20} color={colors.text.primary} />
              <Text style={styles.detailText}>
                Up to {rooftop.capacity} people
              </Text>
            </View>
            
            <View style={styles.detail}>
              <MaterialIcons name="attach-money" size={20} color={colors.text.secondary} />
              <Text style={styles.detailText}>
                ${rooftop.pricePerHour}/hour
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{rooftop.description}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location</Text>
            <View style={styles.detail}>
              <MaterialIcons name="location-on" size={20} color={colors.text.primary} />
              <Text style={styles.detailText}>{rooftop.city}</Text>
            </View>
          </View>

          <View style={styles.actions}>
            <Button 
              title="Book now" 
              onPress={handleBook}
              variant="primary"
            />
            <View style={styles.spacing} />
            <Button 
              title="Write review" 
              onPress={handleReview}
              variant="secondary"
            />
          </View> */}

          <View style={styles.actionsContainer}>
            <Button 
              title="Add to My Tops" 
              onPress={handleBook}
              variant="primary"
              size='small'
              icon={<MaterialIcons name="favorite" size={16} color={colors.text.secondary} />}
            />

            <Button 
              title="Book" 
              onPress={handleReview}
              variant="secondary"
              size='small'
              icon={<MaterialIcons name="monetization-on" size={16} color={colors.text.secondary} />}
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

          <View style={styles.mapContainer}>
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
          </View>

          <View style={styles.viewOnContainer}>
            <Text style={styles.viewOnTitle}>View on</Text>
            <View style={styles.imagesViews}>
              <View style={styles.viewItem}>
                <Image 
                  source={{ uri: rooftop.images[0] }} 
                  style={styles.imageView}
                  resizeMode="cover"
                />
                <Text style={styles.viewDescription}>Lorem Ipsum</Text>
              </View>
              <View style={styles.viewItem}>
                <Image 
                  source={{ uri: rooftop.images[0] }} 
                  style={styles.imageView}
                  resizeMode="cover"
                />
                <Text style={styles.viewDescription}>Dolor sit</Text>
              </View>
              <View style={styles.viewItem}>
                <Image 
                  source={{ uri: rooftop.images[0] }} 
                  style={styles.imageView}
                  resizeMode="cover"
                />
                <Text style={styles.viewDescription}>Amet conqueous</Text>
              </View>
            </View>
          </View>

          <View style={styles.reviewsContainer}>
            <Text style={styles.reviewsTitle}>Reviews</Text>
            <View style={styles.reviews}>
              <ReviewCard />
              <ReviewCard />
              <ReviewCard />
            </View>
          </View>

          <View style={styles.nearbyContainer}>
            <Text style={styles.sectionTitle}>Grooftops Nearby</Text>
            <View style={styles.gridContainer}>
              {[1, 2].map((_, index) => (
                <View key={`nearby-${index}`} style={styles.gridItem}>
                  <Image 
                    source={{ uri: rooftop.images[0] }}
                    style={styles.gridImage}
                    resizeMode="cover"
                  />
                  <View style={styles.locationTag}>
                    <MaterialIcons name="location-on" size={12} color="white" />
                    <Text style={styles.locationText}>1.2km</Text>
                  </View>
                  <Text style={styles.gridTitle}>Name of Rooftop</Text>
                  <Text style={styles.gridSubtitle}>Location: Rio de Janeiro</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.suggestionsContainer}>
            <Text style={styles.sectionTitle}>Grooftops you might like</Text>
            <View style={styles.gridContainer}>
              {[1, 2].map((_, index) => (
                <View key={`suggestion-${index}`} style={styles.gridItem}>
                  <Image 
                    source={{ uri: rooftop.images[0] }}
                    style={styles.gridImage}
                    resizeMode="cover"
                  />
                  <View style={styles.favoriteButton}>
                    <Text style={styles.favoriteText}><Ionicons name="heart" size={10} color="yellow"/> soulmate</Text>
                  </View>
                  <Text style={styles.gridTitle}>Name of Rooftop</Text>
                  <Text style={styles.gridSubtitle}>Location: Rio de Janeiro</Text>
                </View>
              ))}
            </View>
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 12,
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
    marginBottom: spacing.md,
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
  imagesViews: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  viewItem: {
    flex: 1,
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
    marginTop: spacing.xxl,
  },
  reviewsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  reviews: {
    flexDirection: 'column',
  },
  review: {
    fontSize: 16,
    color: colors.text.primary,
  },
  nearbyContainer: {
    marginTop: spacing.xl,
  },
  suggestionsContainer: {
    marginTop: spacing.xxl,
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
    flex: 1,
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
});