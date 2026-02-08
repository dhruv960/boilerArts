import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { AppRegistry } from 'react-native';
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await loadUserData(user.uid);
      } else {
        setCurrentUser(null);
        setIsAuthenticated(false);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);
  const loadUserData = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        setCurrentUser({ uid, ...userDoc.data() });
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };
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

  const handleSignUp = async (email, password, username, firstName, lastName) => {
    try {
      // Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
	  console.log("Into sign up function");      
      // Create Firestore user document
      await setDoc(doc(db, 'users', userCredential.user.uid), {

        username,
        email,
		firstName,
		lastName,
        stars: 0,
        badges: [],
        createdAt: new Date(),
      	hobbies: []
	  });

	console.log("done the sign up");

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const handleHobbiesComplete = async (hobbies) => {
    try {
    console.log('Saving hobbies:', hobbies);
    
    // Update Firestore with hobbies
    await updateDoc(doc(db, 'users', currentUser.uid), {
      hobbies: hobbies
    });
    
    console.log('Hobbies saved to Firestore');
    
    // Update local state
    const updatedUser = { ...currentUser, hobbies };
    setCurrentUser(updatedUser);
    setIsAuthenticated(true);
    setNeedsHobbies(false);
  } catch (error) {
    console.error('Error saving hobbies:', error);
  }
  };

  const handleLogin = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleActivityLogged = async (activityName, timeSpent) => {
     try {
    console.log('Logging activity:', activityName, timeSpent);
    
    const stars = Math.floor(timeSpent / 30);
    
    // Create the new activity object
    const newActivity = {
      name: activityName,
      timeSpent: timeSpent,
      stars: stars,
      createdAt: new Date().toISOString() // timestamp as string
    };
	const q = query(
      collection(db, "badges")    );
   
    const snapshot = await getDocs(q);
			 const badgesSnap = snapshot;

  const earnedBadges = currentUser.badges || [];
	badgesSnap.forEach(badgeDoc => {
    const badge = badgeDoc.data();

    if (
      stars + (currentUser.stars || 0) >= badge.stars &&
      !earnedBadges.includes(badge.name)
    ) {
      earnedBadges.push(badge.name);
    }
  });

    // Get current activities array (or empty array if none)
    const currentActivities = currentUser.activities || [];
    console.log("fetched current user actiovities");  
    // Add new activity to the array
    const updatedActivities = [...currentActivities, newActivity];
    console.log("added new activity to list");
    // Update Firestore - add to activities array AND update stars
    await updateDoc(doc(db, 'users', currentUser.uid), {
      activities: updatedActivities,
      stars: (currentUser.stars || 0) + stars,
	  badges: earnedBadges
	});
    
    console.log('Activity and stars updated in Firestore');
    
    // Update local state
    setCurrentUser({ 
      ...currentUser, 
      activities: updatedActivities,
      stars: (currentUser.stars || 0) + stars 
    });
    
    setLastActivityStars(stars);
    
    return { success: true, stars };
  } catch (error) {
    console.error('Error logging activity:', error);
    return { success: false, error: error.message };
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

AppRegistry.registerComponent('main', () => App);
