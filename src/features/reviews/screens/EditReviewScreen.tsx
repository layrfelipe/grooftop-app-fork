import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
  Pressable,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { Button } from '../../../components/Button';
import { useReviewStore } from '../store/review.store';
import { reviewService } from '../services/review.service';

export const EditReviewScreen = () => {
  const { reviewId } = useLocalSearchParams<{ reviewId: string }>();
  const router = useRouter();
  const { updateReview, isLoading } = useReviewStore();
  
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoadingReview, setIsLoadingReview] = useState(true);

  useEffect(() => {
    const loadReview = async () => {
      try {
        setIsLoadingReview(true);
        const review = await reviewService.getReview(reviewId);
        setRating(review.rating);
        setComment(review.comment);
      } catch (err: any) {
        setError(err.message || 'Failed to load review');
      } finally {
        setIsLoadingReview(false);
      }
    };

    loadReview();
  }, [reviewId]);

  const handleSubmit = async () => {
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    if (!comment.trim()) {
      setError('Please enter a comment');
      return;
    }

    try {
      setError(null);
      await updateReview(reviewId, {
        rating,
        comment: comment.trim(),
      });
      
      Alert.alert('Success', 'Your review has been updated!');
      router.back();
    } catch (err: any) {
      setError(err.message || 'Failed to update review');
    }
  };

  if (isLoadingReview) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Edit Review</Text>
      
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      
      <View style={styles.ratingContainer}>
        <Text style={styles.label}>Rating</Text>
        <View style={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Pressable
              key={star}
              onPress={() => setRating(star)}
              style={styles.starButton}
            >
              <Ionicons 
                name={star <= rating ? "star" : "star-outline"} 
                size={32} 
                color={star <= rating ? "#FFD700" : colors.text.tertiary} 
              />
            </Pressable>
          ))}
        </View>
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Comment</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Share your experience..."
          placeholderTextColor={colors.text.tertiary}
          value={comment}
          onChangeText={setComment}
          multiline
          numberOfLines={5}
          textAlignVertical="top"
        />
      </View>
      
      <Button
        title="Update Review"
        onPress={handleSubmit}
        variant="primary"
        loading={isLoading}
        disabled={isLoading}
      />
      
      <View style={styles.cancelButtonContainer}>
        <Button
          title="Cancel"
          onPress={() => router.back()}
          variant="secondary"
          disabled={isLoading}
        />
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: spacing.xl,
  },
  errorContainer: {
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.lg,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
  },
  ratingContainer: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
  starButton: {
    padding: spacing.sm,
  },
  inputContainer: {
    marginBottom: spacing.xl,
  },
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: spacing.md,
    color: colors.text.primary,
    fontSize: 16,
    minHeight: 120,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  cancelButtonContainer: {
    marginTop: spacing.md,
  },
}); 