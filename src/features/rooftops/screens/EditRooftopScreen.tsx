import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Button } from '../../../components/Button';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';

export const EditRooftopScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const handleSave = () => {
    // TODO: Implement save functionality
    router.back();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Edit Rooftop</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.placeholder}>Edit form coming soon...</Text>
        <Text style={styles.placeholder}>Rooftop ID: {id}</Text>

        <View style={styles.actions}>
          <Button 
            title="Save Changes" 
            onPress={handleSave}
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