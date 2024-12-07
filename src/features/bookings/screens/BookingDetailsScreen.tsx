import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Button } from '../../../components/Button';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';

export const BookingDetailsScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const handleCancel = () => {
    // TODO: Implement booking cancellation
    router.back();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Booking Details</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.placeholder}>Booking ID: {id}</Text>
        <Text style={styles.placeholder}>Details coming soon...</Text>

        <View style={styles.actions}>
          <Button 
            title="Cancel Booking" 
            onPress={handleCancel}
          />
          <View style={styles.spacing} />
          <Button 
            title="Back" 
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