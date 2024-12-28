import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '../../../components/Button';
import { Input } from '../../../components/Input';
import { useAuthStore } from '../../auth/store/auth.store';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';

export const EditProfileScreen = () => {
  const router = useRouter();
  const { user, updateProfile } = useAuthStore();
  const [name, setName] = useState(user?.name || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [errors, setErrors] = useState<{ name?: string; avatarUrl?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: { name?: string; avatarUrl?: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (avatarUrl.trim()) {
      try {
        new URL(avatarUrl);
      } catch {
        newErrors.avatarUrl = 'Please enter a valid URL';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      await updateProfile({ 
        name, 
        ...(avatarUrl.trim() ? { avatarUrl } : {})
      });
      router.back();
    } catch (error) {
      if (error instanceof Error) {
        // Try to parse the error message from the API
        try {
          const apiError = JSON.parse(error.message);
          if (apiError.message?.includes('avatarUrl')) {
            setErrors(prev => ({ ...prev, avatarUrl: 'Please enter a valid URL' }));
          }
        } catch {
          setErrors(prev => ({ 
            ...prev, 
            avatarUrl: 'Failed to update profile. Please try again.' 
          }));
        }
      }
      console.error('Failed to update profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.inputContainer}>
          <Input
            label="Name"
            value={name}
          onChangeText={(text) => {
            setName(text);
            setErrors(prev => ({ ...prev, name: undefined }));
          }}
          placeholder="Enter your name"
            autoCapitalize="words"
            error={errors.name}
          />
        </View>

        <View style={styles.inputContainer}>
          <Input
            label="Avatar URL (optional)"
            value={avatarUrl}
          onChangeText={(text) => {
            setAvatarUrl(text);
            setErrors(prev => ({ ...prev, avatarUrl: undefined }));
          }}
          placeholder="Enter avatar URL"
            keyboardType="url"
            error={errors.avatarUrl}
          />
        </View>

        <View style={styles.actions}>
          <Button 
            title="Save changes" 
            onPress={handleSave}
            loading={isLoading}
          />
          <View style={styles.spacing} />
          <Button 
            title="Cancel" 
            onPress={() => router.back()}
            variant="secondary"
            disabled={isLoading}
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
    borderBottomWidth: 1
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  content: {
    padding: spacing.lg,
  },
  inputContainer: {
    marginBottom: spacing.sm,
  },
  actions: {
    marginTop: spacing.md,
  },
  spacing: {
    height: spacing.md,
  },
}); 