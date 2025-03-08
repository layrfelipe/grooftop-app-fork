import { colors } from '@/src/theme/colors';
import { spacing } from '@/src/theme/spacing';
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Review } from '../reviews/services/review.service';
import { formatDistanceToNow } from 'date-fns';

interface ReviewCardProps {
  review: Review;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  const { user, rating, comment, createdAt } = review;
  const formattedDate = formatDistanceToNow(new Date(createdAt), { addSuffix: true });
  
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.userInfo}>
          {user?.avatar ? (
            <Image 
              source={{ uri: user.avatar }}
              style={styles.avatar}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarInitial}>
                {user?.name ? user.name.charAt(0).toUpperCase() : '?'}
              </Text>
            </View>
          )}
          <View>
            <Text style={styles.userName}>{user?.name || 'Anonymous'}</Text>
            <Text style={styles.date}>{formattedDate}</Text>
          </View>
        </View>
        <View style={styles.ratingContainer}>
          {[...Array(5)].map((_, index) => (
            <Text key={index} style={[
              styles.star,
              { color: index < rating ? '#FFD700' : '#CCCCCC' }
            ]}>
              ★
            </Text>
          ))}
        </View>
      </View>
      <Text style={styles.reviewText}>{comment}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
    paddingBottom: spacing.xl,
    marginVertical: 8,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarInitial: {
    color: colors.text.secondary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  date: {
    fontSize: 12,
    color: colors.text.tertiary,
    marginTop: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
  },
  star: {
    fontSize: 18,
    marginLeft: 2,
  },
  reviewText: {
    fontSize: 14,
    color: colors.text.primary,
    lineHeight: 20,
  },
});

export default ReviewCard;