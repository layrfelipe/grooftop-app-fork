import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';
import { Button } from '../../../components/Button';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { Input } from '../../../components/Input';

interface DateAvailabilityDialogProps {
  visible: boolean;
  onClose: () => void;
  onNext: () => void;
  rooftop?: {
    title: string;
    host: string;
    price: number;
    image?: string;
    rating?: number;
    capacity?: number;
  };
}

type Step = 'date' | 'details' | 'payment' | 'confirmation';

const DateAvailabilityDialog: React.FC<DateAvailabilityDialogProps> = ({
  visible,
  onClose,
  onNext,
  rooftop
}) => {
  const [currentStep, setCurrentStep] = useState<Step>('date');
  const [selectedDate, setSelectedDate] = useState('');
  const [isAvailable, setIsAvailable] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardValidity, setCardValidity] = useState('');
  const [cardCVV, setCardCVV] = useState('');

  const handleDateSelect = (date: any) => {
    setSelectedDate(date.dateString);
    // In a real app, you would check availability here
    setIsAvailable(true);
  };

  const handleNext = () => {
    switch (currentStep) {
      case 'date':
        setCurrentStep('details');
        break;
      case 'details':
        setCurrentStep('payment');
        break;
      case 'payment':
        setCurrentStep('confirmation');
        break;
      case 'confirmation':
        setCurrentStep('date');
        onNext();
        break;
    }
  };

  const getFormattedDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    });
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 'date':
        return 'Select a date';
      case 'details':
        return 'Review your reservation details';
      case 'payment':
        return 'Payment details';
      case 'confirmation':
        return 'Confirmation';
      default:
        return '';
    }
  };

  const getButtonTitle = (step: Step) => {
    switch (step) {
      case 'date':
        return 'Next';
      case 'details':
        return 'Proceed to payment';
      case 'payment':
        return 'Complete transaction';
      case 'confirmation':
        return 'Track your reservation';
      default:
        return 'Next';
    }
  };

  const renderDateSelection = () => (
    <>
      <View style={styles.header}>
        <Pressable onPress={onClose} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </Pressable>
        <View style={styles.headerTextContainer}>
          <Text style={styles.modalTitle}>Select a date</Text>
          <Text style={styles.modalSubtitle}>Events allowed from 8 AM to 2 AM</Text>
        </View>
      </View>

      <View style={styles.calendarContainer}>
        <Calendar
          onDayPress={handleDateSelect}
          markedDates={{
            [selectedDate]: {
              selected: true,
              selectedColor: colors.primary,
            }
          }}
          theme={{
            backgroundColor: 'transparent',
            calendarBackground: 'transparent',
            textSectionTitleColor: colors.text.primary,
            selectedDayBackgroundColor: colors.primary,
            selectedDayTextColor: colors.text.secondary,
            todayTextColor: colors.primary,
            dayTextColor: colors.text.primary,
            textDisabledColor: colors.text.dark,
            dotColor: colors.primary,
            monthTextColor: colors.text.primary,
            textMonthFontWeight: 'bold',
            arrowColor: colors.primary,
          }}
          minDate={new Date().toISOString().split('T')[0]}
        />
      </View>

      {selectedDate && isAvailable && (
        <View style={styles.availabilityContainer}>
          <Text style={styles.availabilityText}>Yay! Your date is available!</Text>
        </View>
      )}
    </>
  );

  const renderReservationDetails = () => (
    <View style={styles.detailsContainer}>
      <Text style={styles.dialogTitle}>Review your reservation details</Text>

      <View style={styles.rooftopCardDetailsWrapper}>
        <View style={styles.rooftopInfoRow}>
          <Image 
            source={{ uri: rooftop?.image }} 
            style={styles.rooftopImage}
          />
          <View style={styles.rooftopInfo}>
            <Text style={styles.detailText}>{rooftop?.title}</Text>
            <Text style={styles.detailTextSecondary}>Host: {rooftop?.host}</Text>
            <Text style={styles.detailTextSecondary}>
              <Ionicons name="star" size={14} color="#FFD700" />&nbsp;{rooftop?.rating?.toFixed(1)}
            </Text>
          </View>
        </View>

        <View style={styles.detailsRow}>
          <Text style={styles.detailText}>Reservation details</Text>
          <Text style={styles.detailTextSecondary}>Date: {getFormattedDate(selectedDate)}</Text>
          <Text style={styles.detailTextSecondary}>Guests: {rooftop?.capacity || 30}</Text>
        </View>

        <View style={styles.detailsRow}>
          <Text style={styles.detailText}>Total amount</Text>
          <Text style={styles.detailTextSecondary}>
            R$ {(rooftop?.price || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </Text>
        </View>

        <View style={styles.detailsRow}>
          <Text style={styles.detailText}>Free cancelation</Text>
          <Text style={styles.detailTextSecondary}>
            If you cancel up to 2 days in advance, you'll receive a full refund.
          </Text>
        </View>
      </View>
    </View>
  );

  const renderPayment = () => (
    <View style={styles.detailsContainer}>
      <Text style={styles.dialogTitle}>Fill in your credit card details</Text>

      <View style={styles.cardPreviewWrapper}>
        <View style={styles.cardPreview}>
          <View style={styles.cardChip} />
          <Text style={styles.cardNumber}>
            {cardNumber || '•••• •••• •••• ••••'}
          </Text>
          <View style={styles.cardBottomRow}>
            <View>
              <Text style={styles.cardLabel}>CARD HOLDER</Text>
              <Text style={styles.cardText}>
                {cardName || 'YOUR NAME'}
              </Text>
            </View>
            <View>
              <Text style={styles.cardLabel}>EXPIRES</Text>
              <Text style={styles.cardText}>
                {cardValidity || 'MM/YY'}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.paymentForm}>
        <Input
          label="Card number"
          value={cardNumber}
          onChangeText={handleCardNumberChange}
          placeholder="1234 5678 9012 3456"
          keyboardType="numeric"
        />
        <Input
          label="Cardholder name"
          value={cardName}
          onChangeText={setCardName}
          placeholder="Name as shown on card"
          autoCapitalize="characters"
        />
        <View style={styles.rowInputs}>
          <View style={styles.halfInput}>
            <Input
              label="Valid thru"
              value={cardValidity}
              onChangeText={handleValidityChange}
              placeholder="MM/YY"
              keyboardType="numeric"
            />
          </View>
          <View style={styles.halfInput}>
            <Input
              label="CVV"
              value={cardCVV}
              onChangeText={handleCVVChange}
              placeholder="123"
              keyboardType="numeric"
              secureTextEntry
            />
          </View>
        </View>
      </View>
    </View>
  );

  const renderConfirmation = () => (
    <View style={styles.confirmationContainer}>
      <View style={styles.confirmationContent}>
        <Text style={styles.confirmationMessage}>
          Your reservation request has been successfully submitted. You will be notified once it is approved.
        </Text>

        <Button
          title={getButtonTitle('confirmation')}
          onPress={handleNext}
          variant="cta"
        />
      </View>
    </View>
  );

  const renderContent = () => {
    switch (currentStep) {
      case 'date':
        return (
          <>
            {renderDateSelection()}
            <View style={styles.buttonContainer}>
              <Button
                title={getButtonTitle('date')}
                onPress={handleNext}
                variant="cta"
                disabled={!selectedDate || !isAvailable}
              />
            </View>
          </>
        );
      case 'details':
        return (
          <>
            {renderReservationDetails()}
            <View style={styles.buttonContainer}>
              <Button
                title={getButtonTitle('details')}
                onPress={handleNext}
                variant="cta"
              />
            </View>
          </>
        );
      case 'payment':
        return (
          <>
            {renderPayment()}
            <View style={styles.buttonContainer}>
              <Button
                title={getButtonTitle('payment')}
                onPress={handleNext}
                variant="cta"
              />
            </View>
          </>
        );
      case 'confirmation':
        return renderConfirmation();
    }
  };

  // Format card number with spaces
  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\s/g, '');
    const chunks = cleaned.match(/.{1,4}/g) || [];
    return chunks.join(' ');
  };

  // Format validity date
  const formatValidity = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  const handleCardNumberChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '').slice(0, 16);
    setCardNumber(formatCardNumber(cleaned));
  };

  const handleValidityChange = (text: string) => {
    const formatted = formatValidity(text.replace(/\D/g, '').slice(0, 4));
    setCardValidity(formatted);
  };

  const handleCVVChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '').slice(0, 3);
    setCardCVV(cleaned);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {renderContent()}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalView: {
    backgroundColor: colors.background.primary,
    borderRadius: 20,
    padding: spacing.lg,
    width: '95%',
    height: '95%',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  backButton: {
    padding: spacing.sm,
    marginRight: spacing.sm,
  },
  headerTextContainer: {
    flex: 1,
    marginLeft: spacing.md,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  modalSubtitle: {
    fontSize: 14,
    color: colors.text.tertiary,
  },
  calendarContainer: {
    width: '100%',
    marginBottom: spacing.lg,
  },
  availabilityContainer: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 25,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    alignSelf: 'center',
  },
  availabilityText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  detailsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.md,
  },

  dialogTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
  },

  rooftopCardDetailsWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.md,
    backgroundColor: 'none',
    minHeight: 300,
    borderRadius: 12,
  },

  rooftopInfoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    backgroundColor: colors.background.secondary,
    padding: spacing.md,
    borderRadius: 12,
  },

  rooftopImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },

  rooftopInfo: {
    flex: 1,
    gap: spacing.xs,
  },

  detailsRow: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },

  detailText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
  },

  detailTextSecondary: {
    fontSize: 14,
    color: colors.text.tertiary,
  },

  buttonContainer: {
    marginTop: spacing.xl,
  },
  cardPreviewWrapper: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  cardPreview: {
    width: '100%',
    aspectRatio: 1.586,
    backgroundColor: colors.secondary,
    borderRadius: 16,
    padding: spacing.lg,
    justifyContent: 'space-between',
  },
  cardChip: {
    width: 45,
    height: 34,
    backgroundColor: '#FFD700',
    borderRadius: 6,
  },
  cardNumber: {
    fontSize: 22,
    color: 'white',
    letterSpacing: 2,
    textAlign: 'center',
    marginVertical: spacing.lg,
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardLabel: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: spacing.xs,
  },
  cardText: {
    fontSize: 16,
    color: 'white',
    textTransform: 'uppercase',
  },
  paymentForm: {
    gap: spacing.md,
  },
  rowInputs: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  halfInput: {
    flex: 1,
  },
  confirmationContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#00CBA9',
    minHeight: 300,
    borderRadius: 12,
  },
  confirmationContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  infinityIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  infinityIcon: {
    fontSize: 40,
    color: 'white',
    transform: [{ rotate: '90deg' }],
  },
  confirmationMessage: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: spacing.xl,
  },
  confirmationButtonContainer: {
    width: '100%',
    paddingHorizontal: spacing.md,
  },
  whiteButtonWrapper: {
    backgroundColor: 'white',
    borderRadius: 25,
    overflow: 'hidden',
  },
});

export default DateAvailabilityDialog; 