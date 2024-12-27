import React, { useState } from 'react';
import { View, StyleSheet, Text, Image, ImageBackground, TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useRouter } from 'expo-router';
import { Input } from '../../../components/Input';
import { Button } from '../../../components/Button';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { Stack } from 'expo-router';

export const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{ email?: string; }>({});
  
  const router = useRouter();

  const validate = () => {
    const newErrors: { email?: string; } = {};
    
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRecoverPassword = async () => {
    if (!validate()) return;
    
    try {
        alert('Recovering password...');
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

            <View style={styles.formContainer}>
              <Input
                value={email}
                onChangeText={setEmail}
                placeholder="e-mail"
                keyboardType="email-address"
                error={errors.email}
              />

              <Button
                title="Recover password"
                onPress={handleRecoverPassword}
                variant="warn"
              />
            </View>

            <Button
              title="Back to login"
              onPress={() => router.push('/login')}
              variant="outline"
            />
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
    marginBottom: spacing.lg,
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
  }
});