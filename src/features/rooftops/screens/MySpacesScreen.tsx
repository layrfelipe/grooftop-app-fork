import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Pressable,
  Image
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { useBookmarkStore } from '../store/bookmark.store';
import { Bookmark } from '../services/bookmark.service';
import { Rooftop } from '../types/rooftop.types';

const BookmarkCard = ({ bookmark, onPress }: { bookmark: Bookmark, onPress: () => void }) => {
  const rooftop = bookmark.rooftop;
  
  if (!rooftop) {
    return null;
  }
  
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Image 
        source={{ uri: rooftop.images[0] }} 
        style={styles.cardImage} 
        resizeMode="cover"
      />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{rooftop.title}</Text>
        <Text style={styles.cardLocation}>{rooftop.city}</Text>
        <View style={styles.cardDetails}>
          <View style={styles.cardDetail}>
            <Ionicons name="people-outline" size={16} color={colors.text.tertiary} />
            <Text style={styles.cardDetailText}>Up to {rooftop.capacity}</Text>
          </View>
          <View style={styles.cardDetail}>
            <Ionicons name="cash-outline" size={16} color={colors.text.tertiary} />
            <Text style={styles.cardDetailText}>${rooftop.pricePerHour}/hour</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export const MySpacesScreen = () => {
  const router = useRouter();
  const { bookmarks, fetchBookmarks, isLoading, error } = useBookmarkStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchBookmarks();
    setRefreshing(false);
  };

  const handleRooftopPress = (rooftopId: string) => {
    router.push({
      pathname: '/(app)/(hasHeader)/rooftop/[id]',
      params: { id: rooftopId }
    });
  };

  if (isLoading && !refreshing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Spaces</Text>
      
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      
      {bookmarks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-outline" size={64} color={colors.text.tertiary} />
          <Text style={styles.emptyText}>You haven't saved any spaces yet</Text>
          <Pressable 
            style={styles.exploreButton}
            onPress={() => router.push('/')}
          >
            <Text style={styles.exploreButtonText}>Explore Rooftops</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={bookmarks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <BookmarkCard 
              bookmark={item} 
              onPress={() => handleRooftopPress(item.rooftopId)}
            />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[colors.primary]}
            />
          }
        />
      )}
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
    marginBottom: spacing.lg
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    padding: spacing.md,
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    borderRadius: 8,
    marginBottom: spacing.lg,
  },
  errorText: {
    color: colors.error,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  emptyText: {
    fontSize: 16,
    color: colors.text.tertiary,
    marginTop: spacing.md,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  exploreButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: 8,
  },
  exploreButtonText: {
    color: colors.text.secondary,
    fontWeight: 'bold',
  },
  list: {
    paddingBottom: spacing.xl,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  cardImage: {
    width: '100%',
    height: 150,
  },
  cardContent: {
    padding: spacing.md,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 4,
  },
  cardLocation: {
    fontSize: 14,
    color: colors.text.tertiary,
    marginBottom: spacing.sm,
  },
  cardDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cardDetailText: {
    fontSize: 12,
    color: colors.text.tertiary,
  },
}); 