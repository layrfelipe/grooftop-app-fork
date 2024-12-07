import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

interface Listing {
  id: string;
  title: string;
  location: string;
  price: string;
  image: string;
}

const listings: Listing[] = [
  { id: '1', title: 'Cozy Apartment', location: 'New York', price: '$100/night', image: 'https://via.placeholder.com/150' },
  { id: '2', title: 'Beach House', location: 'Miami', price: '$200/night', image: 'https://via.placeholder.com/150' },
  { id: '3', title: 'Mountain Cabin', location: 'Colorado', price: '$150/night', image: 'https://via.placeholder.com/150' },
];

const HomeScreen = () => {
  const router = useRouter();

  const renderItem = ({ item }: { item: Listing }) => (
    <TouchableOpacity 
      style={styles.listingItem}
      onPress={() => router.push(`/listing/${item.id}`)}
    >
      <Image source={{ uri: item.image }} style={styles.listingImage} />
      <Text style={styles.listingTitle}>{item.title}</Text>
      <Text style={styles.listingLocation}>{item.location}</Text>
      <Text style={styles.listingPrice}>{item.price}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome to Grooftop</Text>
      <FlatList
        data={listings}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={2}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FF5A5F',
  },
  listingItem: {
    flex: 1,
    margin: 5,
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 5,
  },
  listingImage: {
    width: '100%',
    height: 100,
    borderRadius: 5,
    marginBottom: 5,
  },
  listingTitle: {
    fontWeight: 'bold',
    marginBottom: 2,
  },
  listingLocation: {
    color: '#666',
    marginBottom: 2,
  },
  listingPrice: {
    fontWeight: 'bold',
    color: '#FF5A5F',
  },
});

export default HomeScreen; 