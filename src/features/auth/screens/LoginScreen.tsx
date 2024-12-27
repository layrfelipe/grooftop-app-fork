import React, { useState } from 'react';
import { View, StyleSheet, Text, Image, ImageBackground, TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '../../../components/Input';
import { Button } from '../../../components/Button';
import { useAuthStore } from '../store/auth.store';
import { useGoogleAuth } from '../hooks/useGoogleAuth';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { Stack } from 'expo-router';

export const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  
  const router = useRouter();
  const { login, loginWithGoogle, isLoading, error } = useAuthStore();
  const { signIn } = useGoogleAuth();

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
    
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 8) newErrors.password = 'Password must be at least 8 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    
    try {
      await login(email, password);
      router.replace('/(app)/(tabs)');
    } catch (err) {
      // Error is handled by the store
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const idToken = await signIn();
      await loginWithGoogle(idToken);
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
                value={email}
                onChangeText={setEmail}
                placeholder="e-mail"
                keyboardType="email-address"
                error={errors.email}
              />

              <Input
                value={password}
                onChangeText={setPassword}
                placeholder="password"
                secureTextEntry
                error={errors.password}
              />

              <Button
                title="Login"
                onPress={handleLogin}
                loading={isLoading}
                variant="warn"
              />

              {/* <TouchableOpacity onPress={() => router.push('/forgot-password')}> */}
              <TouchableOpacity onPress={() => router.push('/init')}>
                <Text style={styles.forgotPassword}>
                  Forgot your password? <Text style={styles.clickHere}>Click here</Text>
                </Text>
              </TouchableOpacity>

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.dividerLine} />
              </View>

              <View style={styles.signupContainer}>
                <Text style={styles.signupText}>Don't have an account? </Text>
                <Button
                  title="Sign up now"
                  onPress={() => router.push('/register')}
                  variant="outline"
                />
              </View>
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
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    marginTop: spacing.lg,
    marginBottom: spacing.lg
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.text.dark,
  },
  dividerText: {
    color: colors.text.dark,
  },
  forgotPassword: {
    color: colors.text.primary,
    textAlign: 'center',
  },
  clickHere: {
    color: colors.text.inverse,
  },
  signupContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signupText: {
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  error: {
    color: colors.error,
    marginBottom: spacing.sm,
  },
}); 