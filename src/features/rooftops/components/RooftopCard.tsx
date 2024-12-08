import React from 'react';
import { StyleSheet, View, Image, Pressable, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useAnimatedStyle, 
  withSpring, 
  withTiming,
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { Rooftop } from '../types/rooftop.types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface RooftopCardProps {
  rooftop: Rooftop;
  onPress: () => void;
}

export const RooftopCard = ({ rooftop, onPress }: RooftopCardProps) => {
  const [pressed, setPressed] = React.useState(false);

  const animatedStyle = useAnimatedStyle(() => {
    const scale = withSpring(pressed ? 0.95 : 1, {
      damping: 15,
      stiffness: 150,
    });
    
    const shadowOpacity = withTiming(pressed ? 0.2 : 0.4);
    
    return {
      transform: [{ scale }],
      shadowOpacity,
    };
  });

  return (
    <AnimatedPressable
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      onPress={onPress}
      style={[styles.container, animatedStyle]}
    >
      <Image 
        source={{ uri: rooftop.images[0] }} 
        style={styles.image}
        resizeMode="cover"
      />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.gradient}
      >
        <BlurView intensity={20} tint="dark" style={styles.infoContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.title} numberOfLines={1}>{rooftop.title}</Text>
            <Text style={styles.location}>
              <MaterialIcons name="location-on" size={14} color={colors.text.secondary} />
              {' '}{rooftop.city}
            </Text>
          </View>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>${rooftop.pricePerHour}</Text>
            <Text style={styles.priceUnit}>/hour</Text>
          </View>
        </BlurView>
      </LinearGradient>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 220,
    borderRadius: 16,
    marginBottom: spacing.lg,
    backgroundColor: colors.background.card,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    elevation: 5,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '100%',
    justifyContent: 'flex-end',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    padding: spacing.lg,
    paddingBottom: spacing.xl,
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  textContainer: {
    flex: 1,
    marginRight: spacing.md,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  location: {
    fontSize: 14,
    color: colors.text.secondary,
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceContainer: {
    alignItems: 'flex-end',
    backgroundColor: colors.background.overlay,
    padding: spacing.xs,
    borderRadius: 8,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  priceUnit: {
    fontSize: 12,
    color: colors.text.secondary,
  },
}); 