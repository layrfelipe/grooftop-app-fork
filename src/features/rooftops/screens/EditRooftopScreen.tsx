import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Button } from '../../../components/Button';
import { Input } from '../../../components/Input';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { rooftopService } from '../services/rooftop.service';

export const EditRooftopScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [city, setCity] = useState('');
  const [pricePerHour, setPricePerHour] = useState('');

  useEffect(() => {
    // Load rooftop data
    const loadRooftop = async () => {
      try {
        const rooftop = await rooftopService.getRooftop(id);
        setTitle(rooftop.title);
        setDescription(rooftop.description);
        setCity(rooftop.city);
        setPricePerHour(rooftop.pricePerHour.toString());
      } catch (error) {
        console.error('Failed to load rooftop:', error);
      }
    };
    loadRooftop();
  }, [id]);

  const handleUpdate = async () => {
    try {
      await rooftopService.updateRooftop(id, {
        title,
        description,
        city,
        pricePerHour: Number(pricePerHour),
      });
      router.back();
    } catch (error) {
      console.error('Failed to update rooftop:', error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background.primary} />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Edit Rooftop</Text>
        </View>

        <ScrollView 
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Input
            label="Title"
            value={title}
            onChangeText={setTitle}
            placeholder="Enter rooftop title"
          />
          <Input
            label="Description"
            value={description}
            onChangeText={setDescription}
            placeholder="Enter rooftop description"
            multiline
            numberOfLines={4}
          />
          <Input
            label="City"
            value={city}
            onChangeText={setCity}
            placeholder="Enter city"
          />
          <Input
            label="Price per hour"
            value={pricePerHour}
            onChangeText={setPricePerHour}
            placeholder="Enter price per hour"
            keyboardType="numeric"
          />
          
          <View style={styles.actions}>
            <Button 
              title="Update Rooftop" 
              onPress={handleUpdate}
              disabled={!title || !description || !city || !pricePerHour}
            />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
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
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  actions: {
    marginTop: spacing.xl,
  },
}); 