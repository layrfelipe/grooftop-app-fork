import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { bookingService } from '../services/booking.service';
import { Booking } from '../types/booking.types';
import { Ionicons } from '@expo/vector-icons';

export const BookingsScreen = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await bookingService.getBookings();
      setBookings(data);
    } catch (err) {
      setError('Failed to load bookings');
      console.error('Error loading bookings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'CONFIRMED': return colors.secondary;
      case 'PENDING': return colors.primary;
      case 'CANCELLED': return colors.error;
      default: return colors.error;
    }
  };

  const renderBookingItem = (booking: Booking) => (
    <TouchableOpacity
      key={booking.id}
      style={styles.bookingCard}
      onPress={() => router.push(`/rooftop/${booking.rooftopId}`)}
    >
      <Image 
        source={{uri: booking.rooftop.images?.[0] || 'https://via.placeholder.com/80'}}
        style={styles.rooftopImage}
      />
      <View style={styles.bookingInfo}>
        <Text style={styles.rooftopTitle}>{booking.rooftop.title}</Text>
        <Text style={styles.bookingLocation}>
          <Ionicons name="location-outline" size={14} color={colors.text.tertiary} />
          {' '}{booking.rooftop.city}
        </Text>
        <Text style={styles.bookingDate}>
          <Ionicons name="calendar-outline" size={14} color={colors.text.tertiary} />
          {' '}{formatDateTime(booking.startTime)}
        </Text>
        <Text style={styles.bookingTime}>
          <Ionicons name="time-outline" size={14} color={colors.text.tertiary} />
          {' '}to {formatDateTime(booking.endTime)}
        </Text>
        <View style={styles.bookingFooter}>
          <Text style={[styles.status, { color: getStatusColor(booking.status) as string }]}>
            {booking.status}
          </Text>
          <Text style={styles.price}>
            R$ {booking.totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.error}>{error}</Text>
        <TouchableOpacity onPress={loadBookings} style={styles.retryButton}>
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Bookings</Text>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {bookings.length === 0 ? (
          <Text style={styles.placeholder}>No bookings yet</Text>
        ) : (
          bookings.map(renderBookingItem)
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  placeholder: {
    fontSize: 16,
    color: colors.text.primary,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
  bookingCard: {
    flexDirection: 'row',
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  rooftopImage: {
    width: 100,
    height: '100%',
  },
  bookingInfo: {
    flex: 1,
    padding: spacing.md,
  },
  rooftopTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  bookingLocation: {
    fontSize: 14,
    color: colors.text.tertiary,
    marginBottom: spacing.xs,
  },
  bookingDate: {
    fontSize: 14,
    color: colors.text.tertiary,
    marginBottom: spacing.xs,
  },
  bookingTime: {
    fontSize: 14,
    color: colors.text.tertiary,
    marginBottom: spacing.md,
  },
  bookingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  status: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  error: {
    color: colors.error,
    marginBottom: spacing.md,
  },
  retryButton: {
    padding: spacing.sm,
  },
  retryText: {
    color: colors.primary,
    fontWeight: '500',
  },
}); 