import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../types/Navigation';
import { doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';

type Props = NativeStackScreenProps<AuthStackParamList, 'EditRequest'>;

export default function EditRequestScreen({ navigation, route }: Props) {
  const requestId = route.params?.requestId;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('');
  const [location, setLocation] = useState('');
  const [timeNeeded, setTimeNeeded] = useState('');
  const [ngoId, setNgoId] = useState<string | null>(null);
  const [status, setStatus] = useState<'active' | 'completed'>('active');

  useEffect(() => {
    if (!requestId) {
      Alert.alert('Error', 'Request ID is missing');
      navigation.goBack();
    }

    const loadRequest = async () => {
      const docRef = doc(db, 'requests', requestId!);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setTitle(data.title);
        setDescription(data.description);
        setQuantity(data.quantity);
        setLocation(data.location || '');
        setTimeNeeded(data.timeNeeded || '');
        setNgoId(data.ngoId);
        setStatus(data.status || 'active');
      } else {
        Alert.alert('Error', 'Request not found');
        navigation.goBack();
      }
    };

    loadRequest();
  }, [requestId, navigation]);

  const handleUpdate = async () => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not logged in');
      if (ngoId !== user.uid) {
        Alert.alert('Error', 'Insufficient permission to update this request.');
        return;
      }

      await updateDoc(doc(db, 'requests', requestId!), {
        title,
        description,
        quantity,
        location,
        timeNeeded,
        status,
      });

      Alert.alert('Success', 'Request updated');
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const handleDelete = async () => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Error', 'User not logged in');
      return;
    }

    // Show the alert but don't block the button click
    if (ngoId !== user.uid) {
      Alert.alert('Permission Denied', "You can't delete someone else's post");
      return;
    }

    // Only allow deletion if the request is active
    if (status !== 'active') {
      Alert.alert('Error', 'Completed or inactive requests cannot be deleted.');
      return;
    }

    // Proceed with the deletion
    Alert.alert('Confirm', 'Are you sure you want to delete this request?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteDoc(doc(db, 'requests', requestId!));
            Alert.alert('Deleted', 'Request deleted');
            navigation.goBack();
          } catch (error: any) {
            Alert.alert('Error', error.message);
          }
        },
      },
    ]);
  };

  const toggleStatus = () => {
    setStatus(prev => (prev === 'active' ? 'completed' : 'active'));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Request</Text>

      <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Title" />
      <TextInput style={styles.input} value={description} onChangeText={setDescription} placeholder="Description" />
      <TextInput style={styles.input} value={quantity} onChangeText={setQuantity} placeholder="Quantity" />
      <TextInput
        style={styles.input}
        value={location}
        onChangeText={setLocation}
        placeholder="Location"
      />
      <TextInput
        style={styles.input}
        value={timeNeeded}
        onChangeText={setTimeNeeded}
        placeholder="Time Needed"
      />

      <Text style={styles.statusText}>
        Status:{' '}
        <Text style={{ color: status === 'active' ? 'green' : 'red' }}>
          {status.toUpperCase()} {/* Display the status in red if it's "completed" */}
        </Text>
      </Text>

      <TouchableOpacity style={styles.toggleButton} onPress={toggleStatus}>
        <Text style={styles.toggleButtonText}>Toggle Status</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Save Changes</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.deleteButtonText}>Delete Request</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f0f4f8', justifyContent: 'center' },
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
  statusText: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: '500',
  },
  toggleButton: {
    height: 40,
    backgroundColor: '#ddd',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  toggleButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  button: {
    height: 50,
    backgroundColor: '#8FE1D7',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  deleteButton: {
    height: 50,
    backgroundColor: '#ff5c5c',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
