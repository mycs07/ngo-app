// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { UserProvider } from './context/UserContext'; // Ensure this is correctly implemented
import AuthStack from './navigation/AuthStack';  // Authentication stack
import TabNavigator from './navigation/TabNavigator';  // Import TabNavigator

export default function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        {/* Check if user is logged in, if so, show TabNavigator */}
        <AuthStack /> {/* If you want TabNavigator as part of the stack, consider replacing this with conditional navigation */}
      </NavigationContainer>
    </UserProvider>
  );
}
