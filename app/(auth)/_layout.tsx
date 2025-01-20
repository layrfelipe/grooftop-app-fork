import { Stack } from 'expo-router';
import { View } from 'react-native';
import { colors } from '../../src/theme/colors';

export default function AuthLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.background.secondary }}>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.background.primary,
          },
          headerTintColor: colors.text.primary,
          contentStyle: {
            backgroundColor: colors.background.primary,
          },
          animation: 'fade',
          animationDuration: 200,
        }}>
        <Stack.Screen
          name="init"
          options={{
            title: 'Sign In',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="login"
          options={{
            title: 'Sign In',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="register"
          options={{
            title: 'Create Account',
            headerShown: false,
          }}
        />
      </Stack>
    </View>
  );
} 