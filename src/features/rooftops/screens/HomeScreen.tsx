import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Pressable,
  Image,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useRooftopStore } from '../store/rooftop.store';
import { RooftopCard } from '../components/RooftopCard';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { Header } from '../../header/Header';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Rooftop } from '../types/rooftop.types';

export const HomeScreen = () => {
  const router = useRouter();
  const { rooftops, fetchRooftops, setFilters } = useRooftopStore();

  useEffect(() => {
    fetchRooftops();
  }, [fetchRooftops]);

  const handleSearch = (text: string) => {
    setFilters({ city: text });
  };

  const handleRooftopPress = (id: string) => {
    router.push(`/rooftop/${id}`);
  };

  const renderStars = () => (
    <View style={styles.starsContainer}>
      {[1, 2, 3, 4, 5].map((star) => (
        <MaterialIcons 
          key={star} 
          name="star" 
          size={16} 
          color="#FFD700" 
          style={styles.star}
        />
      ))}
    </View>
  );

  const renderTopRooftop = ({ item }: { item: Rooftop }) => (
    <Pressable 
      style={styles.topRooftopCard}
      onPress={() => handleRooftopPress(item.id)}
    >
      <Image 
        source={{ uri: item.images[0] }}
        style={styles.topRooftopImage}
        resizeMode="cover"
      />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.topRooftopGradient}
      >
        <View style={styles.topRooftopContent}>
          <View>
            <Text style={styles.topRooftopTitle}>{item.title}</Text>
            <Text style={styles.topRooftopLocation}>
              <MaterialIcons name="location-on" size={12} color={colors.text.primary} />
              {item.city}
            </Text>
          </View>
          {renderStars()}
        </View>
      </LinearGradient>
    </Pressable>
  );

  const renderExperienceCard = ({ item }: { item: Rooftop }) => (
    <Pressable 
      style={styles.experienceCard}
      onPress={() => handleRooftopPress(item.id)}
    >
      <Image 
        source={{ uri: item.images[0] }}
        style={styles.experienceImage}
        resizeMode="cover"
      />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.7)']}
        style={styles.experienceGradient}
      >
        <View style={styles.experienceTitleContainer}>
          <Text style={styles.experienceTitle}>{item.title}</Text>
          <Text style={styles.experienceSubtitle}>{item.city}</Text>
        </View>
      </LinearGradient>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background.primary} />
      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>People's TOPs</Text>
          <FlatList
            horizontal
            data={rooftops.slice(0, 5)}
            renderItem={renderTopRooftop}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.topRooftopsContainer}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Choose your experience</Text>
          <FlatList
            horizontal
            data={rooftops.slice(0, 5)}
            renderItem={renderExperienceCard}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.experiencesContainer}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Other rooftops</Text>
          {rooftops.map((rooftop) => (
            <RooftopCard 
              key={rooftop.id} 
              rooftop={rooftop} 
              onPress={() => handleRooftopPress(rooftop.id)}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  section: {
    padding: spacing.lg,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  topRooftopsContainer: {
    paddingRight: spacing.lg,
  },
  topRooftopCard: {
    width: 280,
    height: 180,
    marginRight: spacing.md,
    borderRadius: 16,
    overflow: 'hidden',
  },
  topRooftopImage: {
    width: '100%',
    height: '100%',
  },
  topRooftopGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.md,
  },
  topRooftopContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  topRooftopTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  topRooftopLocation: {
    fontSize: 12,
    color: colors.text.primary,
    flexDirection: 'row',
    alignItems: 'center',
  },
  experiencesContainer: {
    paddingRight: spacing.lg,
  },
  experienceCard: {
    width: 150,
    height: 100,
    marginRight: spacing.md,
    borderRadius: 16,
    overflow: 'hidden',
  },
  experienceImage: {
    width: '100%',
    height: '100%',
  },
  experienceGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    justifyContent: 'flex-end',
    padding: spacing.md,
  },
  experienceTitleContainer: {
    alignItems: 'flex-start',
  },
  experienceTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 2,
  },
  experienceSubtitle: {
    fontSize: 12,
    color: colors.text.primary,
    opacity: 0.8,
  },
  starsContainer: {
    flexDirection: 'row',
    marginLeft: spacing.md,
  },
  star: {
    marginRight: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.5,
    shadowRadius: 1,
  },
}); 