import React from 'react';
import { Stack } from 'expo-router';
import { View } from 'react-native';
import { colors } from '../../../src/theme/colors';
import { Header } from '@/src/features/header/Header';

export default function HasHeaderLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.background.secondary }}>
      <Header onSearch={() => {}} />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'none',
          contentStyle: {
            backgroundColor: colors.background.secondary,
          }
        }}
      />
    </View>
  );
}
