import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function StarsEarnedScreen({ navigation, stars }) {
  const scaleAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      navigation.navigate('Home');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient colors={['#cfb991', '#daaa00']} style={styles.container}>
      <View style={styles.content}>
        <Animated.View style={[styles.starContainer, { transform: [{ scale: scaleAnim }] }]}>
          <Text style={styles.bigStar}>⭐</Text>
        </Animated.View>

        <Text style={styles.title}>You've got</Text>
        <Text style={styles.number}>{stars}</Text>
        <Text style={styles.subtitle}>{stars === 1 ? 'Star!' : 'Stars!'}</Text>

        <Text style={styles.message}>Great job tracking your activity!</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Home')}
        >
          <View style={styles.buttonInner}>
            <Text style={styles.buttonText}>Back to Home</Text>
          </View>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  starContainer: {
    marginBottom: 30,
  },
  bigStar: {
    fontSize: 120,
  },
  title: {
    fontSize: 32,
    color: '#fff',
    fontWeight: '400',
    marginBottom: 10,
  },
  number: {
    fontSize: 96,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 40,
    color: '#fff',
    fontWeight: '600',
    marginBottom: 20,
  },
  message: {
    fontSize: 18,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
  },
  buttonInner: {
    paddingVertical: 14,
    paddingHorizontal: 40,
  },
  buttonText: {
    color: '#cfb991',
    fontSize: 18,
    fontWeight: '600',
  },
});