import React, { useState } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useRouter } from 'expo-router';
import { Input } from '../../../components/Input';
import { Button } from '../../../components/Button';
import { useAuthStore } from '../store/auth.store';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { Stack } from 'expo-router';

export const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    password?: string;
    passwordConfirmation?: string;
  }>({});
  
  const router = useRouter();
  const { register, isLoading, error } = useAuthStore();

  const validate = () => {
    const newErrors: typeof errors = {};
    
    if (!name) newErrors.name = 'Name is required';
    
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
    
    if (!phone) newErrors.phone = 'Phone is required';
    else if (!/^\+?[\d\s-]{8,}$/.test(phone)) newErrors.phone = 'Invalid phone number';

    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 8) newErrors.password = 'Password must be at least 8 characters';

    if (!passwordConfirmation) newErrors.passwordConfirmation = 'Password confirmation is required';
    else if (password !== passwordConfirmation) newErrors.passwordConfirmation = 'Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    
    try {
      await register(email, name, password);
      router.replace('/(app)/(tabs)');
    } catch (err) {
      // Error is handled by the store
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <KeyboardAwareScrollView 
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          scrollEnabled={false}
        >
          <View style={styles.content}>
            <Image 
              source={require('../../../../assets/images/logo-with-sub.png')}
              style={styles.logo}
              resizeMode="contain"
            />

            {error && <Text style={styles.error}>{error}</Text>}

            <View style={styles.formContainer}>
              <Input
                value={name}
                onChangeText={setName}
                placeholder="name"
                error={errors.name}
              />

              <Input
                value={email}
                onChangeText={setEmail}
                placeholder="e-mail"
                keyboardType="email-address"
                error={errors.email}
              />

              <Input
                value={phone}
                onChangeText={setPhone}
                placeholder="phone"
                keyboardType="phone-pad"
                error={errors.phone}
              />

              <Input
                value={password}
                onChangeText={setPassword}
                placeholder="password"
                secureTextEntry
                error={errors.password}
              />

              <Input
                value={passwordConfirmation}
                onChangeText={setPasswordConfirmation}
                placeholder="password confirmation"
                secureTextEntry
                error={errors.passwordConfirmation}
              />

              <Button
                title="Sign up"
                onPress={handleRegister}
                loading={isLoading}
                variant="warn"
              />

              <TouchableOpacity onPress={() => router.push('/init')}>
                <Text style={styles.hasAccount}>
                  Already have an account? <Text style={styles.clickHere}>Log in here.</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#222'
  },
  logo: {
    width: 250,
    height: 100,
    alignSelf: 'center',
    marginBottom: spacing.xxl,
  },
  formContainer: {
    width: '100%',
    gap: spacing.md,
  },
  hasAccount: {
    color: colors.text.primary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  clickHere: {
    color: colors.text.inverse,
  },
  error: {
    color: colors.error,
    marginBottom: spacing.sm,
  },
}); 