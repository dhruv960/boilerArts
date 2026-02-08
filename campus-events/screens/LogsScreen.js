import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import BottomNav from '../components/BottomNav';
 import {
    SafeAreaView,
  } from 'react-native';

export default function LogsScreen({ user }) {
  const [starsThisWeek, setStarsThisWeek] = useState(0);
  const [activityData, setActivityData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWeeklyData();
  }, []);

  const loadWeeklyData = async () => {
    try {
      setLoading(true);
      
      // Fetch user document from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (!userDoc.exists()) {
        console.log('User document not found');
        setLoading(false);
        return;
      }
      
      const userData = userDoc.data();
      const activities = userData.activities || [];
      
      // Calculate start of week (Sunday 00:00:00)
      const now = new Date();
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);
      
      // Filter activities from this week
      const weeklyActivities = activities.filter((activity) => {
        const activityDate = new Date(activity.createdAt);
        return activityDate >= startOfWeek;
      });
      
      console.log('Weekly activities:', weeklyActivities);
      
      // Calculate total stars this week
      const totalStars = weeklyActivities.reduce((sum, activity) => sum + (activity.stars || 0), 0);
      setStarsThisWeek(totalStars);
      
      // Aggregate by activity name
      const aggregated = {};
      weeklyActivities.forEach((activity) => {
        const name = activity.name;
        if (aggregated[name]) {
          aggregated[name] += activity.stars || 0;
        } else {
          aggregated[name] = activity.stars || 0;
        }
      });
      
      // Convert to array and sort by stars (highest first)
      const aggregatedArray = Object.keys(aggregated).map((name) => ({
        name,
        stars: aggregated[name]
      }));
      aggregatedArray.sort((a, b) => b.stars - a.stars);
      
      console.log('Aggregated data:', aggregatedArray);
      setActivityData(aggregatedArray);
      
    } catch (error) {
      console.error('Error loading weekly data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#667eea" />
        <Text style={styles.loadingText}>Loading your stats...</Text>
      </View>
    );
  }

  // Find max stars for scaling the bar chart
  const maxStars = activityData.length > 0 
    ? Math.max(...activityData.map(a => a.stars))
    : 1;

  return (
  <SafeAreaView style={styles.container}>
	<ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Weekly Stats</Text>
        <View style={styles.starsCard}>
          <Text style={styles.starsLabel}>Stars This Week</Text>
          <Text style={styles.starsNumber}>{starsThisWeek} ⭐</Text>
        </View>
      </View>

      <View style={styles.chartSection}>
        <Text style={styles.chartTitle}>Stars by Activity</Text>
        
        {activityData.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No activities logged this week</Text>
            <Text style={styles.emptySubtext}>Start logging activities to see your stats!</Text>
          </View>
        ) : (
          <View style={styles.chart}>
            {activityData.map((item, index) => (
              <View key={index} style={styles.barContainer}>
                <Text style={styles.activityName} numberOfLines={1}>
                  {item.name}
                </Text>
                <View style={styles.barWrapper}>
                  <View 
                    style={[
                      styles.bar, 
                      { width: `${(item.stars / maxStars) * 100}%` }
                    ]}
                  />
                  <Text style={styles.starCount}>{item.stars} ⭐</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
   <BottomNav/ >
  </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingTop:50,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  starsCard: {
    backgroundColor: '#667eea',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  starsLabel: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  starsNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 5,
  },
  chartSection: {
    padding: 20,
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: 'bold',
        color: '#333',
    marginBottom: 15,
  },
  chart: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
	marginRight: 10,
  },
  barContainer: {
    marginBottom: 20,
	paddingRight: 15,
  },
  activityName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  barWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 20,
  },
  bar: {
    height: 30,
    backgroundColor: '#667eea',
    borderRadius: 6,
    minWidth: 40,
  },
  starCount: {
    marginLeft: 10,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#667eea',
  },
  emptyState: {
    backgroundColor: '#fff',
    padding: 40,
    borderRadius: 12,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 5,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
  },
});
