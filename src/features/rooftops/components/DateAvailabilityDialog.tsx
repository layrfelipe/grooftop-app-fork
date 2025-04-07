  import React, { useState, useEffect } from 'react';
  import { View, Text, StyleSheet, Modal, Pressable, Image } from 'react-native';
  import { Ionicons } from '@expo/vector-icons';
  import { Calendar } from 'react-native-calendars';
  import { Button } from '../../../components/Button';
  import { colors } from '../../../theme/colors';
  import { spacing } from '../../../theme/spacing';
  import { Input } from '../../../components/Input';
  import { Picker } from '@react-native-picker/picker';
  import { api } from '@/src/services/api';

  interface BookingTime {
    startTime: string;
    endTime: string;
  }

  interface BookingData {
    rooftopId: string;
    date: string;
    startTime: string;
    endTime: string;
  }

  interface PaymentData {
    cardNumber: string;
    cardName: string;
    cardValidity: string;
    cardCVV: string;
  }

  interface DateAvailabilityDialogProps {
    visible: boolean;
    onClose: () => void;
    onNext: () => void;
    rooftop?: {
      id: string;
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
    const [bookingData, setBookingData] = useState<BookingData>({
      rooftopId: rooftop?.id || '',
      date: '',
      startTime: '08:00',
      endTime: '14:00',
    });
    const [paymentData, setPaymentData] = useState<PaymentData>({
      cardNumber: '',
      cardName: '',
      cardValidity: '',
      cardCVV: '',
    });

    const timeOptions = Array.from({ length: 24 }, (_, i) => {
      const hour = i.toString().padStart(2, '0');
      return {
        label: `${hour}:00 ${parseInt(hour) < 12 ? 'AM' : 'PM'}`,
        value: `${hour}:00`
      };
    });

    const handleDateSelect = (date: any) => {
      setSelectedDate(date.dateString);
      setBookingData(prev => ({
        ...prev,
        date: date.dateString
      }));
      // In a real app, you would check availability here
      setIsAvailable(true);
    };

    const handleStartTimeChange = (time: string) => {
      setBookingData(prev => {
        // If start time is after end time, adjust end time
        const startHour = parseInt(time.split(':')[0]);
        const endHour = parseInt(prev.endTime.split(':')[0]);
        
        return {
          ...prev,
          startTime: time,
          endTime: startHour >= endHour ? `${(startHour + 1).toString().padStart(2, '0')}:00` : prev.endTime
        };
      });
    };

    const handleEndTimeChange = (time: string) => {
      setBookingData(prev => {
        // If end time is before start time, adjust start time
        const startHour = parseInt(prev.startTime.split(':')[0]);
        const endHour = parseInt(time.split(':')[0]);
        
        return {
          ...prev,
          startTime: endHour <= startHour ? `${(endHour - 1).toString().padStart(2, '0')}:00` : prev.startTime,
          endTime: time
        };
      });
    };

    const handleNext = async () => {
      switch (currentStep) {
        case 'date':
          setCurrentStep('details');
          break;
        case 'details':
          setCurrentStep('payment');
          break;
        case 'payment':
          const startDateTime = new Date(`${bookingData.date}T${bookingData.startTime}`).toISOString();
          const endDateTime = new Date(`${bookingData.date}T${bookingData.endTime}`).toISOString();

          try {
            await api.post('/bookings', {
              rooftopId: bookingData.rooftopId,
              startTime: startDateTime,
              endTime: endDateTime,
            });
            setCurrentStep('confirmation');
          } catch (error) {
            console.error('Error creating booking:', error);
          }
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
            <Ionicons name="arrow-back" size={30} color={colors.text.primary} />
          </Pressable>
          <View style={styles.headerTextContainer}>
            <Text style={styles.modalTitle}>Select date and time</Text>
            <Text style={styles.modalSubtitle}>Events allowed from 8 AM to 2 PM</Text>
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
            theme={calendarTheme}
            minDate={new Date().toISOString().split('T')[0]}
          />
        </View>

        {selectedDate && (
          <View style={styles.timeSelectionContainer}>
            <View style={styles.timePickerWrapper}>
              <Text style={styles.timeLabel}>Start Time</Text>
              <View style={styles.timePicker}>
                <Picker
                  selectedValue={bookingData.startTime}
                  onValueChange={handleStartTimeChange}
                  style={styles.picker}
                >
                  {timeOptions.map((time) => (
                    <Picker.Item 
                      key={`start-${time.value}`} 
                      label={time.label} 
                      value={time.value} 
                    />
                  ))}
                </Picker>
              </View>
            </View>

            <View style={styles.timePickerWrapper}>
              <Text style={styles.timeLabel}>End Time</Text>
              <View style={styles.timePicker}>
                <Picker
                  selectedValue={bookingData.endTime}
                  onValueChange={handleEndTimeChange}
                  style={styles.picker}
                >
                  {timeOptions.map((time) => (
                    <Picker.Item 
                      key={`end-${time.value}`} 
                      label={time.label} 
                      value={time.value} 
                    />
                  ))}
                </Picker>
              </View>
            </View>
          </View>
        )}

        {selectedDate && isAvailable && (
            <Button
              title="Yay! Your date is available!"
              onPress={handleNext}
              variant="secondaryOutline"
            />
        )}
      </>
    );

    const renderReservationDetails = () => (
      <View style={styles.detailsContainer}>
        <View style={styles.header}>
          <Pressable onPress={() => setCurrentStep('date')} style={styles.backButton}>
            <Ionicons name="arrow-back" size={30} color={colors.text.primary} />
          </Pressable>
          <Text style={styles.dialogTitle}>Review your reservation details</Text>
        </View>

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
            <Text style={styles.detailTextSecondary}>Time: {bookingData.startTime} - {bookingData.endTime}</Text>
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
        <View style={styles.header}>
          <Pressable onPress={() => setCurrentStep('details')} style={styles.backButton}>
            <Ionicons name="arrow-back" size={30} color={colors.text.primary} />
          </Pressable>
          <Text style={styles.dialogTitle}>Fill in your credit card details</Text>
        </View>

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
            variant="primary"
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
                  variant="primary"
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
                  variant="primary"
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
                  variant="primary"
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

    useEffect(() => {
      if (rooftop?.id) {
        setBookingData(prev => ({
          ...prev,
          rooftopId: rooftop.id
        }));
      }
    }, [rooftop?.id]);

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
      alignItems: 'flex-start',
      marginBottom: spacing.xl,
    },
    backButton: {
      marginRight: spacing.sm,
    },
    headerTextContainer: {
      marginLeft: spacing.sm,
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
      backgroundColor: colors.tertiary,
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
    timeSelectionContainer: {
      marginTop: spacing.lg,
      marginBottom: spacing.lg,
    },
    timePickerWrapper: {
      marginBottom: spacing.md,
    },
    timeLabel: {
      fontSize: 14,
      color: colors.text.primary,
      marginBottom: spacing.xs,
      fontWeight: '500',
    },
    timePicker: {
      backgroundColor: colors.background.secondary,
      borderRadius: 8,
      overflow: 'hidden',
    },
    picker: {
      height: 50,
      color: colors.text.primary,
    },
  });

  const calendarTheme = {
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
  };

  export default DateAvailabilityDialog; 