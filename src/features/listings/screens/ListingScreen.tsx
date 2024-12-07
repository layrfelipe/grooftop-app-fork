import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';

const ListingScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: 'https://via.placeholder.com/400x300' }}
        style={styles.image}
      />
      <View style={styles.content}>
        <Text style={styles.title}>Luxurious Beachfront Villa</Text>
        <Text style={styles.location}>Malibu, California</Text>
        <Text style={styles.price}>$500/night</Text>
        <Text style={styles.description}>
          Enjoy this stunning beachfront villa with panoramic ocean views. 
          This spacious property features 4 bedrooms, 3 bathrooms, a fully 
          equipped kitchen, and a private pool. Perfect for a relaxing 
          getaway or entertaining guests.
        </Text>
        <Text style={styles.amenities}>
          Amenities: WiFi, Air conditioning, Kitchen, Pool, Beach access
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 300,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  location: {
    fontSize: 18,
    color: '#666',
    marginBottom: 5,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF5A5F',
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 15,
  },
  amenities: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ListingScreen; 