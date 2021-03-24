import React, { useEffect, useState } from 'react';
import {
    TouchableOpacity, View, TextInput,Text,
    FlatList, RefreshControl, SafeAreaView
} from 'react-native';
import NextArrowButton from '../component/NextArrowButton'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Card from './Card'
import { useIsFocused } from "@react-navigation/native";
import { LoadingScreen } from './LoadingScreen'
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
const wait = (timeout) => {
    return new Promise(resolve => {
        setTimeout(resolve, timeout);
    });
}
export default function ListMyReport({ navigation }) {
    const [myReport, setMyReport] = useState([])
    const [loading, setLoading] = useState(false)
    const [refreshing, setRefreshing] = useState(false)
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        wait(2000).then(() => setRefreshing(false));
    }, []);
    const searchText = async (e) => {
        let keys = []
        keys = await AsyncStorage.getAllKeys()
        var myRe = []
        keys.forEach((item, i) => {
            if (item.startsWith('myReport')) {
                myRe.push(item.substr(8, 30))
            }
        })
        const fire = firestore()
            .collection('Report').where('id', 'in', myRe)
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
                setMyReport(users1)
            })
    }
    const getItem = async () => {
        let keys = []
        var myRe = []
        var myRe2 = []
        const myReport = []
        keys = await AsyncStorage.getAllKeys()
        keys.forEach((item, i) => {
            myRe.length > 9 ?
                item.startsWith('myReport') && myRe2.push(item.substr(8, 30)) :
                item.startsWith('myReport') && myRe.push(item.substr(8, 30))
        })
        myRe.length === 0 && setLoading(true)
        myRe2 > 0 &&
            firestore().collection("Report")
                .where('id', 'in', myRe2)
                .get()
                .then((doc) => {
                    doc.forEach((query) => {
                        var data = query.data()
                        var send = { submitTime: data.submitTime, check: data.check, title: data.title, status: data.status }
                        myReport.push({
                            data: send,
                            key: query.id
                        })
                        setMyReport(myReport)
                        setLoading(true)
                    })
                })
        myRe.length > 0 &&
            firestore().collection("Report")
                .where('id', 'in', myRe)
                .get()
                .then((doc) => {
                    doc.forEach((query) => {
                        var data = query.data()
                        var send = { submitTime: data.submitTime, check: data.check, title: data.title, status: data.status }
                        myReport.push({
                            data: send,
                            key: query.id
                        })

                        setMyReport(myReport)
                        setLoading(true)
                    })
                })
    }
    const isFocused = useIsFocused();
    const render = ({ item }) => {
        return (
            <Card item={item.data} onPress={() => navigation.navigate("TabHeaderReport", { id: item.key, myStatus: item.data.status })} />
        )
    }
    useEffect(() => {
        getItem()
    }, [isFocused])

    if (!loading) {
        return <LoadingScreen />
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
                        onPress={() => navigation.navigate("FilterForUser", { isApproved: true })}
                    >
                        <Icon name='sort' size={28} />
                    </TouchableOpacity>
                </View>
            </View>
            {myReport.length ==0 && <View style={{justifyContent:'center', alignItems:'center'}}>
                <Text style={{fontSize:24}}>Bạn chưa thêm phản ánh nào</Text>
                </View>}
            <SafeAreaView style={{ flex: 8.6 }}>
                <FlatList
                    data={myReport}
                    renderItem={render}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                />
            </SafeAreaView>
            <View style={{ bottom: 10, position: 'absolute', paddingHorizontal: 10, right: 0 }}>
                <NextArrowButton
                    iconName='plus'
                    custom={{ backgroundColor: 'lightblue', width: 60, height: 60, justifyContent: 'center', alignItems: 'center', borderRadius: 40 }}
                    onPress={() => navigation.navigate('Report')}
                />
            </View>
        </View>
    )
}