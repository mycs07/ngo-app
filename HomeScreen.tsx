import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const donationRequests = [
  {
    id: '1',
    title: 'Youth red Cross VEC',
    message: 'We are in need of 15 food packets in manila',
    location: 'Location before 1:30 PM',
    timestamp: '5 hours ago',
    //image: require('../assets/cross.png'), // Replace with your image
  },
  {
    id: '2',
    title: 'F.E.A.S.T',
    message: 'We are in need of 15 food packets in antipolo',
    location: 'Location before 1:30 PM',
    timestamp: '5 hours ago',
   // image: require('../assets/feast.png'),
  },
  {
    id: '3',
    title: 'LOS SANTOS FOODBANK',
    message: 'We are in need of 15 food packets in sta lucia',
    location: 'Location before 1:30 PM',
    timestamp: '5 hours ago',
    //image: require('../assets/lossantos.png'),
  },
];

export default function HomeScreen() {
  const navigation = useNavigation();

  const renderCard = ({ item }: any) => (
    <View style={styles.card}>
      <Image source={item.image} style={styles.image} />
      <View style={{ flex: 1 }}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardText}>{item.message}</Text>
        <Text style={styles.cardText}>{item.location}</Text>
        <Text style={styles.cardTimestamp}>{item.timestamp}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.profileIcon}>👤</Text>
      </View>

      <Text style={styles.welcomeText}>Welcome Back</Text>
      <Text style={styles.nameText}>Zacky Gipulan</Text>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Make a Donation</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Your Donations</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Donation Requests</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Donations Requests</Text>

      <FlatList
        data={donationRequests}
        keyExtractor={(item) => item.id}
        renderItem={renderCard}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f5f4', padding: 20 },
  header: { alignItems: 'flex-start' },
  profileIcon: { fontSize: 26 },
  welcomeText: { fontSize: 20, fontWeight: 'bold', marginTop: 10 },
  nameText: { fontSize: 18, marginBottom: 20 },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    elevation: 3,
  },
  buttonText: { fontSize: 16, fontWeight: 'bold' },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  cardTitle: { fontWeight: 'bold', fontSize: 16 },
  cardText: { fontSize: 14, color: '#333' },
  cardTimestamp: { fontSize: 12, color: '#888', marginTop: 4 },
});