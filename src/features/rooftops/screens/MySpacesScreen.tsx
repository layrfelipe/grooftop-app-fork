import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text
} from 'react-native';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';

export const MySpacesScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Spaces</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
    padding: spacing.lg
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
}); 