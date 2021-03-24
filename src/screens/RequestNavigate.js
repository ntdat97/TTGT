import React from 'react';
import {Alert} from 'react-native'
import { createStackNavigator,TransitionSpecs, HeaderStyleInterpolators  } from '@react-navigation/stack';
import { HeaderBackButton } from '@react-navigation/stack';
import RequestDetail from './RequestDetail'
import TabHeaderDetail from './TabHeaderDetail'
import RequestShowMap from './RequestShowMap'
import Filter from './Filter'
import TabNavigateResponse from './TabNavigateResponse'
import { delSegmentState } from '../actions/report';
import { connect } from 'react-redux'
 function RequestNavigate({delSegmentState}) {
    const Stack = createStackNavigator()
    return (
        <Stack.Navigator
        initialRouteName="TabNavigateResponse"
        mode='modal'
        >
            <Stack.Screen 
            name="TabNavigateResponse"
            component={TabNavigateResponse}
            options={{headerShown: false}}
            />
             <Stack.Screen 
            name="Filter"
            component={Filter}
            options={{headerTitle: 'Lọc phản ánh',}}
            />
            <Stack.Screen 
            name="RequestShowMap"
            component={RequestShowMap}
            options={{headerShown: false}}
            />
            <Stack.Screen 
            name="TabHeaderDetail"
            component={TabHeaderDetail}
            options={({ navigation }) => {
                return {
                    headerTitle: 'Nội dung phản ánh',
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
                                                delSegmentState()
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
        </Stack.Navigator>
    )
}
const mapDispatchToProps = (dispatch) => {
    return {
        delSegmentState: () => dispatch(delSegmentState())
    }
  }
  export default connect(null, mapDispatchToProps)(RequestNavigate)