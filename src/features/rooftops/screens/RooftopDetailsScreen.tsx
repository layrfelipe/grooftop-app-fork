import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Button } from '../../../components/Button';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { rooftopService } from '../services/rooftop.service';
import { Rooftop } from '../types/rooftop.types';

const { width } = Dimensions.get('window');

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
    router.push(`/(app)/rooftop/${id}/review`);
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
    <ScrollView style={styles.container} bounces={false}>
      <ScrollView 
        horizontal 
        pagingEnabled 
        showsHorizontalScrollIndicator={false}
        style={styles.imageContainer}
      >
        {rooftop.images.map((image, index) => (
          <Image 
            key={index}
            source={{ uri: image }} 
            style={styles.image}
            resizeMode="cover"
          />
        ))}
      </ScrollView>

      <View style={styles.content}>
        <Text style={styles.title}>{rooftop.title}</Text>
        <Text style={styles.city}>{rooftop.city}</Text>

        <View style={styles.detailsContainer}>
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
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
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
  imageContainer: {
    height: 300,
    backgroundColor: colors.background.primary,
  },
  image: {
    width,
    height: 300,
  },
  content: {
    padding: spacing.lg,
    backgroundColor: colors.background.primary,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  city: {
    fontSize: 16,
    color: colors.text.primary,
    marginBottom: spacing.md,
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
    marginTop: spacing.lg,
  },
  spacing: {
    height: spacing.md,
  },
}); 