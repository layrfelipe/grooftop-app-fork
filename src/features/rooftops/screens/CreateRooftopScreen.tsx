import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '../../../components/Button';
import { Input } from '../../../components/Input';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { rooftopService } from '../services/rooftop.service';

export const CreateRooftopScreen = () => {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [city, setCity] = useState('');
  const [pricePerHour, setPricePerHour] = useState('');
  const [capacity, setCapacity] = useState('');
  const [images] = useState(['https://picsum.photos/800/600']);

  const handleCreate = async () => {
    try {
      await rooftopService.createRooftop({
        title,
        description,
        city,
        pricePerHour: Number(pricePerHour),
        capacity: Number(capacity),
        images
      });
      router.back();
    } catch (error) {
      console.error('Failed to create rooftop:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Add a rooftop</Text>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.inputContainer}>
          <Input
            label="Title"
            value={title}
            onChangeText={setTitle}
            placeholder="Enter rooftop title"
          />
        </View>
        <View style={styles.inputContainer}>
          <Input
            label="Description"
            value={description}
            onChangeText={setDescription}
            placeholder="Enter rooftop description"
            multiline
            numberOfLines={4}
          />
        </View>
        <View style={styles.inputContainer}>
          <Input
            label="City"
            value={city}
            onChangeText={setCity}
            placeholder="Enter city"
          />
        </View>
        <View style={styles.inputContainer}>
          <Input
            label="Price per hour"
            value={pricePerHour}
            onChangeText={setPricePerHour}
            placeholder="Enter price per hour"
            keyboardType="numeric"
          />
        </View>
        <View style={styles.inputContainer}>
          <Input
            label="Capacity"
            value={capacity}
            onChangeText={setCapacity}
            placeholder="Enter capacity"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.actions}>
          <Button 
            title="Add rooftop" 
            onPress={handleCreate}
            disabled={!title || !description || !city || !pricePerHour || !capacity}
            variant="warn"
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
    paddingTop: spacing.md
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
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
    padding: spacing.lg,
  },
  inputContainer: {
    marginBottom: spacing.md,
  },
  actions: {
    marginTop: spacing.sm,
  }
}); 