import React from 'react';
import { StyleSheet, View, Image, Pressable, Text } from 'react-native';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { Rooftop } from '../types/rooftop.types';
import { MaterialIcons } from '@expo/vector-icons';

interface RooftopCardProps {
  rooftop: Rooftop;
  onPress: () => void;
}

export const RooftopCard = ({ rooftop, onPress }: RooftopCardProps) => {
  return (
    <Pressable style={styles.rooftopCardWrapper} onPress={onPress}>
      <View style={styles.rooftopCard}>
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: rooftop.images[0] }}
            style={styles.rooftopImage}
            resizeMode="cover"
          />
        </View>
        <View style={styles.rooftopContent}>
          <Text style={styles.rooftopTitle} numberOfLines={1}>{rooftop.title}</Text>
          <View style={styles.rooftopLocation}>
            <MaterialIcons name="location-on" size={12} color={colors.text.primary}/>
            <Text style={styles.rooftopLocationText}>{rooftop.city}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  rooftopCardWrapper: {
    width: '48%',
  },
  rooftopCard: {
    overflow: 'hidden',
  },
  imageContainer: {
    height: 140,
    width: '100%',
  },
  rooftopImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  rooftopContent: {
    padding: spacing.sm,
    paddingHorizontal: 0
  },
  rooftopTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  rooftopLocation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rooftopLocationText: {
    fontSize: 12,
    color: colors.text.primary,
    marginLeft: spacing.xs,
  }
}); 