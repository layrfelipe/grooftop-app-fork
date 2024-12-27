import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Input } from '../../../components/Input';
import { Button } from '../../../components/Button';
import { useAuthStore } from '../store/auth.store';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';

export const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});
  
  const router = useRouter();
  const { register, isLoading, error } = useAuthStore();

  const validate = () => {
    const newErrors: { name?: string; email?: string; password?: string } = {};
    
    if (!name) newErrors.name = 'Name is required';
    
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
    
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 8) newErrors.password = 'Password must be at least 8 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    
    try {
      await register(email, name, password);
      router.replace('/(tabs)');
    } catch (err) {
      // Error is handled by the store
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={colors.background.gradient}
        style={styles.gradient}
      >
        <KeyboardAwareScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Sign up to get started</Text>

            {error && <Text style={styles.error}>{error}</Text>}

            <Input
              label="Name"
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              autoCapitalize="words"
              error={errors.name}
            />

            <Input
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              error={errors.email}
            />

            <Input
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Create a password"
              secureTextEntry
              error={errors.password}
            />

            <View style={styles.actions}>
              <Button
                title="Sign Up"
                onPress={handleRegister}
                loading={isLoading}
              />

              <Button
                title="Already have an account? Sign In"
                onPress={() => router.push('/init')}
                variant="secondary"
              />
            </View>
          </View>
        </KeyboardAwareScrollView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 18,
    color: colors.text.secondary,
    marginBottom: spacing.xl,
  },
  error: {
    color: colors.error,
    marginBottom: spacing.md,
  },
  actions: {
    gap: spacing.md,
    marginTop: spacing.lg,
  },
}); 