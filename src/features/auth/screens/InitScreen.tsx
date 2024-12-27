import React, { useState } from 'react';
import { View, StyleSheet, Text, ImageBackground, Image } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../../../components/Button';
import { useAuthStore } from '../store/auth.store';
import { useGoogleAuth } from '../hooks/useGoogleAuth';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';

export const InitScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  
  const router = useRouter();
  const { login, loginWithGoogle, isLoading, error } = useAuthStore();
  const { signIn } = useGoogleAuth();
  // const { loginWithFacebook } = useFacebookAuth();

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

  const handleFacebookLogin = async () => {
    try {
      // await loginWithFacebook();
      router.replace('/(app)/(tabs)');
    } catch (err) {
      // Error is handled by the store
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../../../assets/images/bg-login.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
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

              <View style={styles.actions}>

                <Button
                  title="Start with Facebook"
                  onPress={handleFacebookLogin}
                  variant="facebook"
                  loading={isLoading}
                  icon={<Ionicons name="logo-facebook" size={20} color={colors.text.primary} />}
                />
                
                <Button
                  title="Start with Google"
                  onPress={handleGoogleLogin}
                  variant="google"
                  loading={isLoading}
                  icon={<Ionicons name="logo-google" size={20} color={colors.text.primary} />}
                />

                <View style={styles.buttonsWrapper}>
                  <Button
                    title="Login"
                    onPress={() => router.push('/register')}
                    variant="warn"
                  />

                  <Button
                    title="Registrar"
                    onPress={() => router.push('/register')}
                    variant="outline"
                  /> 
                </View>
              </View>
            </View>
          </KeyboardAwareScrollView>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  content: {
    flex: 1,
    padding: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
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
    marginTop: spacing.xxxl,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.sm,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border.light,
  },
  dividerText: {
    color: colors.text.secondary,
    marginHorizontal: spacing.sm,
  },
  logo: {
    width: 200,
    height: 80,
    alignSelf: 'center',
    marginBottom: spacing.xl,
  },
  buttonsWrapper: {
    flexDirection: 'row',
    marginTop: spacing.xl,
    gap: spacing.lg,
    justifyContent: 'center',
  }
}); 