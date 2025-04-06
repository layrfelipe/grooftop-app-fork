import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { router, useRouter } from 'expo-router';
import { Button } from '../../../components/Button';
import { Input } from '../../../components/Input';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { CheckBox } from '@rneui/base';
import { Picker } from '@react-native-picker/picker';
import { api } from '@/src/services/api';

export const CreateRooftopScreen = () => {
  const router = useRouter();

  // Metadata
  const [availablePrivacyOptionsMetadata, setAvailablePrivacyOptionsMetadata] = useState<any>([]);
  const [availableActivitiesMetadata, setAvailableActivitiesMetadata] = useState<any>([]);
  const [availableRentalTypesOptionsMetadata, setAvailableRentalTypesOptionsMetadata] = useState<any>([]);
  const [availableAccessibilityOptionsMetadata, setAvailableAccessibilityOptionsMetadata] = useState<any>([]);
  const [availableRooftopFeaturesOptionsMetadata, setAvailableRooftopFeaturesOptionsMetadata] = useState<any>([]);
  const [availableRooftopViewTypesMetadata, setAvailableRooftopViewTypesMetadata] = useState<any>([]);
  const [availableGuidelinesOptionsMetadata, setAvailableGuidelinesOptionsMetadata] = useState<any>([]);
  const [availableCancellationPoliciesOptionsMetadata, setAvailableCancellationPoliciesOptionsMetadata] = useState<any>([]);


  // Basic Info - Stage 1
  const [address, setAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');

  // Activities - Stage 2
  const [selectedPrivacyAndAccessOption, setSelectedPrivacyAndAccessOption] = useState<string>('');
  const [selectedRooftopActivities, setSelectedRooftopActivities] = useState<string[]>([]);

  // Rental Type - Stage 3
  const [rentalType, setRentalType] = useState(''); // free, hourly, byPeriod
  const [timeRange, setTimeRange] = useState('');
  const [price, setPrice] = useState('');

  // Guest Flow & Access - Stage 4
  const [maxGuests, setMaxGuests] = useState('');
  const [parkingSpots, setParkingSpots] = useState('');
  const [amenities, setAmenities] = useState<string[]>([]);

  // Photos & Final Details - Stage 5
  const [images, setImages] = useState(['https://picsum.photos/800/600']);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Guidelines - Stage 6
  const [cancellationPolicy, setCancellationPolicy] = useState('');

  const [currentStage, setCurrentStage] = useState(1);


  useEffect(() => {
    api.getPrivacyOptionsAndAvailableActivitiesMetaDataFromBackend().then((data: any) => {
      setAvailablePrivacyOptionsMetadata(data.privacyOptions.data);
      setAvailableActivitiesMetadata(data.availableActivities.data);
    });

    api.getRentalTypesOptionsMetaDataFromBackend().then((res: any) => {
      setAvailableRentalTypesOptionsMetadata(res.data);
    });

    // api.getAccessibilityOptionsMetaDataFromBackend().then((res: any) => {
    //   console.log("accessibility options metadata")
    //   console.log(res.data)
    //   console.log()
    //   setAvailableAccessibilityOptionsMetadata(res.data);
    // });

    // api.getRooftopFeaturesOptionsMetaDataFromBackend().then((res: any) => {
    //   console.log("rooftop features options metadata")
    //   console.log(res.data)
    //   console.log()
    //   setAvailableRooftopFeaturesOptionsMetadata(res.data);
    // });

    // api.getRooftopViewTypesMetaDataFromBackend().then((res: any) => {
    //   console.log("rooftop view types metadata")
    //   console.log(res.data)
    //   console.log()
    //   setAvailableRooftopViewTypesMetadata(res.data);
    // });

    // api.getGuidelinesOptionsFromBackend().then((res: any) => {
    //   console.log("guidelines options metadata")
    //   console.log(res.data)
    //   console.log()
    //   setAvailableGuidelinesOptionsMetadata(res.data);
    // });

    // api.getCancellationPoliciesOptionsFromBackend().then((res: any) => {
    //   console.log("cancellation policies options metadata")
    //   console.log(res.data)
    //   console.log()
    //   setAvailableCancellationPoliciesOptionsMetadata(res.data);
    // });
  }, [])


  const handleNext = () => {
    if (currentStage < 7) {
      setCurrentStage(currentStage + 1);
    } else {
      handleCreate();
    }
  };

  const handleBack = () => {
    if (currentStage > 1) {
      setCurrentStage(currentStage - 1);
    } else {
      router.back();
    }
  };

  const renderStageContent = () => {
    switch (currentStage) {
      case 1:
        return (
          <>
            <Text style={styles.addressSectionTitle}>Address</Text>
            <View style={styles.inputWrapper}>
              <View style={styles.inputContainer}>
                <Input
                  label="Postal Code"
                  value={postalCode}
                  onChangeText={setPostalCode}
                  placeholder="Enter your ZIP code"
                />
              </View>

              <View style={styles.inputContainer}>
                <Input
                  label="State"
                  value={state}
                onChangeText={setState}
                  placeholder="Select your state"
                />
              </View>

              <View style={styles.inputContainer}>
                <Input
                  label="City"
                  value={city}
                  onChangeText={setCity}
                  placeholder="Enter your city"
                />
              </View>

              <View style={styles.inputContainer}>
                <Input
                  label="Address"
                  value={address}
                  onChangeText={setAddress}
                  placeholder="Enter your street address"
                />
              </View>

              <View style={styles.inputContainer}>
                <Input
                  label="Additional Info"
                  value={additionalInfo}
                  onChangeText={setAdditionalInfo}
                  placeholder="Apartment, suite, or additional details (optional)"
                />
              </View>
            </View>
          </>
        );
      
        case 2:
          return (
            <>
              <Text style={styles.sectionTitle}>Privacy & Access</Text>
              <View>
                {availablePrivacyOptionsMetadata.map((option: any) => (
                  <CheckBox
                    key={option.id}
                    title={option.name}
                    checked={selectedPrivacyAndAccessOption === option.id}
                    onPress={() => setSelectedPrivacyAndAccessOption(option.id)}
                    checkedIcon="dot-circle-o"
                    uncheckedIcon="circle-o"
                    checkedColor={colors.primary}
                    containerStyle={styles.radioContainer}
                    textStyle={[styles.radioLabel, { color: colors.text.primary }]}
                  />
                ))}
              </View>

              <Text style={styles.sectionTitle}>Available Activities</Text>
              <View>
                {availableActivitiesMetadata.map((activity: any) => (
                  <CheckBox
                    key={activity.id}
                    title={activity.name}
                    checked={selectedRooftopActivities.includes(activity.id)}
                    onPress={() => {
                      if (selectedRooftopActivities.includes(activity.id)) {
                        setSelectedRooftopActivities(selectedRooftopActivities.filter(a => a !== activity.id));
                      } else {
                        setSelectedRooftopActivities([...selectedRooftopActivities, activity.id]);
                      }
                    }}
                    checkedColor={colors.primary}
                    containerStyle={styles.checkboxContainer}
                    textStyle={[styles.checkboxLabel, { color: colors.text.primary }]}
                  />
                ))}
              </View>
            </>
          );

      case 3:
        return (
          <>
            <Text style={styles.sectionTitle}>Type of Rental</Text>

            <View>
              {availableRentalTypesOptionsMetadata.map((option: any) => (
                <View>
                  <CheckBox
                    key={option.id}
                    title={option.name}
                    checked={rentalType === option.name}
                    onPress={() => setRentalType(option.name)}
                    checkedIcon="dot-circle-o"
                    uncheckedIcon="circle-o"
                    checkedColor={colors.primary}
                    containerStyle={styles.radioContainer}
                    textStyle={[styles.radioLabel, { color: '#fff' }]}
                  />
              

                  {/* <View>
                    {rentalType === 'Free' && (
                      <View style={styles.timeRangeContainer}>
                        <Text style={styles.timeRangeLabel}>time range</Text>
                        <Input
                          value={timeRange}
                          onChangeText={setTimeRange}
                          placeholder="Select the time range (vamos colocar aqui de 0+4hs"
                        />
                      </View>
                    )}

                    <CheckBox
                      title="Hourly"
                      checked={rentalType === 'hourly'}
                      onPress={() => setRentalType('hourly')}
                      checkedIcon="dot-circle-o"
                      uncheckedIcon="circle-o"
                      checkedColor={colors.primary}
                      containerStyle={styles.radioContainer}
                      textStyle={[styles.radioLabel, { color: '#fff' }]}
                    />

                    {rentalType === 'hourly' && (
                      <>
                        <View style={styles.timeRangeContainer}>
                          <Text style={styles.timeRangeLabel}>time range</Text>
                          <Input
                            value={timeRange}
                            onChangeText={setTimeRange}
                            placeholder="Select the time range (vamos colocar aqui de 0+4hs"
                          />
                        </View>
                        <View style={styles.timeRangeContainer}>
                          <Text style={styles.timeRangeLabel}>value</Text>
                          <Input
                            value={price}
                            onChangeText={setPrice}
                            placeholder="Enter the hourly rate"
                            keyboardType="numeric"
                          />
                        </View>
                      </>
                    )}

                    <CheckBox
                      title="By Period"
                      checked={rentalType === 'byPeriod'}
                      onPress={() => setRentalType('byPeriod')}
                      checkedIcon="dot-circle-o"
                      uncheckedIcon="circle-o"
                      checkedColor={colors.primary}
                      containerStyle={styles.radioContainer}
                      textStyle={[styles.radioLabel, { color: '#fff' }]}
                    />

                    {rentalType === 'byPeriod' && (
                      <>
                        <View style={styles.timeRangeContainer}>
                          <Text style={styles.timeRangeLabel}>time range</Text>
                          <Input
                            value={timeRange}
                            onChangeText={setTimeRange}
                            placeholder="Select the time range (vamos colocar aqui de 0+4hs"
                          />
                        </View>
                        <View style={styles.timeRangeContainer}>
                          <Text style={styles.timeRangeLabel}>value</Text>
                          <Input
                            value={price}
                            onChangeText={setPrice}
                            placeholder="Enter the price for the 4-hour package"
                            keyboardType="numeric"
                          />
                        </View>
                      </>
                    )}
                  </View> */}
                </View>
              ))}
            </View>
          </>
        );

      case 4:
        return (
          <>
            <Text style={styles.sectionTitle}>Guest Flow & Access</Text>
            
            <Text style={styles.fieldLabel}>Maximum number of guests</Text>
            <Input
              value={maxGuests}
              onChangeText={setMaxGuests}
              placeholder="Enter the maximum capacity"
              keyboardType="numeric"
            />

            <Text style={[styles.fieldLabel, styles.spacingTop]}>Parking</Text>
            <CheckBox
              title="Parking for vehicles"
              checked={amenities.includes('parking')}
              onPress={() => {
                if (amenities.includes('parking')) {
                  setAmenities(amenities.filter(a => a !== 'parking'));
                } else {
                  setAmenities([...amenities, 'parking']);
                }
              }}
              checkedColor={colors.primary}
              containerStyle={styles.checkboxContainer}
              textStyle={[styles.checkboxLabel, { color: '#fff' }]}
            />

            {amenities.includes('parking') && (
              <>
                <Text style={styles.fieldLabel}>Maximum number of spots</Text>
                <Input
                  value={parkingSpots}
                  onChangeText={setParkingSpots}
                  placeholder="Enter the maximum capacity"
                  keyboardType="numeric"
                />
              </>
            )}

            <CheckBox
              title="Nearby parking"
              checked={amenities.includes('nearbyParking')}
              onPress={() => {
                if (amenities.includes('nearbyParking')) {
                  setAmenities(amenities.filter(a => a !== 'nearbyParking'));
                } else {
                  setAmenities([...amenities, 'nearbyParking']);
                }
              }}
              checkedColor={colors.primary}
              containerStyle={styles.checkboxContainer}
              textStyle={[styles.checkboxLabel, { color: '#fff' }]}
            />

            <Text style={[styles.fieldLabel, styles.spacingTop]}>Accessibility</Text>
            {[
              { id: 'wheelchairAccess', label: 'Wheelchair access' },
              { id: 'accessibleRestroom', label: 'Accessible restroom' },
              { id: 'wideAisles', label: 'Wide aisles for easy movement' },
              { id: 'brailleSigns', label: 'Braille signs' },
              { id: 'visualSoundIndicators', label: 'Visual/sound indicators' },
              { id: 'reservedSeating', label: 'Reserved seating' }
            ].map((item) => (
              <CheckBox
                key={item.id}
                title={item.label}
                checked={amenities.includes(item.id)}
                onPress={() => {
                  if (amenities.includes(item.id)) {
                    setAmenities(amenities.filter(a => a !== item.id));
                  } else {
                    setAmenities([...amenities, item.id]);
                  }
                }}
                checkedColor={colors.primary}
                containerStyle={styles.checkboxContainer}
                textStyle={[styles.checkboxLabel, { color: '#fff' }]}
              />
            ))}
          </>
        );

      case 5:
        return (
          <>
            <Text style={styles.sectionTitle}>Features & Views</Text>
            
            <Text style={styles.categoryTitle}>Service</Text>
            {[
              'Bar',
              'Restaurant',
              'Coffee shop',
              'Food help',
              'Catering service',
              'BBQ area',
              'Cocktail service',
              'Free wi-fi',
              'Live music',
              'DJ available'
            ].map((service) => (
              <CheckBox
                key={service}
                title={service}
                checked={amenities.includes(service)}
                onPress={() => {
                  if (amenities.includes(service)) {
                    setAmenities(amenities.filter(a => a !== service));
                  } else {
                    setAmenities([...amenities, service]);
                  }
                }}
                checkedColor={colors.primary}
                containerStyle={styles.checkboxContainer}
                textStyle={[styles.checkboxLabel, { color: '#fff' }]}
              />
            ))}

            <Text style={[styles.categoryTitle, styles.spacingTop]}>Facilities</Text>
            {[
              'Pool',
              'Shower',
              'Jacuzzi',
              'Air conditioning',
              'Chairs',
              'Benches',
              'Covered Area',
              'Bathroom'
            ].map((facility) => (
              <CheckBox
                key={facility}
                title={facility}
                checked={amenities.includes(facility)}
                onPress={() => {
                  if (amenities.includes(facility)) {
                    setAmenities(amenities.filter(a => a !== facility));
                  } else {
                    setAmenities([...amenities, facility]);
                  }
                }}
                checkedColor={colors.primary}
                containerStyle={styles.checkboxContainer}
                textStyle={[styles.checkboxLabel, { color: '#fff' }]}
              />
            ))}

            <Text style={[styles.categoryTitle, styles.spacingTop]}>View Types</Text>
            {[
              'Skyline',
              'Lake',
              'River',
              'Beach',
              'Forest',
              'Urban view',
              'Panoramic view',
              'City lights at night'
            ].map((view) => (
              <CheckBox
                key={view}
                title={view}
                checked={amenities.includes(view)}
                onPress={() => {
                  if (amenities.includes(view)) {
                    setAmenities(amenities.filter(a => a !== view));
                  } else {
                    setAmenities([...amenities, view]);
                  }
                }}
                checkedColor={colors.primary}
                containerStyle={styles.checkboxContainer}
                textStyle={[styles.checkboxLabel, { color: '#fff' }]}
              />
            ))}
          </>
        );

      case 6:
        return (
          <>
            <Text style={styles.sectionTitle}>Guidelines</Text>
            
            <Text style={styles.categoryTitle}>Rules</Text>
            {[
              'Alcohol allowed',
              'No outside alcohol',
              'No smoking indoors',
              'Live events allowed',
              'No loud noise',
              'Age restrictions',
              'Mandatory closing time',
              'Pet Friendly',
              'No fireworks',
              'ID required for entry'
            ].map((rule) => (
              <CheckBox
                key={rule}
                title={rule}
                checked={amenities.includes(rule)}
                onPress={() => {
                  if (amenities.includes(rule)) {
                    setAmenities(amenities.filter(a => a !== rule));
                  } else {
                    setAmenities([...amenities, rule]);
                  }
                }}
                checkedColor={colors.primary}
                containerStyle={styles.checkboxContainer}
                textStyle={[styles.checkboxLabel, { color: colors.text.primary }]}
              />
            ))}

            <Text 
              style={styles.addRuleText}
              onPress={() => {/* Add custom rule logic */}}
            >
              + Add your rule here
            </Text>

            <Text style={[styles.categoryTitle, styles.spacingTop]}>Cancellation policy</Text>
            
            <View style={styles.selectContainer}>
              <Picker
                selectedValue={cancellationPolicy}
                onValueChange={(itemValue) => setCancellationPolicy(itemValue)}
                style={styles.picker}
                dropdownIconColor={colors.text.primary}
                mode="dropdown"
              >
                <Picker.Item 
                  label="Select a option" 
                  value="" 
                  style={[styles.pickerItem, { color: '#666' }]} 
                  color="#666"
                />
                {[
                  'Free cancellation up to 7 days before the event',
                  'Partial refund before cancellation',
                  'No cancellation allowed',
                  'Cancellation fee of 5%',
                  'Rescheduling allowed with advance notice',
                  'Cancellation available only in case of emergency',
                  'No refund after 2 days before the event',
                  'Full refund if canceled within 24 hours'
                ].map((policy) => (
                  <Picker.Item 
                    key={policy}
                    label={policy} 
                    value={policy}
                    style={styles.pickerItem}
                    color={colors.text.primary}
                  />
                ))}
              </Picker>
            </View>
          </>
        );

      case 7:
        return (
          <>
            <Text style={styles.sectionTitle}>Pictures & Videos</Text>
            <Text style={styles.subtitle}>Select videos or photos</Text>
            
            <TouchableOpacity 
              style={styles.uploadButton}
            >
              <Text style={styles.uploadButtonText}>Add photos or videos</Text>
            </TouchableOpacity>
          </>
        );
    }
  };

  const handleCreate = async () => {
    try {
      router.push('/(app)/success/success');
      } catch (error) {
      console.error('Failed to create rooftop:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Register your rooftop</Text>
        <View style={styles.progressIndicator}>
          {[1, 2, 3, 4, 5, 6, 7].map((stage) => (
            <View
              key={stage}
              style={[
                styles.progressDot,
                currentStage === stage && styles.progressDotActive,
              ]}
            />
          ))}
        </View>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderStageContent()}

        {currentStage !== 8 && (
          <View style={styles.actions}>
            <Button
              title="Back"
              onPress={handleBack}
              variant="secondary"
            />
          <Button
            title="Next"
            onPress={handleNext}
            variant="warn"
          />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
    paddingTop: spacing.md
  },
  header: {
    paddingHorizontal: spacing.lg,
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
  progressIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.sm,
    borderColor: '#333333',
  },
  progressDot: {
    width: '13%',
    height: 8,
    borderRadius: 4,
    backgroundColor: '#333333',
    marginHorizontal: 4,
    marginTop: spacing.lg,
  },
  progressDotActive: {
    backgroundColor: '#FF00FF',
  },
  actions: {
    marginTop: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  privacySection: {
    marginBottom: spacing.md,
  },
  addressSectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: spacing.sm,
    marginTop: 0
  },
  inputWrapper: {
    marginTop: spacing.sm,
  },
  inputContainer: {
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  radioLabel: {
    fontSize: 16,
    fontWeight: 'normal',
  },
  checkboxLabel: {
    fontSize: 16,
    color: colors.text.primary,
    marginBottom: spacing.xs,
    fontWeight: 'normal',
  },
  radioContainer: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    padding: 0,
    marginLeft: 0,
  },
  checkboxContainer: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    padding: 0,
    marginLeft: 0,
    marginBottom: spacing.xs,
  },
  infoText: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: spacing.xs,
    marginBottom: spacing.md,
    fontStyle: 'italic',
  },
  timeRangeContainer: {
    marginLeft: spacing.xl,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  timeRangeLabel: {
    color: '#fff',
    fontSize: 14,
    marginBottom: spacing.xs,
  },
  darkInput: {
    backgroundColor: '#333',
    color: '#fff',
    borderRadius: 8,
    padding: spacing.sm,
    fontSize: 16,
    marginBottom: spacing.md,
  },
  fieldLabel: {
    fontSize: 16,
    color: '#fff',
    marginBottom: spacing.xs,
  },
  spacingTop: {
    marginTop: spacing.lg,
  },
  categoryTitle: {
    fontSize: 16,
    color: '#FFFF00', // Yellow color as shown in the image
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  addRuleText: {
    color: '#FFFF00',
    fontSize: 14,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  selectContainer: {
    marginTop: spacing.sm,
    backgroundColor: '#333',
    borderRadius: 8,
  },
  picker: {
    color: colors.text.primary,
    backgroundColor: '#333',
  },
  pickerItem: {
    color: colors.text.primary,
    fontSize: 16,
    backgroundColor: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#FFFF00', // Yellow color as shown in the image
    marginBottom: spacing.md,
  },
  uploadButton: {
    borderWidth: 1,
    borderColor: colors.text.primary,
    borderRadius: 8,
    padding: spacing.md,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  uploadButtonText: {
    color: colors.text.primary,
    fontSize: 16,
  },
}); 