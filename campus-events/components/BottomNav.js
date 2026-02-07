import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function BottomNav() {
  const navigation = useNavigation();
  const route = useRoute();

  const isActive = (routeName) => route.name === routeName;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.navButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={[styles.icon, isActive('Home') && styles.activeIcon]}>
          🏠
        </Text>
        <Text style={[styles.label, isActive('Home') && styles.activeLabel]}>
          Home
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navButton}
        onPress={() => navigation.navigate('LogActivity')}
      >
        <Text style={[styles.icon, isActive('LogActivity') && styles.activeIcon]}>
          ➕
        </Text>
        <Text style={[styles.label, isActive('LogActivity') && styles.activeLabel]}>
          Log
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navButton}
        onPress={() => navigation.navigate('Logs')}
      >
        <Text style={[styles.icon, isActive('Logs') && styles.activeIcon]}>
          📊
        </Text>
        <Text style={[styles.label, isActive('Logs') && styles.activeLabel]}>
          Logs
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navButton}
        onPress={() => navigation.navigate('Profile')}
      >
        <Text style={[styles.icon, isActive('Profile') && styles.activeIcon]}>
          👤
        </Text>
        <Text style={[styles.label, isActive('Profile') && styles.activeLabel]}>
          Profile
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingVertical: 10,
    paddingBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  navButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  icon: {
    fontSize: 24,
    marginBottom: 4,
    opacity: 0.5,
  },
  activeIcon: {
    opacity: 1,
  },
  label: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
  },
  activeLabel: {
    color: '#667eea',
  },
});