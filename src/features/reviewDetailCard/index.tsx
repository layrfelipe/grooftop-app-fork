import { colors } from '@/src/theme/colors';
import { spacing } from '@/src/theme/spacing';
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const ReviewCard = () => {
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.userInfo}>
          <Image 
            source={require('../../../assets/images/react-logo.png')}
            style={styles.avatar}
            resizeMode="contain"
          />
          <Text style={styles.userName}>John Doe</Text>
        </View>
        <View style={styles.ratingContainer}>
          {[...Array(5)].map((_, index) => (
            <Text key={index} style={[
              styles.star,
              { color: index < 4 ? '#FFD700' : '#CCCCCC' }
            ]}>
              ★
            </Text>
          ))}
        </View>
      </View>
      <Text style={styles.reviewText}>This is a mocked review text. The product is amazing and I would definitely recommend it to others!</Text>
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
    borderBottomColor: colors.text.secondary,
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
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
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