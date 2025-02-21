import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { spacing } from '../../../theme/spacing';
import { colors } from '@/src/theme/colors';

export default function RooftopSuccessScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Your rooftop has been successfully registered.
      </Text>
      
      <Text style={styles.subtitle}>
        Now, just wait for the bookings
      </Text>

      <TouchableOpacity 
        style={styles.viewSpaceButton}
        onPress={() => {
          router.push('/spaces');
        }}
      >
        <Text style={styles.viewSpaceButtonText}>View your space</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#5EEBB4',
    paddingHorizontal: spacing.xl,
  },
  logoContainer: {
    marginBottom: spacing.xl * 2,
  },
  logo: {
    width: 80,
    height: 80,
  },
  title: {
    fontSize: 28,
    color: '#000',
    textAlign: 'center',
    marginBottom: spacing.lg,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 18,
    color: '#000',
    textAlign: 'center',
    marginBottom: spacing.xl * 2,
  },
  viewSpaceButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl * 2,
    borderRadius: spacing.sm,
    width: '100%',
    alignItems: 'center',
    backgroundColor: colors.text.primary,
  },
  viewSpaceButtonText: {
    color: colors.text.secondary,
    fontSize: 16,
    fontWeight: '500',
  },
}); 