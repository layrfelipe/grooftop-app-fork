import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '../../../components/Button';
import { Input } from '../../../components/Input';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { CheckBox } from '@rneui/base';
import { Picker } from '@react-native-picker/picker';
import { api } from '@/src/services/api';
import { rooftopService } from '../services/rooftop.service';
import { CreateRooftopDto } from '../types/rooftop.types';

// Define stage enum for better readability
enum RooftopCreationStage {
  ADDRESS = 'ADDRESS',
  PRIVACY_AND_ACTIVITIES = 'PRIVACY_AND_ACTIVITIES',
  RENTAL_TYPE = 'RENTAL_TYPE',
  GUEST_FLOW_AND_ACCESS = 'GUEST_FLOW_AND_ACCESS',
  FEATURES_AND_VIEWS = 'FEATURES_AND_VIEWS',
  GUIDELINES = 'GUIDELINES',
  PHOTOS_AND_FINAL_DETAILS = 'PHOTOS_AND_FINAL_DETAILS',
}

export const CreateRooftopScreen = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStage, setCurrentStage] = useState<RooftopCreationStage>(RooftopCreationStage.ADDRESS);

  // Metadata
  const [availablePrivacyOptionsMetadata, setAvailablePrivacyOptionsMetadata] = useState<any>([]);
  const [availableActivitiesMetadata, setAvailableActivitiesMetadata] = useState<any>([]);
  const [availableRentalTypesOptionsMetadata, setAvailableRentalTypesOptionsMetadata] = useState<any>([]);

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
  const [rentalType, setRentalType] = useState('');
  const [timeRange, setTimeRange] = useState('');
  const [price, setPrice] = useState('');
  const [periodDuration, setPeriodDuration] = useState('');

  // Guest Flow & Access - Stage 4
  const [maxGuests, setMaxGuests] = useState('');
  const [parkingSpots, setParkingSpots] = useState('');
  const [amenities, setAmenities] = useState<string[]>([]);

  // Photos & Final Details - Stage 5
  const [images, setImages] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Guidelines - Stage 6
  const [cancellationPolicy, setCancellationPolicy] = useState('');

  // Fetch metadata on component mount
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        setIsLoading(true);
        
        // Fetch privacy options and activities
        const privacyAndActivitiesData = await api.getPrivacyOptionsAndAvailableActivitiesMetaDataFromBackend();
        setAvailablePrivacyOptionsMetadata(privacyAndActivitiesData.privacyOptions.data);
        setAvailableActivitiesMetadata(privacyAndActivitiesData.availableActivities.data);
        
        // Fetch rental types
        const rentalTypesData = await api.getRentalTypesOptionsMetaDataFromBackend();
        setAvailableRentalTypesOptionsMetadata(rentalTypesData.data);
      } catch (error) {
        console.error('Error fetching metadata:', error);
        Alert.alert('Error', 'Failed to load form data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetadata();
  }, []);

  // Navigation handlers
  const handleNext = () => {
    const stages = Object.values(RooftopCreationStage);
    const currentIndex = stages.indexOf(currentStage);
    
    if (currentIndex < stages.length - 1) {
      setCurrentStage(stages[currentIndex + 1]);
    } else {
      handleCreate();
    }
  };

  const handleBack = () => {
    const stages = Object.values(RooftopCreationStage);
    const currentIndex = stages.indexOf(currentStage);
    
    if (currentIndex > 0) {
      setCurrentStage(stages[currentIndex - 1]);
    } else {
      router.back();
    }
  };

  // Render content based on current stage
  const renderStageContent = () => {
    switch (currentStage) {
      case RooftopCreationStage.ADDRESS:
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
      
      case RooftopCreationStage.PRIVACY_AND_ACTIVITIES:
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

      case RooftopCreationStage.RENTAL_TYPE:
        return (
          <>
            <Text style={styles.sectionTitle}>Type of Rental</Text>

            <View>
              {availableRentalTypesOptionsMetadata.map((option: any) => (
                <View key={option.id}>
                  <CheckBox
                    title={option.name}
                    checked={rentalType === option.name}
                    onPress={() => setRentalType(option.name)}
                    checkedIcon="dot-circle-o"
                    uncheckedIcon="circle-o"
                    checkedColor={colors.primary}
                    containerStyle={styles.radioContainer}
                    textStyle={[styles.radioLabel, { color: colors.text.primary }]}
                  />
                </View>
              ))}
            </View>

            {rentalType === 'Hourly' && (
              <>
                <Text style={[styles.fieldLabel, styles.spacingTop]}>Hourly Rate</Text>
                <Input
                  value={price}
                  onChangeText={setPrice}
                  placeholder="Enter price per hour"
                  keyboardType="numeric"
                />
              </>
            )}

            {rentalType === 'By period' && (
              <>
                <Text style={[styles.fieldLabel, styles.spacingTop]}>Period Duration</Text>
                <View style={styles.selectContainer}>
                  <Picker
                    selectedValue={periodDuration}
                    onValueChange={(itemValue) => setPeriodDuration(itemValue)}
                    style={styles.picker}
                    dropdownIconColor={colors.text.primary}
                    mode="dropdown"
                  >
                    <Picker.Item 
                      label="Select period duration" 
                      value="" 
                      style={[styles.pickerItem, { color: '#666' }]} 
                      color="#666"
                    />
                    {[
                      {id: '4hours', name: '4 hours'},
                      {id: '6hours', name: '6 hours'},
                      {id: '8hours', name: '8 hours'},
                      {id: '12hours', name: '12 hours'},
                      {id: '24hours', name: '24 hours'},
                      {id: '48hours', name: '48 hours'},
                      {id: '72hours', name: '72 hours'},
                      {id: '1week', name: '1 week'}
                    ].map((period) => (
                      <Picker.Item 
                        key={period.id}
                        label={period.name} 
                        value={period.id}
                        style={styles.pickerItem}
                        color={colors.text.primary}
                      />
                    ))}
                  </Picker>
                </View>

                <Text style={[styles.fieldLabel, styles.spacingTop]}>Period Price</Text>
                <Input
                  value={price}
                  onChangeText={setPrice}
                  placeholder="Enter price for the selected period"
                  keyboardType="numeric"
                />
              </>
            )}
          </>
        );

      case RooftopCreationStage.GUEST_FLOW_AND_ACCESS:
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
              textStyle={[styles.checkboxLabel, { color: colors.text.primary }]}
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
              textStyle={[styles.checkboxLabel, { color: colors.text.primary }]}
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
                textStyle={[styles.checkboxLabel, { color: colors.text.primary }]}
              />
            ))}
          </>
        );

      case RooftopCreationStage.FEATURES_AND_VIEWS:
        return (
          <>
            <Text style={styles.sectionTitle}>Features & Views</Text>
            
            <Text style={styles.categoryTitle}>Service</Text>
            {[
              {id: 'bar', name: 'Bar'},
              {id: 'restaurant', name: 'Restaurant'},
              {id: 'coffeeShop', name: 'Coffee shop'},
              {id: 'foodHelp', name: 'Food help'},
              {id: 'cateringService', name: 'Catering service'},
              {id: 'bbqArea', name: 'BBQ area'},
              {id: 'cocktailService', name: 'Cocktail service'},
              {id: 'freeWifi', name: 'Free wi-fi'},
              {id: 'liveMusic', name: 'Live music'},
              {id: 'djAvailable', name: 'DJ available'}
            ].map((service) => (
              <CheckBox
                key={service.id}
                title={service.name}
                checked={amenities.includes(service.id)}
                onPress={() => {
                  if (amenities.includes(service.id)) {
                    setAmenities(amenities.filter(a => a !== service.id));
                  } else {
                    setAmenities([...amenities, service.id]);
                  }
                }}
                checkedColor={colors.primary}
                containerStyle={styles.checkboxContainer}
                textStyle={[styles.checkboxLabel, { color: colors.text.primary }]}
              />
            ))}

            <Text style={[styles.categoryTitle, styles.spacingTop]}>Facilities</Text>
            {[
              {id: 'pool', name: 'Pool'},
              {id: 'shower', name: 'Shower'},
              {id: 'jacuzzi', name: 'Jacuzzi'},
              {id: 'airConditioning', name: 'Air conditioning'},
              {id: 'chairs', name: 'Chairs'},
              {id: 'benches', name: 'Benches'},
              {id: 'coveredArea', name: 'Covered Area'},
              {id: 'bathroom', name: 'Bathroom'}
            ].map((facility) => (
              <CheckBox
                key={facility.id}
                title={facility.name}
                checked={amenities.includes(facility.id)}
                onPress={() => {
                  if (amenities.includes(facility.id)) {
                    setAmenities(amenities.filter(a => a !== facility.id));
                  } else {
                    setAmenities([...amenities, facility.id]);
                  }
                }}
                checkedColor={colors.primary}
                containerStyle={styles.checkboxContainer}
                textStyle={[styles.checkboxLabel, { color: colors.text.primary }]}
              />
            ))}

            <Text style={[styles.categoryTitle, styles.spacingTop]}>View Types</Text>
            {[
              {id: 'skyline', name: 'Skyline'},
              {id: 'lake', name: 'Lake'},
              {id: 'river', name: 'River'},
              {id: 'beach', name: 'Beach'},
              {id: 'forest', name: 'Forest'},
              {id: 'urbanView', name: 'Urban view'},
              {id: 'panoramicView', name: 'Panoramic view'},
              {id: 'cityLightsAtNight', name: 'City lights at night'}
            ].map((view) => (
              <CheckBox
                key={view.id}
                title={view.name}
                checked={amenities.includes(view.id)}
                onPress={() => {
                  if (amenities.includes(view.id)) {
                    setAmenities(amenities.filter(a => a !== view.id));
                  } else {
                    setAmenities([...amenities, view.id]);
                  }
                }}
                checkedColor={colors.primary}
                containerStyle={styles.checkboxContainer}
                textStyle={[styles.checkboxLabel, { color: colors.text.primary }]}
              />
            ))}
          </>
        );

      case RooftopCreationStage.GUIDELINES:
        return (
          <>
            <Text style={styles.sectionTitle}>Guidelines</Text>
            
            <Text style={styles.categoryTitle}>Rules</Text>
            {[
              {id: 'alcoholAllowed', name: 'Alcohol allowed'},
              {id: 'noOutsideAlcohol', name: 'No outside alcohol'},
              {id: 'noSmokingIndoors', name: 'No smoking indoors'},
              {id: 'liveEventsAllowed', name: 'Live events allowed'},
              {id: 'noLoudNoise', name: 'No loud noise'},
              {id: 'ageRestrictions', name: 'Age restrictions'},
              {id: 'mandatoryClosingTime', name: 'Mandatory closing time'},
              {id: 'petFriendly', name: 'Pet Friendly'},
              {id: 'noFireworks', name: 'No fireworks'},
              {id: 'idRequiredForEntry', name: 'ID required for entry'}
            ].map((rule) => (
              <CheckBox
                key={rule.id}
                title={rule.name}
                checked={amenities.includes(rule.id)}
                onPress={() => {
                  if (amenities.includes(rule.id)) {
                    setAmenities(amenities.filter(a => a !== rule.id));
                  } else {
                    setAmenities([...amenities, rule.id]);
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
                  {id: 'freeCancellationUpTo7Days', name: 'Free cancellation up to 7 days before the event'},
                  {id: 'partialRefundBeforeCancellation', name: 'Partial refund before cancellation'},
                  {id: 'noCancellationAllowed', name: 'No cancellation allowed'},
                  {id: 'cancellationFeeOf5', name: 'Cancellation fee of 5%'},
                  {id: 'reschedulingAllowedWithAdvanceNotice', name: 'Rescheduling allowed with advance notice'},
                  {id: 'cancellationAvailableOnlyInCaseOfEmergency', name: 'Cancellation available only in case of emergency'},
                  {id: 'noRefundAfter2Days', name: 'No refund after 2 days before the event'},
                  {id: 'fullRefundIfCanceledWithin24Hours', name: 'Full refund if canceled within 24 hours'}
                ].map((policy) => (
                  <Picker.Item 
                    key={policy.id}
                    label={policy.name} 
                    value={policy.id}
                    style={styles.pickerItem}
                    color={colors.text.primary}
                  />
                ))}
              </Picker>
            </View>
          </>
        );

      case RooftopCreationStage.PHOTOS_AND_FINAL_DETAILS:
        return (
          <>
            <Text style={styles.sectionTitle}>Photos & Final Details</Text>
            
            <View style={styles.inputContainer}>
              <Input
                label="Title"
                value={title}
                onChangeText={setTitle}
                placeholder="Enter a title for your rooftop"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Input
                label="Description"
                value={description}
                onChangeText={setDescription}
                placeholder="Describe your rooftop"
                multiline
                numberOfLines={4}
              />
            </View>
            
            <Text style={styles.subtitle}>Add photos of your rooftop</Text>
            
            <TouchableOpacity 
              style={styles.uploadButton}
              onPress={() => {
                // This will be implemented in the image upload feature
                Alert.alert('Coming Soon', 'Image upload functionality will be implemented soon.');
              }}
            >
              <Text style={styles.uploadButtonText}>Add photos</Text>
            </TouchableOpacity>
            
            {images.length > 0 && (
              <View style={styles.imagePreviewContainer}>
                {images.map((image, index) => (
                  <Image 
                    key={index}
                    source={{ uri: image }}
                    style={styles.imagePreview}
                  />
                ))}
              </View>
            )}
          </>
        );
    }
  };

  // Create rooftop and navigate to success screen
  const handleCreate = async () => {
    try {
      setIsLoading(true);
      // Validate required fields
      if (!title || !description || !city || !maxGuests || (rentalType !== 'Free' && !price)) {
        Alert.alert('Missing Information', 'Please fill in all required fields.');
        setIsLoading(false);
        return;
      }
      
      // Prepare data for API
      const rooftopData: CreateRooftopDto = {
        title,
        description,
        city,
        capacity: parseInt(maxGuests, 10),
        pricePerHour: rentalType === 'Free' ? 0 : parseFloat(price),
        images: images.length > 0 ? images : ['https://picsum.photos/800/600'], // Default image if none provided
      };
      
      // Send request to create rooftop
      const response = await rooftopService.createRooftop(rooftopData);
      
      // Navigate to success screen
      router.push('/success/success');
    } catch (error) {
      console.error('Failed to create rooftop:', error);
      Alert.alert('Error', 'Failed to create rooftop. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Get stage title for display
  const getStageTitle = () => {
    switch (currentStage) {
      case RooftopCreationStage.ADDRESS:
        return 'Address';
      case RooftopCreationStage.PRIVACY_AND_ACTIVITIES:
        return 'Privacy & Activities';
      case RooftopCreationStage.RENTAL_TYPE:
        return 'Rental Type';
      case RooftopCreationStage.GUEST_FLOW_AND_ACCESS:
        return 'Guest Flow & Access';
      case RooftopCreationStage.FEATURES_AND_VIEWS:
        return 'Features & Views';
      case RooftopCreationStage.GUIDELINES:
        return 'Guidelines';
      case RooftopCreationStage.PHOTOS_AND_FINAL_DETAILS:
        return 'Photos & Final Details';
      default:
        return '';
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Register your rooftop</Text>
        <Text style={styles.stageTitle}>{getStageTitle()}</Text>
        <View style={styles.progressIndicator}>
          {Object.values(RooftopCreationStage).map((stage, index) => (
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

        <View style={styles.actions}>
          <Button
            title="Back"
            onPress={handleBack}
            variant="secondary"
          />
          <Button
            title={currentStage === RooftopCreationStage.PHOTOS_AND_FINAL_DETAILS ? "Create" : "Next"}
            onPress={handleNext}
            variant="primary"
          />
        </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
  },
  loadingText: {
    marginTop: spacing.md,
    color: colors.text.primary,
    fontSize: 16,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  stageTitle: {
    fontSize: 18,
    color: colors.primary,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingTop: 0
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
    backgroundColor: colors.primary
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
    color: colors.text.primary,
    fontSize: 14,
    marginBottom: spacing.xs,
  },
  darkInput: {
    backgroundColor: '#333',
    color: colors.text.primary,
    borderRadius: 8,
    padding: spacing.sm,
    fontSize: 16,
    marginBottom: spacing.md,
  },
  fieldLabel: {
    fontSize: 16,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  spacingTop: {
    marginTop: spacing.lg,
  },
  categoryTitle: {
    fontSize: 16,
    color: colors.primary,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  addRuleText: {
    color: colors.primary,
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
    color: colors.primary,
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
  imagePreviewContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.md,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
}); 