import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { collection, getDocs, query, where, updateDoc, doc } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../types/Navigation';
import { signOut } from 'firebase/auth'; // Import the signOut function

interface Request {
  id: string;
  title: string;
  description: string;
  quantity: string;
  location: string;
  timeNeeded: string;
  status: string;
  volunteerId?: string | null;
}

export default function VolunteerScreen() {
  const [requests, setRequests] = useState<Request[]>([]);
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const q = query(
        collection(db, 'requests'),
        where('status', 'in', ['active', 'ongoing', 'completed']) // Fetch active, ongoing, and completed requests
      );
      const snapshot = await getDocs(q);
      const data: Request[] = snapshot.docs.map(doc => ({
        id: doc.id,
        title: doc.data().title,
        description: doc.data().description,
        quantity: doc.data().quantity,
        location: doc.data().location,
        timeNeeded: doc.data().timeNeeded,
        status: doc.data().status || 'active',
        volunteerId: doc.data().volunteerId || null,
      }));
      setRequests(data);
    } catch (error) {
      console.error('Fetch error:', (error as Error).message);
    }
  };

  const handleAcceptRequest = async (requestId: string) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Not logged in');

      const requestRef = doc(db, 'requests', requestId);

      // Update both volunteerId and status when the volunteer accepts the request
      await updateDoc(requestRef, {
        volunteerId: user.uid, // Assign the current user as the volunteer
        status: 'ongoing', // Mark the status as 'ongoing' after it's accepted
      });

      Alert.alert('Success', 'You have accepted this request');
      fetchRequests(); // Refresh the list of requests after accepting one
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const handleExitRequest = async (requestId: string) => {
    try {
      const requestRef = doc(db, 'requests', requestId);

      // Remove the volunteerId and mark the status as 'completed' if the volunteer exits the completed request
      await updateDoc(requestRef, {
        volunteerId: null,  // Remove the volunteerId (exit the request)
        status: 'completed', // Mark it as completed or inactive, depending on your requirements
      });

      Alert.alert('Success', 'You have exited this request.');
      fetchRequests(); // Refresh the list of requests after exiting
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth); // Firebase logout function
      navigation.navigate('Login'); // Navigate back to Login screen
    } catch (error: any) {
      Alert.alert('Error', error.message); // Show error if logout fails
    }
  };

  const renderItem = ({ item }: { item: Request }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('RequestDetail', { requestId: item.id })} // Navigate to Request Detail screen
    >
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardText}>Location: {item.location}</Text>
      <Text style={styles.cardText}>Need before: {item.timeNeeded}</Text>
      <Text style={styles.statusText}>
        {item.status === 'active' ? 'Pending' : item.status === 'ongoing' ? 'Ongoing' : 'Completed'}
      </Text>

      {/* Only show the "Accept Request" button in the Volunteer Dashboard (not in the Request Detail screen) */}
      {item.status === 'active' && (
        <TouchableOpacity style={styles.acceptButton} onPress={() => handleAcceptRequest(item.id)}>
          <Text style={styles.buttonText}>Accept Request</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Volunteer Dashboard</Text>

      <FlatList
        data={requests}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4f8', padding: 15 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#333' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    elevation: 3,
  },
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  cardText: { fontSize: 14, marginBottom: 5 },
  statusText: { fontWeight: 'bold', fontSize: 14, color: 'green' },
  acceptButton: {
    backgroundColor: '#8FE1D7',
    padding: 10,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  logoutButton: {
    backgroundColor: '#FF6347',
    padding: 10,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
  },
});
