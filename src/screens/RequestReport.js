import React, { useEffect, useState } from 'react';
import {
    ToastAndroid, TouchableOpacity, Text,
    View, Alert, ActivityIndicator, TextInput,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { useIsFocused } from "@react-navigation/native";
import { SwipeListView } from 'react-native-swipe-list-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Card from './Card'
function RequestReport({ navigation, isLogged, route }) {
    const [loading, setLoading] = useState(false)
    const [reload, setReload] = useState(false)
    const [reportData, setReportData] = useState([])
    const searchText = async (e) => {
        const fire = firestore()
            .collection('Report').where('isApproved', '==', false)
        const search1 = String(e + '\uf8ff')
        fire.orderBy('title').startAt(e).endAt(search1).get()
            .then((querySnapShot) => {
                const users1 = []
                querySnapShot.forEach((doc) => {
                    var data = doc.data()
                    var send = { submitTime: data.submitTime, check: data.check, title: data.title, status: data.status }
                    users1.push({
                        data: send,
                        key: doc.id
                    })
                });
                setLoading(true)
                setReportData(users1)
            })
    }
    const sub = async () => {
        var filteredData = []
        if (!route?.params?.nonClassify) {
            if (route?.params?.filteredData && route.params.nonClassify == false) {
                filteredData = route.params.filteredData
                return setReportData(filteredData)
            }
        }
        const fire = await firestore()
            .collection('Report').where('isApproved', '==', false).get()
            .then((querySnapShot) => {
                const users1 = []
                querySnapShot.forEach((doc) => {
                    var data = doc.data()
                    var send = { submitTime: data.submitTime, check: data.check, title: data.title, status: data.status }
                    users1.push({
                        data: send,
                        key: doc.id
                    })
                });
                setLoading(true)
                setReportData(users1)
            })
    }
    const isFocused = useIsFocused();
    useEffect(() => {
        sub()
    }, [isFocused, reload])
    const render = ({ item }) => {
        return (
            <Card item={item.data} onPress={() => navigation.navigate("TabHeaderDetail", { id: item.key, myStatus: item.data.status })} />
        )
    }
    const renderHidden = ({ item }) => {
        const confirmDel = () => {
            {
                Alert.alert(
                    "B???n c?? mu???n x??a",
                    "",
                    [
                        {
                            text: "?????ng ??",
                            onPress: () => {
                                del()
                            }
                        },
                        {
                            text: "H???y b???",
                            onPress: () => {
                            }
                        }
                    ]
                )
                return true
            }
        }
        const del = async () => {
            var responseKey = ''
            await firestore()
                .collection('ReportResponse').where('idReport', '==', item.key).get()
                .then((querySnapShot) => {
                    querySnapShot.forEach((doc) => {
                        responseKey = doc.id
                    });
                })
            var batch = firestore().batch()
            var docDelReportDetail = firestore().collection('ReportDetail').doc(item.key)
            var docDelReport = firestore().collection('Report').doc(item.key)
            var docDelResponse = firestore().collection('ReportResponse').doc(responseKey)
            batch.delete(docDelReportDetail)
            batch.delete(docDelReport)
            batch.delete(docDelResponse)
            batch.commit().then(async () => {
                await AsyncStorage.removeItem('myReport' + item.key)
                setReload(!reload)
                ToastAndroid.showWithGravityAndOffset(
                    "???? x??a ph???n ??nh",
                    ToastAndroid.LONG,
                    ToastAndroid.BOTTOM,
                    25,
                    50
                );
            })
        }
        return (
            <View style={{
                alignItems: 'center',
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'flex-end',
                marginRight: 10
            }}>
                <TouchableOpacity
                    style={{
                        padding: 30,
                        backgroundColor: 'red'
                    }}
                    onPress={confirmDel}
                >
                    <Text style={{ fontSize: 17, color: 'white' }}>X??a</Text>
                </TouchableOpacity>
            </View>
        )
    }
    return (
        <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', height: 50, justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'lightblue' }}>
                <View style={{ flex: 3 }}>
                    <TouchableOpacity
                        style={{ justifyContent: 'center', alignItems: 'center' }}
                        onPress={() => navigation.goBack()}

                    >
                        <Icon name='keyboard-backspace' size={28} />
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 17, flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', margin: 5, paddingLeft: 10 }}>
                    <Icon name='magnify' size={24} style={{ flex: 1 }} />
                    <TextInput
                        style={{ fontSize: 16, flex: 9 }}
                        onChangeText={(e) => searchText(e)}
                    />
                </View>
                <View style={{ flex: 3 }}>
                    <TouchableOpacity
                        style={{ justifyContent: 'center', alignItems: 'center' }}
                        onPress={() => navigation.navigate("Filter", { isApproved: false })}

                    >
                        <Icon name='sort' size={28} />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{ flex: 8.6 }}>
                {loading ?
                    <SwipeListView
                        data={reportData}
                        renderItem={render}
                        rightOpenValue={-100}
                        renderHiddenItem={renderHidden}
                    /> : <View style={{
                        flex: 1,
                        justifyContent: "center",
                        flexDirection: "row",
                        justifyContent: "space-around",
                        padding: 10
                    }}>
                        <ActivityIndicator size="large" color="#0000ff" />
                    </View>}
            </View>
        </View>
    )
}
export default RequestReport