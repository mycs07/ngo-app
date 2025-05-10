import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../types/Navigation';  // Ensure this import is correct

// Define the type for navigation
type RequestDetailScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'RequestDetail'>;

interface Props {
  navigation: RequestDetailScreenNavigationProp;
}

export default function RequestDetailScreen({ navigation }: Props) {
  const route = useRoute();
  const { requestId } = route.params as { requestId: string };

  const [request, setRequest] = useState<any>(null);

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const requestDoc = await getDoc(doc(db, 'requests', requestId));
        if (requestDoc.exists()) {
          setRequest(requestDoc.data());
        }
      } catch (error) {
        console.error("Error fetching request:", error);
      }
    };
    fetchRequest();
  }, [requestId]);

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Back</Text> {/* You can replace this with an icon if needed */}
      </TouchableOpacity>

      {/* Logo in a circular container */}
      <Image source={require('../assets/splash-icon.png')} style={styles.logo} />

      {request ? (
        <View style={styles.detailsContainer}>
          <Text style={styles.title}>{request.title}</Text>
          <Text style={styles.text}>Description: {request.description}</Text>
          <Text style={styles.text}>Location: {request.location}</Text>
          <Text style={styles.text}>Quantity: {request.quantity}</Text>
          {/* Status with conditional styling */}
          <Text style={[styles.text, 
            request.status === 'completed' && styles.completedStatus, 
            request.status === 'ongoing' && styles.ongoingStatus]}>
            Status: {request.status}
          </Text>
        </View>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    padding: 20, 
    backgroundColor: '#C4C4C426', // Set background color as #C4C4C426
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',  // Center the content horizontally and vertically
  },
  backButton: {
    position: 'absolute', // Position it at the top
    top: 50, 
    left: 25, 
    width: 100,  // Set the width of the button (adjust as needed)
    height: 50,  // Set the height of the button (adjust as needed)
    backgroundColor: '#8FE1D7', 
    borderRadius: 25, 
    alignItems: 'center',
    justifyContent: 'center',  // Ensure the text is centered vertically
  },
  logo: {
    width: 150,  // Adjust the logo size
    height: 150, // Adjust the logo size
    borderRadius: 75,  // This makes the logo circular (half of the width/height)
    resizeMode: 'contain',  // Ensure the logo scales properly without distortion
    marginBottom: 20,  // Add some space between the logo and details
    borderWidth: 5,  // Optional: Adds a border around the logo
    borderColor: '#fff', // Optional: White border color for the logo
  },
  detailsContainer: { 
    width: '100%', 
    backgroundColor: '#fff',  // Set background color for the details container
    padding: 20,  // Add some padding around the details
    borderRadius: 10,  // Optional: rounded corners for the container
    alignItems: 'center', // Center the details container
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 20, 
    textAlign: 'center', 
    color: '#333' 
  },
  text: { 
    fontSize: 16, 
    marginVertical: 10, 
    textAlign: 'center',  // Center the text horizontally
  },
  completedStatus: {
    color: 'red',  // Red color for completed status
    fontWeight: 'bold',
  },
  ongoingStatus: {
    color: 'green',  // Green color for ongoing status
    fontWeight: 'bold',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
