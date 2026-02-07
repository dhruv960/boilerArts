import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import BottomNav from '../components/BottomNav';

const SAMPLE_EVENTS = [
  {
    id: 1,
    title: 'Watercolor Workshop',
    club: 'Purdue Art Society',
    date: 'Feb 15, 2026',
    time: '6:00 PM - 8:00 PM',
    location: 'Visual Arts Building, Room 201',
    description: 'Learn basic watercolor techniques with experienced members. All materials provided!',
    icon: '🎨',
  },
  {
    id: 2,
    title: 'Open Mic Night',
    club: 'Purdue Music Collective',
    date: 'Feb 20, 2026',
    time: '7:00 PM - 9:00 PM',
    location: 'Purdue Memorial Union',
    description: 'Showcase your musical talents or enjoy performances from fellow students. Sign up at the door!',
    icon: '🎤',
  },
];

export default function HomeScreen({ user }) {
  const [starsThisWeek, setStarsThisWeek] = useState(0);

  useEffect(() => {
    loadStars();
  }, []);

  const loadStars = async () => {
    try {
      const activitiesJson = await AsyncStorage.getItem(`activities_${user.username}`);
      const activities = activitiesJson ? JSON.parse(activitiesJson) : [];

      const now = new Date();
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);

      const weeklyStars = activities
        .filter((activity) => new Date(activity.date) >= startOfWeek)
        .reduce((sum, activity) => sum + activity.stars, 0);

      setStarsThisWeek(weeklyStars);
    } catch (error) {
      console.error('Error loading stars:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.greeting}>Welcome back, {user.firstName}! 👋</Text>

          <LinearGradient colors={['#667eea', '#764ba2']} style={styles.starsBox}>
            <Text style={styles.starIcon}>⭐</Text>
            <View style={styles.starsInfo}>
              <Text style={styles.starsTitle}>Stars Earned This Week</Text>
              <Text style={styles.starsCount}>{starsThisWeek}</Text>
            </View>
          </LinearGradient>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Upcoming Events</Text>

            {SAMPLE_EVENTS.map((event) => (
              <View key={event.id} style={styles.eventBox}>
                <Text style={styles.eventIcon}>{event.icon}</Text>
                <View style={styles.eventContent}>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <Text style={styles.eventClub}>Hosted by {event.club}</Text>
                  
                  <View style={styles.eventDetails}>
                    <View style={styles.eventDetail}>
                      <Text style={styles.detailIcon}>📅</Text>
                      <Text style={styles.detailText}>{event.date}</Text>
                    </View>
                    <View style={styles.eventDetail}>
                      <Text style={styles.detailIcon}>🕐</Text>
                      <Text style={styles.detailText}>{event.time}</Text>
                    </View>
                    <View style={styles.eventDetail}>
                      <Text style={styles.detailIcon}>📍</Text>
                      <Text style={styles.detailText}>{event.location}</Text>
                    </View>
                  </View>

                  <Text style={styles.eventDescription}>{event.description}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
      <BottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  starsBox: {
    borderRadius: 20,
    padding: 25,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  starIcon: {
    fontSize: 60,
    marginRight: 20,
  },
  starsInfo: {
    flex: 1,
  },
  starsTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  starsCount: {
    color: '#fff',
    fontSize: 48,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  eventBox: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  eventIcon: {
    fontSize: 48,
    marginRight: 16,
  },
  eventContent: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  eventClub: {
    fontSize: 14,
    color: '#667eea',
    fontWeight: '600',
    marginBottom: 12,
  },
  eventDetails: {
    marginBottom: 12,
  },
  eventDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#555',
  },
  eventDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});