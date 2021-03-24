import React from 'react';
import { StyleSheet, Text, View, Button, Alert, LogBox } from 'react-native';
import { TouchableHighlight, TouchableOpacity } from 'react-native-gesture-handler';
import { createStackNavigator } from '@react-navigation/stack';
import Report from './Report'
import Navigate from './Navigate'
import ReportNavigate from './ReportNavigate'
import { HeaderBackButton } from '@react-navigation/stack';
import { del_state } from '../actions/report';
import { connect } from 'react-redux'
import Login from './Login'
import RequestNavigate from './RequestNavigate'
import Map from './Map'
import AddUtility from './AddUtility'
import About from './About'
function Home() {
    const Stack = createStackNavigator()

    return (
        <Stack.Navigator
            initialRouteName="Navigate"
            mode="modal"
            headerMode='none'
        >
            <Stack.Screen
                name="ReportNavigate"
                component={ReportNavigate}

            />
            <Stack.Screen name="Navigate" component={Navigate}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen name="AddUtility" component={AddUtility}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen name="About" component={About}

            />
            <Stack.Screen name="Map" component={Map}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen name="Login" component={Login}
                options={{
                    headerTitle: 'Đăng nhập',
                }}
            />
            <Stack.Screen name="RequestNavigate" component={RequestNavigate}
                options={{
                    headerShown: false,
                }}
            />

        </Stack.Navigator>
    )
}

const styles = StyleSheet.create({

});

const mapDispatchToProps = (dispatch) => {
    return {
        del_state: () => dispatch(del_state())
    }
}
export default connect(null, mapDispatchToProps)(Home)
/*

*/