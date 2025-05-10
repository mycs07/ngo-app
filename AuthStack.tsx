import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../types/Navigation';

// Importing all screens
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import HomeScreen from '../screens/HomeScreen'; 
import HomeNGOScreen from '../screens/NGOScreen'; 
import HomeVolunteerScreen from '../screens/VolunteerScreen'; 
import SplashScreen from '../screens/SplashScreen'; 
import EditRequestScreen from '../screens/EditRequestScreen'; 
import EditProfileScreen from '../screens/EditProfileScreen'; 
import AddRequestScreen from '../screens/AddRequestScreen'; 
import RequestDetailScreen from '../screens/RequestDetailScreen'; 

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="HomeNGO" component={HomeNGOScreen} />
      <Stack.Screen name="Dashboard" component={HomeNGOScreen} />
      <Stack.Screen name="AddRequest" component={AddRequestScreen} />
      <Stack.Screen name="HomeVolunteer" component={HomeVolunteerScreen} />
      <Stack.Screen name="EditRequest" component={EditRequestScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="RequestDetail" component={RequestDetailScreen} />
    </Stack.Navigator>
  );
};

export default AuthStack;
