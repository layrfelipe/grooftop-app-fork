import React from 'react';
import { Stack } from 'expo-router';
import { View } from 'react-native';
import { colors } from '../../../src/theme/colors';
import { Header } from '@/src/features/header/Header';

export default function AppLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.background.secondary }}>
      <Header onSearch={() => {}} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: colors.background.secondary
          }
        }}
      />
    </View>
  );
}
