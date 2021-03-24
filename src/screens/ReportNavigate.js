import React from 'react';
import { StyleSheet, Alert } from 'react-native';
import { createStackNavigator, TransitionSpecs, HeaderStyleInterpolators, CardStyleInterpolators } from '@react-navigation/stack';
import { HeaderBackButton } from '@react-navigation/stack';
import { connect } from 'react-redux'
import Report from './Report'
import Report2 from './Report2'
import Report3 from './Report3'
import Report3Home from './Report3Home'
import Report4 from './Report4'
import TabReport from './TabReport'
import FilterForUser from './FilterForUser'
import TabHeaderReport from './TabHeaderReport'
import { del_state } from '../actions/report';

function ReportNavigate({ del_state }) {
    const TransitionNext = {
        gestureDirection: 'horizontal',
        transitionSpecs: {
            open: TransitionSpecs.TransitionIOSSpec,
            close: TransitionSpecs.TransitionIOSSpec
        },
        headerStyleInterpolator: HeaderStyleInterpolators.forSlideRight,
        cardStyleInterpolator: ({ current, previous, next, layouts }) => {
            return {
                cardStyle: {
                    transform: [
                        {
                            translateX: current.progress.interpolate({
                                inputRange: [0, 1],
                                outputRange: [layouts.screen.width, 0],
                            }),
                        },

                        {
                            translateX: next
                                ? next.progress.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [1, 0.1],
                                })
                                : 1,
                        },
                    ],
                },
                overlayStyle: {
                    opacity: current.progress.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 1],
                    }),
                },
            };
        }
    }
    const Stack = createStackNavigator()
    return (
        <Stack.Navigator
            headerMode='screen'
            initialRouteName="TabReport"
            screenOptions={{
                gestureEnabled: true,
                gestureDirection: "horizontal",
                CardStyleInterpolator:
                    CardStyleInterpolators.forHorizontalIOS
            }}
        >
            <Stack.Screen
                name="Report"
                component={Report}
                options={({ navigation }) => {
                    return {
                        headerTitle: 'Hình ảnh',
                        headerLeft: () => (
                            <HeaderBackButton
                                onPress={() => {
                                    Alert.alert(
                                        "Bạn có muốn trở lại",
                                        "",
                                        [
                                            {
                                                text: "Đồng ý",
                                                onPress: () => {
                                                    del_state()
                                                    navigation.goBack()
                                                }
                                            },
                                            {

                                                text: "Hủy bỏ",
                                                onPress: () => {

                                                }
                                            }
                                        ]
                                    )


                                }}
                            />
                        ),

                    }
                }}
            />
            <Stack.Screen name="Report2"
                component={Report2}
                options={{ swipeEnabled: false, headerTitle: 'Phân loại' }}
            />
            <Stack.Screen name="Report3"
                component={Report3}
                options={{ headerShown: false }}

            />
            <Stack.Screen
                name="FilterForUser"
                component={FilterForUser}
                options={{ headerTitle: 'Lọc phản ánh', }}
            />
            <Stack.Screen name="Report3Home"
                component={Report3Home}
                options={{ swipeEnabled: false, headerTitle: 'Chi tiết' }}
            />
            <Stack.Screen name="Report4"
                component={Report4}
                options={{ swipeEnabled: false, headerTitle: 'Thông tin người đăng' }}
            />
            <Stack.Screen name="TabReport"
                component={TabReport}
                options={{ swipeEnabled: false, headerShown: false }}
            />
            <Stack.Screen name="TabHeaderReport"
                component={TabHeaderReport}
                options={{ swipeEnabled: false, headerTitle: 'Nội dung phản ánh' }}
            />
        </Stack.Navigator>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    content: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderColor: 'grey',
        borderWidth: 0.5,
        padding: 20,
    },
    backroudPic: {
        width: 100 + "%",
        height: 35 + "%",
    }
});

const mapDispatchToProps = (dispatch) => {
    return {
        del_state: () => dispatch(del_state())
    }
}
export default connect(null, mapDispatchToProps)(ReportNavigate)