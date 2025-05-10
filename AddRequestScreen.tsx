// screens/AddRequestScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { addDoc, collection, deleteDoc, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';
import type { AuthStackParamList } from '../types/Navigation'; // Correct import for types

// Define route type from AuthStackParamList
export default function AddRequestScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<AuthStackParamList, 'AddRequest'>>(); // Specify the route type here

  const { requestId } = route.params || {}; // Safely access requestId, defaulting to empty object if not provided

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('');
  const [location, setLocation] = useState('');
  const [timeNeeded, setTimeNeeded] = useState('');

  // Handle form submission
  const handleSubmit = async () => {
    if (!title || !description || !quantity || !location || !timeNeeded) {
      Alert.alert('Error', 'Please fill out all fields.');
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not logged in');

      // Get user profile (for photoURL)
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.exists() ? userDoc.data() : {};
      const photoURL = userData?.photoURL || null;

      // Add the new donation request to Firestore
      await addDoc(collection(db, 'requests'), {
        title,
        description,
        quantity,
        location,
        timeNeeded,
        createdAt: new Date().toISOString(),
        ngoId: user.uid,
        photoURL, // include photoURL of the user
        status: 'active',
      });

      Alert.alert('Success', 'Request submitted!');
      navigation.goBack();
    } catch (error: any) {
      console.error('Add request error:', error.message);
      Alert.alert('Error', error.message);
    }
  };

  // Handle delete request
  const handleDelete = async () => {
    if (!requestId) {
      Alert.alert('Error', 'No request ID provided.');
      return;
    }

    try {
      await deleteDoc(doc(db, 'requests', requestId));
      Alert.alert('Deleted', 'Request has been deleted.');
      navigation.goBack();
    } catch (error: any) {
      console.error('Delete error:', error.message);
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>New Donation Request</Text>

      <TextInput style={styles.input} placeholder="Request Title" value={title} onChangeText={setTitle} />
      <TextInput style={styles.input} placeholder="Description" value={description} onChangeText={setDescription} multiline />
      <TextInput style={styles.input} placeholder="Quantity (e.g. 50 meals)" value={quantity} onChangeText={setQuantity} />
      <TextInput style={styles.input} placeholder="Location" value={location} onChangeText={setLocation} />
      <TextInput style={styles.input} placeholder="Time Needed" value={timeNeeded} onChangeText={setTimeNeeded} />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit Request</Text>
      </TouchableOpacity>

      {/* Only show delete button if requestId is present */}
      {requestId && (
        <TouchableOpacity style={[styles.button, { backgroundColor: '#FF6B6B' }]} onPress={handleDelete}>
          <Text style={styles.buttonText}>Delete Request</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4f8', padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 30, textAlign: 'center', color: '#000' },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    marginBottom: 15,
    paddingHorizontal: 20,
    borderRadius: 25,
    fontSize: 16,
    elevation: 2,
  },
  button: {
    height: 50,
    backgroundColor: '#8FE1D7',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
