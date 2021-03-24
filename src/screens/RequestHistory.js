import React, { useEffect, useState } from 'react'
import { View, Text, ActivityIndicator, FlatList } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import firestore from '@react-native-firebase/firestore';
export default function RequestHistory({ id }) {
    const [status, setStatus] = useState([])
    const [loading, setLoading] = useState(false)
    const sub = async () => {
        firestore()
            .collection('ReportResponse').where("idReport", "==", id)
            .get()
            .then(function (querySnapshot) {
                const array = []
                querySnapshot.forEach(async (doc) => {
                    await firestore()
                        .collection('ReportResponse').doc(doc.id).collection('status').get().then(documentT => {
                            documentT.forEach((doc1) => {
                                array.push(doc1.data())
                            })
                        }).then(() => {
                            setLoading(true)
                            setStatus(array)
                        })
                });
            })
    }
    useEffect(() => {
        sub()
    }, [])
    const renderItem = ({ item, index }) => {
        var t = new Date(item.addedTime)
        var formatted = 'Lúc ' + t.getHours() + ':' + t.getMinutes() + ' ngày ' + ('0' + t.getDate()).slice(-2)
            + '/' + ('0' + (t.getMonth() + 1)).slice(-2)
            + '/' + (t.getFullYear())
        return (
            <View style={{ flexDirection: 'row' }}>
                <View style={{ flex: 1.5, alignItems: 'center' }}>
                    <Icon name='circle-slice-8' size={35} color='blue' style={{}} />
                    <View style={{ backgroundColor: '#b8b1b0', height: 40, width: 3 }} />
                </View>
                <View style={{ flex: 8.5, alignContent: 'center' }}>
                    <Text style={{ fontSize: 17, paddingVertical: 3, fontWeight: '700' }}>{item.status}</Text>
                    <Text style={{ fontSize: 14, paddingVertical: 3 }}>{formatted}</Text>
                    <Text>{item.responseContent}</Text>
                </View>
            </View>)
    }
    return (
        <View >
            {loading ?
                <FlatList
                    data={status}
                    renderItem={renderItem}
                    keyExtractor={item => String(item.selectedIndex)}
                /> : <View style={{
                    flex: 1,
                    justifyContent: "center",
                    flexDirection: "row",
                    justifyContent: "space-around",
                    padding: 10,
                    paddingTop: 30
                }}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>}
        </View>
    )
}