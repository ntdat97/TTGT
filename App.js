
import React from 'react';
import { LogBox, StyleSheet, Text, View } from 'react-native';
import {TouchableHighlight, TouchableOpacity } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './src/screens/Home'
import { Component } from 'react';
import {Provider} from 'react-redux'
import configureStore from './src/store'
const store = configureStore()
const Stack = createStackNavigator();
export default function App() {
  
  return (
    <Provider store={store}>
    <NavigationContainer>
        <Home/>
    </NavigationContainer>
    </Provider>
  );
}

