import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

const SearchScreen = () => {
  const [location, setLocation] = useState('');
  const [dates, setDates] = useState('');
  const [guests, setGuests] = useState('');

  const handleSearch = () => {
    // Implement search functionality here
    console.log('Searching for:', { location, dates, guests });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Search for a stay</Text>
      <TextInput
        style={styles.input}
        placeholder="Where are you going?"
        value={location}
        onChangeText={setLocation}
      />
      <TextInput
        style={styles.input}
        placeholder="When? (e.g., MM/DD - MM/DD)"
        value={dates}
        onChangeText={setDates}
      />
      <TextInput
        style={styles.input}
        placeholder="Number of guests"
        value={guests}
        onChangeText={setGuests}
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.button} onPress={handleSearch}>
        <Text style={styles.buttonText}>Search</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FF5A5F',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#FF5A5F',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default SearchScreen; 