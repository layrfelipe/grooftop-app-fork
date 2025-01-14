import React from 'react';
import { Stack } from 'expo-router';
import { Platform, StatusBar, SafeAreaView } from 'react-native';
import { colors } from '../../src/theme/colors';
import { spacing } from '@/src/theme/spacing';

export default function AppLayout() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.primary }}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background.primary} />
      
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.background.primary,
          },
          headerTintColor: colors.text.primary,
          headerTitleStyle: {
            color: colors.text.primary,
          },
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: colors.background.primary,
            paddingTop: spacing.sm,
          },
          ...Platform.select({
            android: {
              headerBackVisible: true,
              headerBackTitle: undefined,
            },
          }),
        }}
      >
        <Stack.Screen
          name="(hasHeader)"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="booking/[id]"
          options={{
            title: 'Booking details',
            headerBackTitle: Platform.OS === 'ios' ? 'Back' : undefined,
          }}
        />
        <Stack.Screen
          name="profile/edit"
          options={{
            title: 'Edit profile',
            headerBackTitle: Platform.OS === 'ios' ? 'Back' : undefined,
          }}
        />
      </Stack>
    </SafeAreaView>
  );
} 