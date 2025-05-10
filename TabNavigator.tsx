import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TabParamList } from '../types/Navigation';

// Importing all screens
import DonorScreen from '../screens/DonorScreen'; 
import NGOScreen from '../screens/NGOScreen'; 
import VolunteerScreen from '../screens/VolunteerScreen'; 
import AddRequestScreen from '../screens/AddRequestScreen'; 

const Tab = createBottomTabNavigator<TabParamList>();

const TabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Donor" component={DonorScreen} />
      <Tab.Screen name="NGO" component={NGOScreen} />
      <Tab.Screen name="Volunteer" component={VolunteerScreen} />
      <Tab.Screen name="AddRequest" component={AddRequestScreen} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
