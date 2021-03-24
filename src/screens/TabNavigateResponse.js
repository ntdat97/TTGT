import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import RequestReport from './RequestReport'
import RequestedReport from './RequestedReport'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
const Tab = createBottomTabNavigator();
export default function TabNavigateResponse() {
  return (
    <Tab.Navigator
      backBehavior='none'
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          let iconName;
          let color

          if (route.name === 'RequestReport') {
            iconName = 'progress-check',
              color = focused ? 'blue' : 'black';
          } else if (route.name === 'RequestedReport') {
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
      <Tab.Screen name="RequestReport" component={RequestReport}
        options={{
          tabBarLabel: 'Đang chờ duyệt',
          tabBarOptions: {
            style: { backgroundcolor: 'red' }
          }
        }} />
      <Tab.Screen name="RequestedReport" component={RequestedReport}
        options={{
          tabBarLabel: 'Đã duyệt'
        }}
      />

    </Tab.Navigator>
  );
}