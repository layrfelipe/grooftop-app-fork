import React from 'react';
import { View, StyleSheet, ImageBackground, Image } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../../../components/Button';
import { useAuthStore } from '../store/auth.store';
import { useGoogleAuth } from '../hooks/useGoogleAuth';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';

export const InitScreen = () => {
  
  const router = useRouter();
  const { loginWithGoogle, isLoading } = useAuthStore();
  const { signIn } = useGoogleAuth();
  // const { loginWithFacebook } = useFacebookAuth();

  const handleGoogleLogin = async () => {
    try {
      const idToken = await signIn();
      await loginWithGoogle(idToken);
      router.replace('/(app)/(tabs)');
    } catch (err) {
      // Error is handled by the store
    }
  };

  // const handleFacebookLogin = async () => {
  //   try {
  //     // await loginWithFacebook();
  //     router.replace('/(app)/(tabs)');
  //   } catch (err) {
  //     // Error is handled by the store
  //   }
  // };

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

              <View style={styles.actions}>

                {/* <Button
                  title="Start with Facebook"
                  onPress={handleFacebookLogin}
                  variant="facebook"
                  loading={isLoading}
                  icon={<Ionicons name="logo-facebook" size={20} color={colors.facebook.text} />}
                /> */}
                
                <Button
                  title="Start with Google"
                  onPress={handleGoogleLogin}
                  variant="google"
                  loading={isLoading}
                  icon={<Ionicons name="logo-google" size={20} color={colors.google.text} />}
                />

                <View style={styles.buttonsWrapper}>
                  <Button
                    title="Login"
                    onPress={() => router.push('/login')}
                    variant="warn"
                  />

                  <Button
                    title="Sign up"
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
    backgroundColor: colors.overlay.default,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 250,
    height: 100,
    alignSelf: 'center',
    marginBottom: spacing.xxxl,
  },
  actions: {
    marginTop: spacing.xxl,
  },
  buttonsWrapper: {
    flexDirection: 'row',
    marginTop: spacing.lg,
    gap: spacing.lg,
    justifyContent: 'center',
  }
}); 