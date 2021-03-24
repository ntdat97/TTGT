import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ListReport from './ListReport'
import ListMyReport from './ListMyReport'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
const Tab = createBottomTabNavigator();

export default function TabReport() {
  return (
    <Tab.Navigator
      backBehavior='none'
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          let iconName;
          let color

          if (route.name === 'ListReport') {
            iconName = 'progress-check',
              color = focused ? 'blue' : 'black';
          } else if (route.name === 'ListMyReport') {
            iconName = 'checkbox-marked-circle-outline',
              color = focused ? 'blue' : 'black';
          }
          // You can return any component that you like here!
          return <Icon name={iconName} size={24} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: 'blue',
        inactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen name="ListMyReport" component={ListMyReport}
        options={{
          tabBarLabel: 'Cá nhân',
          tabBarOptions: {
            style: { backgroundcolor: 'red' }
          }
        }} />
      <Tab.Screen name="ListReport" component={ListReport}
        options={{
          tabBarLabel: 'Tất cả'
        }}
      />
    </Tab.Navigator>
  );
}