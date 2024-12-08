import React from 'react';
import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../../src/theme/colors';
import { Platform, View } from 'react-native';

export default function TabLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.background.primary }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.text.tertiary,
          tabBarStyle: {
            backgroundColor: colors.background.secondary,
            borderTopColor: colors.border.default,
            elevation: 0,
            shadowOpacity: 0,
            height: Platform.OS === 'android' ? 60 : undefined,
            paddingBottom: Platform.OS === 'android' ? 8 : undefined,
            paddingTop: Platform.OS === 'android' ? 8 : undefined,
          },
          tabBarLabelStyle: {
            fontWeight: '500',
            fontSize: 12,
          },
          headerShown: false,
          tabBarBackground: () => (
            <View style={{ flex: 1, backgroundColor: colors.background.secondary }} />
          ),
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="home" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="bookings"
          options={{
            title: 'My Bookings',
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="calendar-today" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="create"
          options={{
            title: 'Add Rooftop',
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="add-business" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="person" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}
