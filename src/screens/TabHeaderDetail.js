import React from 'react';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import RequestDetail from './RequestDetail'
import RequestHistory from './RequestHistory'
export default function TabHeaderDetail({ navigation, route }) {
    const Tab = createMaterialTopTabNavigator();
    const id = route.params.id
    const myStatus = route.params.myStatus
    return (
        <Tab.Navigator>
            <Tab.Screen name="RequestDetail" children={() => <RequestDetail id={id} navigation={navigation} status={myStatus} />}
                options={{
                    tabBarLabel: 'Thông tin'
                }}
            />
            <Tab.Screen name="RequestHistory" children={() => <RequestHistory id={id} navigation={navigation} status={myStatus} />}
                options={{
                    tabBarLabel: 'lịch sử'
                }}
            />
        </Tab.Navigator>
    )
}