import React, { useEffect, useState } from 'react';
import {
    StyleSheet, Text, View,
    TextInput, Dimensions,
    RefreshControl, SafeAreaView, FlatList, TouchableOpacity
} from 'react-native';
import { del_state } from '../actions/report';
import { connect } from 'react-redux'
import NextArrowButton from '../component/NextArrowButton'
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Card from './Card'
import { useIsFocused } from "@react-navigation/native";
import { LoadingScreen } from './LoadingScreen'
const { height, width } = Dimensions.get('window');
const wait = (timeout) => {
    return new Promise(resolve => {
        setTimeout(resolve, timeout);
    });
}
function ListReport({ navigation, route }) {
    const [loading, setLoading] = useState(false)
    const [refreshing, setRefreshing] = useState(false)
    const [reportData, setReportData] = useState([])
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        wait(2000).then(() => setRefreshing(false));
    }, []);
    const searchText = async (e) => {
        const fire = firestore()
            .collection('Report').where('isApproved', '==', true)
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
            .collection('Report').where('isApproved', '==', true)
            .get()
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
                setReportData(users1)
                setLoading(true)
            })
    }
    const isFocused = useIsFocused();
    useEffect(() => {
        sub()
    }, [isFocused])
    const render = ({ item }) => {
        return (
            <Card item={item.data} onPress={() => navigation.navigate("TabHeaderReport", { id: item.key, myStatus: item.data.status })} />
        )
    }
    if (!loading) {
        return <LoadingScreen />
    }
    return (
        <View style={{ flex: 1 }}
        >
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
            <SafeAreaView style={{ flex: 8.6 }}>
                <FlatList
                    data={reportData}
                    renderItem={render}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                />
            </SafeAreaView >
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

const mapDispatchToProps = (dispatch) => {
    return {
        del_state: () => dispatch(del_state())
    }
}
export default connect(null, mapDispatchToProps)(ListReport)
/*

*/