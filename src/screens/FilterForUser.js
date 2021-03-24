import React, { useEffect, useState } from 'react'
import { FlatList, TouchableHighlight, TouchableOpacity, View, Text, ScrollView, ActivityIndicator, Alert, Dimensions } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import firestore from '@react-native-firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';
import { CheckBox } from 'react-native-elements'
import { setFilter } from '../actions/report';
import { connect } from 'react-redux'
const { height, width } = Dimensions.get('window');
const checkboxesState = [
    { id: 1, title: 'Hệ thống đã nhận' },
    { id: 2, title: 'Đã duyệt' },
    { id: 3, title: 'Đang xử lý' },
    { id: 4, title: 'Đã nhận kết quả xử lý' },
    { id: 5, title: 'Đã đóng' },
]
const checkboxesClassification = [
    { id: 1, title: 'Khác', iconName: 'dots-horizontal', iconColor: '#bdbdbd' },
    { id: 2, title: 'Cầu', iconName: 'bridge', iconColor: '#2436ff' },
    { id: 3, title: 'Đường bộ', iconName: 'road-variant', iconColor: 'red' },
    { id: 4, title: 'Chiếu sáng', iconName: 'lightbulb-outline', iconColor: 'yellow' },
    { id: 5, title: 'Cây xanh', iconName: 'tree', iconColor: 'green' },
    { id: 6, title: 'Thoát nước', iconName: 'pipe-leak', iconColor: '#917a70' },
    { id: 7, title: 'Đường thủy', iconName: 'anchor', iconColor: '#0c0a8a' },
]
function FilterForUser({ navigation, setFilter, thisState, route }) {
    const [array, setArray] = useState([])

    const [checked, setChecked] = useState({ 1: false, 2: false, 3: false, 4: false, 5: false })
    const [checkedClass, setCheckedClass] = useState({ 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false })
    const pendingRequest = route.params.isApproved
    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity
                    onPress={() => confirm()}
                    style={{ padding: 15 }}
                >
                    <Text style={{ fontSize: 17, color: "#3bb2ed" }}>Xong</Text>
                </TouchableOpacity>
            ),
        });
    }, [navigation, array, checked, checkedClass]);
    useEffect(() => {
        if (thisState.filter.length > 0) {
            setChecked(thisState.filter[0])
            setCheckedClass(thisState.filter[1])
        }

    }, [])
    const confirm = () => {
        const checkStateArray = []
        const checkClassArray = []

        for (const i in checked) {
            checked[i] && checkStateArray.push(Number(i))
        }

        for (const j in checkedClass) {
            checkedClass[j] && checkClassArray.push(Number(j))
        }
        setFilter([checked, checkedClass])
        if (checkStateArray.length === 0 && checkClassArray.length > 0) {

            return firestore()
                .collection('Report').where('check', 'in', checkClassArray)
                .where('isApproved', '==', pendingRequest ? true : pendingRequest)
                .get()
                .then((querySnapShot) => {
                    const users1 = []
                    querySnapShot.forEach((doc) => {
                        //firestore().collection('Report').doc(doc.id).where('statusNumber', 'in', [state])
                        users1.push({
                            data: doc.data(),
                            key: doc.id
                        })
                    });
                    const report = [...new Map(users1.map(o => [JSON.stringify(o), o])).values()]
                    setArray(report)
                    pendingRequest ?
                        navigation.navigate('ListReport', { filteredData: report, nonClassify: false }) :
                        navigation.navigate('ListReport', { filteredData: report, nonClassify: false })
                })

        }
        if (checkClassArray.length === 0 && checkStateArray.length > 0) {
            return firestore()
                .collection('Report').where('statusNumber', 'in', checkStateArray).where('isApproved', '==', false).get()
                .then((querySnapShot) => {
                    const users1 = []
                    querySnapShot.forEach((doc) => {
                        //firestore().collection('Report').doc(doc.id).where('statusNumber', 'in', [state])
                        users1.push({
                            data: doc.data(),
                            key: doc.id
                        })
                    });
                    const report = [...new Map(users1.map(o => [JSON.stringify(o), o])).values()]
                    setArray(report)
                    pendingRequest ?
                        navigation.navigate('ListReport', { filteredData: report, nonClassify: false }) :
                        navigation.navigate('ListReport', { filteredData: report, nonClassify: false })

                })
        }
        if (checkClassArray.length === 0 && checkStateArray.length === 0) {
            return pendingRequest ?
                navigation.navigate('ListReport', { nonClassify: true }) :
                navigation.navigate('ListReport', { nonClassify: true })
        }

        firestore()
            .collection('Report').where('check', 'in', checkClassArray).where('isApproved', '==', false).get()
            .then((querySnapShot) => {
                const users1 = []
                querySnapShot.forEach((doc) => {
                    //firestore().collection('Report').doc(doc.id).where('statusNumber', 'in', [state])
                    users1.push({
                        data: doc.data(),
                        key: doc.id
                    })
                });
                firestore()
                    .collection('Report').where('statusNumber', 'in', checkStateArray).where('isApproved', '==', false).get()
                    .then((querySnapShot) => {
                        querySnapShot.forEach((doc) => {
                            //firestore().collection('Report').doc(doc.id).where('statusNumber', 'in', [state])
                            users1.push({
                                data: doc.data(),
                                key: doc.id
                            })
                        });
                        const report = [...new Map(users1.map(o => [JSON.stringify(o), o])).values()]
                        setArray(report)
                        return pendingRequest ?
                            navigation.navigate('RequestedReport', { filteredData: report, nonClassify: false }) :
                            navigation.navigate('RequestReport', { filteredData: report, nonClassify: false })
                    })

            })

    }
    const State = ({ title, header, state, check }) => {
        const chooseState = async () => {
            await firestore()
                .collection('Report').where('check', 'in', [1, 2]).get()
                .then((querySnapShot) => {
                    const users1 = []
                    querySnapShot.forEach((doc) => {
                        //firestore().collection('Report').doc(doc.id).where('statusNumber', 'in', [state])
                        users1.push({
                            data: doc.data(),
                            key: doc.id
                        })
                    });
                    firestore()
                        .collection('Report').where('statusNumber', 'in', [state]).get()
                        .then((querySnapShot) => {
                            querySnapShot.forEach((doc) => {
                                //firestore().collection('Report').doc(doc.id).where('statusNumber', 'in', [state])
                                users1.push({
                                    data: doc.data(),
                                    key: doc.id
                                })
                            });
                            const report = [...new Map(users1.map(o => [JSON.stringify(o), o])).values()]
                            setArray(report)
                        })

                })

            /*  const Response = await firestore()
                .collection('ReportDetail').doc("bTBRMXwzEUxIxXx6GxQR")
                .get()
                .then(documentSnapshot => {
                    if (documentSnapshot.exists) {
                        const data = documentSnapshot.data()
                        setResponseData(data)
                    }
                })  */
            //.log(array)
        }


        const headerRe = header ? '#2d79ed' : null
        const textRe = header ? 'white' : 'black'
        return (
            <View style={{
                backgroundColor: headerRe, borderBottomColor: '#b3bcc9',
                borderBottomWidth: 0.7
            }}>
                <TouchableOpacity
                    style={{ padding: 7, paddingLeft: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
                    disabled={header}

                >
                    <Text style={{ color: textRe, paddingVertical: 10 }}>{title}</Text>
                    {checkState[state] ? <Icon name='check' size={24} color='#2d79ed' /> : null}
                </TouchableOpacity>
            </View>
        )
    }
    const Check = ({ title, header, iconName, iconColor }) => {
        const headerRe = header ? '#2d79ed' : null
        const textRe = header ? 'white' : 'black'
        const returnTitle = title ? title : ''
        const returnIconName = iconName ? iconName : 'dots-horizontal'
        const returnIconColor = iconColor ? iconColor : 'transparent'
        return (
            <View style={{
                backgroundColor: headerRe
            }}>
                <TouchableOpacity
                    style={{}}
                    activeOpacity={0.5}
                    disabled={header}
                >
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        {header ? null : <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>
                            <Icon name={returnIconName} size={35} color='white' style={{ backgroundColor: returnIconColor, borderRadius: 20 }} />
                        </View>}
                        <View style={{
                            flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
                            flex: 8, borderBottomColor: '#b3bcc9',
                            borderBottomWidth: header ? 0 : 0.7, padding: 10
                        }}>
                            <Text style={{ color: textRe, paddingVertical: 7 }}>{returnTitle}</Text>
                            <Icon name='check' size={24} color='#2d79ed' />
                        </View>

                    </View>
                </TouchableOpacity>
            </View>
        )
    }


    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <ScrollView>
                <View style={{
                    margin: 0, padding: 7, paddingLeft: 0, flexDirection: 'row',
                    justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#2d79ed',
                    borderRightWidth: 0, borderTopColor: 1, borderLeftWidth: 0, borderTopWidth: 0
                }}>
                    <TouchableOpacity
                        style={{ paddingLeft: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
                        disabled={true}
                    >
                        <Text style={{ color: 'white', paddingVertical: 10 }}>Trạng Thái</Text>

                    </TouchableOpacity>
                </View>
                {checkboxesState.map(checkbox => {
                    const isChecked = checked[checkbox.id]
                    return (

                        <CheckBox
                            containerStyle={{
                                margin: 0, paddingBottom: 12, paddingTop: 12, paddingLeft: 0,
                                backgroundColor: 'white',
                                borderRightWidth: 0, borderTopColor: 1, borderLeftWidth: 0, borderTopWidth: 0
                            }}
                            textStyle={{ justifyContent: 'space-between' }}
                            iconRight={true}
                            checkedIcon={<Icon name="check" size={24} color='#2d79ed' style={{ position: 'absolute', left: '95%' }} />}
                            uncheckedIcon={<Icon name="check" size={24} color='#2d79ed' style={{ position: 'absolute', left: '95%', opacity: 0 }} />}
                            key={checkbox.id}
                            title={checkbox.title}
                            checked={isChecked === true}
                            onPress={() => setChecked({ ...checked, [checkbox.id]: !isChecked })} />
                    )
                })}
                <View style={{}}>
                    <Check title='Loại' header={true} />
                    {checkboxesClassification.map(checkbox => {
                        const isCheckedClass = checkedClass[checkbox.id]
                        const Title = () => {
                            return (
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Icon name={checkbox.iconName}
                                        size={40} color='white'
                                        style={{
                                            paddingHorizontal: 0, borderRadius: 50,
                                            backgroundColor: checkbox.iconColor,
                                            marginLeft: 10, marginRight: 15
                                        }}

                                    />
                                    <Text>{checkbox.title}</Text>
                                </View>)
                        }
                        return (

                            <CheckBox
                                containerStyle={{
                                    margin: 0, paddingBottom: 5, paddingTop: 5, paddingLeft: 0,
                                    backgroundColor: 'white',
                                    borderRightWidth: 0, borderTopColor: 1, borderLeftWidth: 0, borderTopWidth: 0
                                }}
                                textStyle={{}}
                                iconRight={true}
                                checkedIcon={<Icon name="check" size={24} color='#2d79ed' style={{ position: 'absolute', left: '95%' }} />}
                                uncheckedIcon={<Icon name="check" size={24} color='#2d79ed' style={{ position: 'absolute', left: '95%', opacity: 0 }} />}
                                key={checkbox.id}
                                title={Title()}
                                checked={isCheckedClass === true}
                                onPress={() => setCheckedClass({ ...checkedClass, [checkbox.id]: !isCheckedClass })} />
                        )
                    })}
                </View>
            </ScrollView>
        </View>
    )
}
const mapStateToProps = (state) => {
    return {
        thisState: state.reportReducer
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        setFilter: (filter) => dispatch(setFilter(filter))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(FilterForUser)