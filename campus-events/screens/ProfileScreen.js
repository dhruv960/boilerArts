import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomNav from '../components/BottomNav';

const BADGES = [
  {
    id: 'first-activity',
    name: 'First Steps',
    description: 'Logged your first activity',
    icon: '🎯',
  },
  {
    id: 'dedicated',
    name: 'Dedicated Artist',
    description: 'Logged 10 activities',
    icon: '🏆',
  },
  {
    id: 'star-collector',
    name: 'Star Collector',
    description: 'Earned 50 total stars',
    icon: '⭐',
  },
  {
    id: 'week-warrior',
    name: 'Week Warrior',
    description: 'Active every day for a week',
    icon: '🔥',
  },
  {
    id: 'master',
    name: 'Master Creator',
    description: 'Earned 100 total stars',
    icon: '👑',
  },
];

export default function ProfileScreen({ user, onLogout }) {
  const [badges, setBadges] = useState([]);
  const [totalStars, setTotalStars] = useState(0);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const badgesJson = await AsyncStorage.getItem(`badges_${user.username}`);
      const userBadges = badgesJson ? JSON.parse(badgesJson) : [];
      setBadges(userBadges);

      const activitiesJson = await AsyncStorage.getItem(`activities_${user.username}`);
      const activities = activitiesJson ? JSON.parse(activitiesJson) : [];
      const stars = activities.reduce((sum, activity) => sum + activity.stars, 0);
      setTotalStars(stars);
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const isBadgeEarned = (badgeId) => badges.includes(badgeId);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.profileCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user.firstName.charAt(0)}
                {user.lastName.charAt(0)}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.name}>
                {user.firstName} {user.lastName}
              </Text>
              <Text style={styles.username}>@{user.username}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>My Stars</Text>
            <View style={styles.starsCard}>
              <Text style={styles.starIcon}>⭐</Text>
              <Text style={styles.starCount}>{totalStars}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Badges</Text>
            {BADGES.map((badge) => {
              const earned = isBadgeEarned(badge.id);
              return (
                <View
                  key={badge.id}
                  style={[styles.badgeCard, earned && styles.badgeEarned]}
                >
                  <Text style={styles.badgeIcon}>{earned ? badge.icon : '🔒'}</Text>
                  <View style={styles.badgeInfo}>
                    <Text style={styles.badgeName}>{badge.name}</Text>
                    <Text style={styles.badgeDescription}>{badge.description}</Text>
                  </View>
                </View>
              );
            })}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  logoutButton: {
    backgroundColor: '#ff6b6b',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  logoutText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  avatarText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  username: {
    fontSize: 16,
    color: '#667eea',
    fontWeight: '600',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  starsCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  starIcon: {
    fontSize: 48,
    marginRight: 20,
  },
  starCount: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#667eea',
  },
  badgeCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 15,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    opacity: 0.6,
  },
  badgeEarned: {
    backgroundColor: '#fff5e6',
    borderWidth: 2,
    borderColor: '#FFD700',
    opacity: 1,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  badgeIcon: {
    fontSize: 40,
    marginRight: 16,
  },
  badgeInfo: {
    flex: 1,
  },
  badgeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  badgeDescription: {
    fontSize: 14,
    color: '#666',
  },
});