import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Screens
import SignUpScreen from './screens/SignUpScreen';
import HobbiesScreen from './screens/HobbiesScreen';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import LogActivityScreen from './screens/LogActivityScreen';
import StarsEarnedScreen from './screens/StarsEarnedScreen';
import ProfileScreen from './screens/ProfileScreen';
import LogsScreen from './screens/LogsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [needsHobbies, setNeedsHobbies] = useState(false);
  const [lastActivityStars, setLastActivityStars] = useState(0);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const userJson = await AsyncStorage.getItem('currentUser');
      if (userJson) {
        const user = JSON.parse(userJson);
        setCurrentUser(user);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error loading user:', error);
    }
  };

  const handleSignUp = async (userData) => {
    try {
      const user = {
        ...userData,
        joinDate: new Date().toISOString()
      };
      
      await AsyncStorage.setItem('currentUser', JSON.stringify(user));
      await AsyncStorage.setItem(`activities_${userData.username}`, JSON.stringify([]));
      await AsyncStorage.setItem(`badges_${userData.username}`, JSON.stringify([]));
      
      setCurrentUser(user);
      setNeedsHobbies(true);
    } catch (error) {
      console.error('Error signing up:', error);
    }
  };

  const handleHobbiesComplete = async (hobbies) => {
    try {
      const updatedUser = { ...currentUser, hobbies };
      await AsyncStorage.setItem('currentUser', JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);
      setIsAuthenticated(true);
      setNeedsHobbies(false);
    } catch (error) {
      console.error('Error saving hobbies:', error);
    }
  };

  const handleLogin = async (username, password) => {
    try {
      const userJson = await AsyncStorage.getItem('currentUser');
      if (userJson) {
        const user = JSON.parse(userJson);
        if (user.username === username) {
          setCurrentUser(user);
          setIsAuthenticated(true);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Error logging in:', error);
      return false;
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('currentUser');
      setIsAuthenticated(false);
      setCurrentUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleActivityLogged = async (activityName, timeSpent) => {
    try {
      const stars = Math.floor(timeSpent / 30);
      
      const activity = {
        id: Date.now(),
        name: activityName,
        timeSpent: timeSpent,
        stars: stars,
        date: new Date().toISOString()
      };

      const activitiesJson = await AsyncStorage.getItem(`activities_${currentUser.username}`);
      const activities = activitiesJson ? JSON.parse(activitiesJson) : [];
      activities.push(activity);
      
      await AsyncStorage.setItem(`activities_${currentUser.username}`, JSON.stringify(activities));
      setLastActivityStars(stars);

      // Check badges
      await checkBadges(activities);
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  };

  const checkBadges = async (activities) => {
    try {
      const badgesJson = await AsyncStorage.getItem(`badges_${currentUser.username}`);
      const badges = badgesJson ? JSON.parse(badgesJson) : [];
      const newBadges = [...badges];

      if (activities.length >= 1 && !badges.includes('first-activity')) {
        newBadges.push('first-activity');
      }

      if (activities.length >= 10 && !badges.includes('dedicated')) {
        newBadges.push('dedicated');
      }

      const totalStars = activities.reduce((sum, act) => sum + act.stars, 0);
      if (totalStars >= 50 && !badges.includes('star-collector')) {
        newBadges.push('star-collector');
      }

      if (newBadges.length > badges.length) {
        await AsyncStorage.setItem(`badges_${currentUser.username}`, JSON.stringify(newBadges));
      }
    } catch (error) {
      console.error('Error checking badges:', error);
    }
  };

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right'
        }}
      >
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="Login">
              {(props) => <LoginScreen {...props} onLogin={handleLogin} />}
            </Stack.Screen>
            <Stack.Screen name="SignUp">
              {(props) => <SignUpScreen {...props} onSignUp={handleSignUp} />}
            </Stack.Screen>
            <Stack.Screen name="Hobbies">
              {(props) => <HobbiesScreen {...props} onComplete={handleHobbiesComplete} />}
            </Stack.Screen>
          </>
        ) : (
          <>
            <Stack.Screen name="Home">
              {(props) => <HomeScreen {...props} user={currentUser} />}
            </Stack.Screen>
            <Stack.Screen name="LogActivity">
              {(props) => <LogActivityScreen {...props} onActivityLogged={handleActivityLogged} user={currentUser} />}
            </Stack.Screen>
            <Stack.Screen name="StarsEarned">
              {(props) => <StarsEarnedScreen {...props} stars={lastActivityStars} />}
            </Stack.Screen>
            <Stack.Screen name="Profile">
              {(props) => <ProfileScreen {...props} user={currentUser} onLogout={handleLogout} />}
            </Stack.Screen>
            <Stack.Screen name="Logs">
              {(props) => <LogsScreen {...props} user={currentUser} />}
            </Stack.Screen>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}