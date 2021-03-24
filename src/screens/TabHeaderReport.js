import React from 'react';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import DetailReport from './DetailReport'
import ReportHistory from './ReportHistory'
export default function TabHeaderDetail({ navigation, route }) {
    const Tab = createMaterialTopTabNavigator();
    const id = route.params.id
    const myStatus = route.params.myStatus
    return (
        <Tab.Navigator>
            <Tab.Screen name="DetailReport" children={() => <DetailReport id={id} status={myStatus} navigation={navigation} />}
                options={{
                    tabBarLabel: 'Thông tin'
                }}
            />
            <Tab.Screen name="ReportHistory" children={() => <ReportHistory id={id} navigation={navigation} />}
                options={{
                    tabBarLabel: 'lịch sử'
                }}
            />

        </Tab.Navigator>
    )
}