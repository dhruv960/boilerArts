import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const HOBBIES_LIST = [
  { id: 'painting', name: 'Painting', icon: '🎨' },
  { id: 'drawing', name: 'Drawing', icon: '✏️' },
  { id: 'crochet', name: 'Crochet', icon: '🧶' },
  { id: 'knitting', name: 'Knitting', icon: '🪡' },
  { id: 'photography', name: 'Photography', icon: '📷' },
  { id: 'pottery', name: 'Pottery', icon: '🏺' },
  { id: 'music', name: 'Music', icon: '🎵' },
  { id: 'dance', name: 'Dance', icon: '💃' },
  { id: 'writing', name: 'Writing', icon: '✍️' },
  { id: 'sculpting', name: 'Sculpting', icon: '🗿' },
  { id: 'sewing', name: 'Sewing', icon: '🪡' },
  { id: 'calligraphy', name: 'Calligraphy', icon: '🖋️' },
];

export default function HobbiesScreen({ navigation, onComplete }) {
  const [selectedHobbies, setSelectedHobbies] = useState([]);
  const [error, setError] = useState('');

  const toggleHobby = (hobbyId) => {
    if (selectedHobbies.includes(hobbyId)) {
      setSelectedHobbies(selectedHobbies.filter((id) => id !== hobbyId));
    } else {
      setSelectedHobbies([...selectedHobbies, hobbyId]);
    }
    setError('');
  };

  const handleConfirm = () => {
    if (selectedHobbies.length < 2) {
      setError('Please select at least 2 hobbies');
      return;
    }

    onComplete(selectedHobbies);
    navigation.navigate('Home');
  };

  return (
    <LinearGradient colors={['#667eea', '#764ba2']} style={styles.gradient}>
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Choose Your Hobbies</Text>
            <Text style={styles.subtitle}>Select at least 2 hobbies you want to track</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                Selected: {selectedHobbies.length} / {HOBBIES_LIST.length}
              </Text>
            </View>
          </View>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.grid}
            showsVerticalScrollIndicator={false}
          >
            {HOBBIES_LIST.map((hobby) => {
              const isSelected = selectedHobbies.includes(hobby.id);
              return (
                <TouchableOpacity
                  key={hobby.id}
                  style={[styles.hobbyCard, isSelected && styles.selectedCard]}
                  onPress={() => toggleHobby(hobby.id)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.hobbyIcon}>{hobby.icon}</Text>
                  <Text style={styles.hobbyName}>{hobby.name}</Text>
                  {isSelected && (
                    <View style={styles.checkMark}>
                      <Text style={styles.checkText}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TouchableOpacity style={styles.button} onPress={handleConfirm}>
            <View style={styles.buttonInner}>
              <Text style={styles.buttonText}>Confirm</Text>
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 16,
    textAlign: 'center',
  },
  badge: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  badgeText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  hobbyCard: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  selectedCard: {
    backgroundColor: '#fff',
    borderColor: '#FFD700',
    borderWidth: 3,
  },
  hobbyIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  hobbyName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  checkMark: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#667eea',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  error: {
    backgroundColor: '#fee',
    color: '#c33',
    padding: 12,
    borderRadius: 8,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  button: {
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  buttonInner: {
    padding: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#667eea',
    fontSize: 18,
    fontWeight: '600',
  },
});