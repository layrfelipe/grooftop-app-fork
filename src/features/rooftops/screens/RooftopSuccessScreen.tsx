import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { spacing } from '../../../theme/spacing';

export default function RooftopSuccessScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logo}>∞</Text>
      </View>
      
      <Text style={styles.title}>
        Your rooftop has been successfully registered.
      </Text>
      
      <Text style={styles.subtitle}>
        Now, just wait for the bookings
      </Text>

      <TouchableOpacity 
        style={styles.viewSpaceButton}
        onPress={() => {
          // router.push('/');
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
    backgroundColor: '#5CFF9D',
  },
  logoContainer: {
    marginBottom: spacing.xl,
  },
  logo: {
    fontSize: 48,
    color: '#000',
  },
  title: {
    fontSize: 24,
    color: '#000',
    textAlign: 'center',
    marginBottom: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  subtitle: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  viewSpaceButton: {
    backgroundColor: '#fff',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
    borderRadius: 8,
  },
  viewSpaceButtonText: {
    color: '#000',
    fontSize: 16,
  },
}); 