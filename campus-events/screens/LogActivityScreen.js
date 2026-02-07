import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import BottomNav from '../components/BottomNav';

export default function LogActivityScreen({ navigation, onActivityLogged }) {
  const [activityName, setActivityName] = useState('');
  const [timeSpent, setTimeSpent] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');

    if (!activityName) {
      setError('Please enter an activity name');
      return;
    }

    if (!timeSpent || parseInt(timeSpent) <= 0) {
      setError('Please enter valid time spent (in minutes)');
      return;
    }

    await onActivityLogged(activityName, parseInt(timeSpent));
    navigation.navigate('StarsEarned');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Log Activity</Text>
            <Text style={styles.subtitle}>Track your creative time and earn stars</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Activity Name</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Painting, Drawing, Crochet..."
                value={activityName}
                onChangeText={setActivityName}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Time Spent (minutes)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 60"
                keyboardType="numeric"
                value={timeSpent}
                onChangeText={setTimeSpent}
              />
              <Text style={styles.hint}>⭐ You earn 1 star for every 30 minutes</Text>
            </View>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>Confirm</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
      <BottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 25,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  hint: {
    fontSize: 12,
    color: '#999',
    marginTop: 6,
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
  },
  buttonGradient: {
    padding: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});