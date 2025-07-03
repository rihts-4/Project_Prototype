// App.js
import React, { use, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './app/screens/LoginScreen';
import MainNav from './app/screens/MainNav';
import DetailsScreen from './app/screens/DetailsScreen';
import FormScreen from './app/screens/FromScreen';
import AddFriendsScreen from './app/screens/AddFriendsScreen';
import ChatScreen from './app/screens/ChatScreen';
import SignInScreen from './app/screens/SignInScreen';

const Stack = createNativeStackNavigator();

export default function App() {

  return (
    <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignIn" component={SignInScreen} />
          <Stack.Screen name="MainTabs" component={MainNav} />
          <Stack.Screen name="Details" component={DetailsScreen} />
          <Stack.Screen name="SurveyForm" component={FormScreen} /> 
          <Stack.Screen name="AddFriends" component={AddFriendsScreen} />
          <Stack.Screen name="ChatScreen" component={ChatScreen} />
        </Stack.Navigator>

    </NavigationContainer>
  );
}
