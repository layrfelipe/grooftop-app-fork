import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Pressable
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { useReviewStore } from '../store/review.store';
import ReviewCard from '../../reviewDetailCard';
import { Button } from '../../../components/Button';

export const ReviewScreen = () => {
  const router = useRouter();
  const { userReviews, fetchUserReviews, isLoading } = useReviewStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchUserReviews();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchUserReviews();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
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
        <View style={styles.header}>
          <Text style={styles.title}>My Reviews</Text>
        </View>

        {isLoading && !refreshing ? (
          <ActivityIndicator size="large" color={colors.primary} style={styles.loading} />
        ) : userReviews.length > 0 ? (
          <View style={styles.reviewsContainer}>
            {userReviews.map(review => (
              <View key={review.id} style={styles.reviewItem}>
                <ReviewCard review={review} />
                <View style={styles.reviewActions}>
                  <Pressable 
                    style={styles.actionButton}
                    onPress={() => router.push({
                      pathname: '/(app)/(hasHeader)/reviews/edit',
                      params: { reviewId: review.id }
                    })}
                  >
                    <Ionicons name="pencil" size={18} color={colors.text.tertiary} />
                    <Text style={styles.actionText}>Edit</Text>
                  </Pressable>
                  <Pressable 
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => {
                      // Implement delete confirmation
                      useReviewStore.getState().deleteReview(review.id);
                    }}
                  >
                    <Ionicons name="trash" size={18} color={colors.error} />
                    <Text style={[styles.actionText, styles.deleteText]}>Delete</Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="star-outline" size={64} color={colors.text.tertiary} />
            <Text style={styles.emptyText}>You haven't written any reviews yet</Text>
            <Button
              title="Explore Rooftops"
              onPress={() => router.push('/')}
              variant="secondary"
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
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
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  loading: {
    marginTop: spacing.xl,
  },
  reviewsContainer: {
    padding: spacing.lg,
  },
  reviewItem: {
    marginBottom: spacing.lg,
  },
  reviewActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: spacing.sm,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    marginLeft: spacing.md,
  },
  actionText: {
    fontSize: 14,
    color: colors.text.tertiary,
    marginLeft: spacing.xs,
  },
  deleteButton: {
    opacity: 0.8,
  },
  deleteText: {
    color: colors.error,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
    paddingHorizontal: spacing.lg,
  },
  emptyText: {
    fontSize: 16,
    color: colors.text.tertiary,
    textAlign: 'center',
    marginVertical: spacing.lg,
  },
  placeholder: {
    fontSize: 16,
    color: colors.text.primary,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
}); 