import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Button } from '../../../components/Button';
import { Input } from '../../../components/Input';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';

export const ReviewScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    // TODO: Implement review submission
    router.back();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Write Review</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.placeholder}>Rooftop ID: {id}</Text>

        <Input
          label="Rating (1-5)"
          value={rating}
          onChangeText={setRating}
          placeholder="Enter rating"
          keyboardType="numeric"
        />

        <Input
          label="Comment"
          value={comment}
          onChangeText={setComment}
          placeholder="Write your review"
          multiline
          numberOfLines={4}
        />

        <View style={styles.actions}>
          <Button 
            title="Submit Review" 
            onPress={handleSubmit}
          />
          <View style={styles.spacing} />
          <Button 
            title="Cancel" 
            onPress={() => router.back()}
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
  header: {
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  content: {
    padding: spacing.lg,
  },
  placeholder: {
    fontSize: 16,
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },
  actions: {
    marginTop: spacing.xl,
  },
  spacing: {
    height: spacing.md,
  },
}); 