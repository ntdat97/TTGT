import React, { useState, useEffect } from 'react'
import { ToastAndroid, StyleSheet, Text, View, Dimensions, TextInput, KeyboardAvoidingView, ScrollView, TouchableOpacity, } from 'react-native';
import { CheckBox } from 'react-native-elements'
import NextArrowButton from '../component/NextArrowButton'
import { connect } from 'react-redux'
import { getSubmitTime, updateUserInfo, del_state } from '../actions/report'
import { getTime } from './getAddress'
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoadingScreenModal } from './LoadingScreen'
const { height } = Dimensions.get('window');
function Report4({ navigation, updateUserInfo, userInfo, getSubmitTime, thisState, del_state }) {
    const [name, setName] = useState('red')
    const [phone, setPhone] = useState('red')
    const [loadingSubmit, setLoadingSubmit] = useState(false)
    const [contentNameFromRedux, setContentNameFromRedux] = useState('')
    const [contentPhoneFromRedux, setContentPhoneFromRedux] = useState('')
    const onBlurFun = (id) => {
        switch (id) {
            case 'name':
                userInfo.name ? setName('blue') : setName('red')
            case 'phone':
                userInfo.phone ? setPhone('blue') : setPhone('red')
            default: return id
        }
    }
    const setContentNameF = (e) => {
        const info = { ...userInfo, name: e }
        updateUserInfo(info)
    }
    const setContentPhoneF = (e) => {
        const info = { ...userInfo, phone: e }
        updateUserInfo(info)
    }
    const setContentEmailF = (e) => {
        const info = { ...userInfo, email: e }
        updateUserInfo(info)
    }
    const anonymousCheck = () => {
        const check = userInfo.anonymous
        const info = { ...userInfo, anonymous: !check }
        updateUserInfo(info)
    }
    const AddButton = () => {
        return (
            <View style={{ alignItems: 'center' }}>
                <TouchableOpacity
                    onPress={add}
                    style={{
                        opacity: check ? 0.2 : 1,
                        backgroundColor: 'blue',
                        paddingVertical: 8,
                        borderRadius: 10,
                        width: 250,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                    disabled={check}
                >
                    <Text style={{ color: 'white' }}>Đăng</Text>
                </TouchableOpacity>
            </View>)
    }

    useEffect(() => {
        setContentNameFromRedux(userInfo.name)
        setContentPhoneFromRedux(userInfo.phone)
        time()
    }, [])
    const time = async () => {
        const submitTime = await getTime()
        getSubmitTime(submitTime[0].timestamp)
    }
    const add = async () => {
        setLoadingSubmit(true)
        var batch = firestore().batch()
        const id = firestore().collection("Report").doc();
        const detail = firestore().collection("ReportDetail").doc(id.id)
        const response = firestore().collection("ReportResponse").doc();
        const responseStatus = firestore().collection("ReportResponse").doc(response.id).collection('status').doc('0');
        batch.set(id, {
            check: thisState.check,
            title: thisState.title,
            submitTime: thisState.submitTime,
            id: id.id,
            isApproved: false,
            status: 'Hệ thống đã nhận',
            statusNumber: 1
        })
        batch.set(response, {
            idReport: id.id,
            responseGmail: ''
        })
        batch.set(responseStatus, {
            addedTime: thisState.submitTime * 1000,
            isAccept: true,
            picListResponse: [],
            responseContent: '',
            selectedIndex: 0,
            status: 'Hệ thống đã nhận'
        })
        batch.set(detail, {
            userInfo: thisState.userInfo,
            content: thisState.content,
            finalPosition: thisState.finalPosition,
            marker: thisState.marker,
            picList: thisState.picList,
            id: id.id,
            check: thisState.check,
            title: thisState.title,
            submitTime: thisState.submitTime,
        })
        batch.commit().then(async () => {
            await AsyncStorage.setItem('myReport' + id.id, id.id)
            navigation.navigate('TabReport')
            del_state()
            setLoadingSubmit(false)
            ToastAndroid.showWithGravityAndOffset(
                "Đã thêm phản ánh",
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
                25,
                50
            );
        });
    }
    const check = userInfo.name && userInfo.phone ? false : true
    return (
        <KeyboardAvoidingView
            style={styles.contaner}
            behavior={Platform.OS == "ios" ? "padding" : "height"}
        >
            <ScrollView >
                <View style={[styles.wrapStep, { height: height * 0.08 }]}>
                    <Text style={styles.textStep}>Bước 4: Điền thông liên lạc</Text>
                </View>
                <View style={styles.wrapMain}>
                    <Text style={styles.textMain}>Vui lòng điền các thông tin cá nhân để chúng tôi liên lạc khi phản ánh của bạn được xử lý</Text>
                </View>
                <View style={{ maxHeight: height * 0.7, marginTop: 20 }}>
                    <Text style={styles.textContent}>Họ Tên (*)</Text>

                    <ScrollView
                        style={{ maxHeight: height * 0.5, marginBottom: 10, borderColor: name, borderBottomWidth: 2, marginLeft: 10 }}

                    >
                        <TextInput
                            style={{ paddingBottom: 15 }}
                            onChangeText={(e) => setContentNameF(e)}
                            onFocus={() => setName('blue')}
                            onBlur={() => onBlurFun('name')}
                            defaultValue={contentNameFromRedux ? contentNameFromRedux : ''}
                        />
                    </ScrollView>

                    <Text style={styles.textContent}>Số điện thoại (*)</Text>
                    <ScrollView style={{ maxHeight: height * 0.5, marginBottom: 10, borderColor: phone, borderBottomWidth: 2, marginLeft: 10 }}>
                        <TextInput
                            style={{ paddingBottom: 15 }}
                            onChangeText={(e) => setContentPhoneF(e)}
                            onFocus={() => setPhone('blue')}
                            onBlur={() => onBlurFun('phone')}
                            defaultValue={contentPhoneFromRedux ? contentPhoneFromRedux : ''}
                        />
                    </ScrollView>
                    <Text style={styles.textContent}>Email</Text>
                    <ScrollView style={{ maxHeight: height * 0.5, marginBottom: 20, borderColor: 'grey', borderBottomWidth: 2, marginLeft: 10 }}>
                        <TextInput
                            style={{ paddingBottom: 15 }}
                            onChangeText={(e) => setContentEmailF(e)}
                        />
                    </ScrollView>
                    <CheckBox
                        title="Ẩn danh"
                        checked={userInfo.anonymous}
                        right={true}
                        textStyle={styles.textCheck}
                        containerStyle={styles.containerCheck}
                        onPress={() => anonymousCheck()}
                    />
                    {loadingSubmit ? <LoadingScreenModal /> : <AddButton />}


                </View>

            </ScrollView>
            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', bottom: 0, position: 'absolute', paddingHorizontal: 10 }}>
                <NextArrowButton
                    iconName='arrow-left-bold'
                    custom={{ alignItems: 'flex-start' }}
                    onPress={() => navigation.navigate('Report3Home')}
                />
            </View>
        </KeyboardAvoidingView>
    )
}
const styles = StyleSheet.create({
    contaner: {
        flex: 1,
        backgroundColor: 'white'
    },
    wrapStep: {
        justifyContent: 'center',
        alignItems: 'center',


    },
    textStep: {
        fontSize: 20,
        color: 'rgb(51, 153, 255)'
    },
    wrapMain: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    textMain: {
        fontSize: 18,
        color: 'black',
        textAlign: 'center',
        paddingHorizontal: 10
    },
    textContent: {
        fontSize: 17,
        marginLeft: 10
    },
    selectMap: {
        borderColor: 'grey',
        marginHorizontal: 30,
        marginTop: 20,
        borderRadius: 8,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,

        elevation: 3,
    },
    content: {
        flex: 1,
    },
    textCheck: {
        color: 'blue'
    },
    containerCheck: {
        borderWidth: 1,
        width: 120,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        marginBottom: 60
    },
    takePic: {
        backgroundColor: 'blue',

        paddingVertical: 8,
        borderRadius: 10,
        width: 250,
        justifyContent: 'center',
        alignItems: 'center'

    },
})
const mapStateToProps = (state) => {
    return {
        userInfo: state.reportReducer.userInfo,
        thisState: state.reportReducer
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        updateUserInfo: (info) => dispatch(updateUserInfo(info)),
        getSubmitTime: (submitTime) => dispatch(getSubmitTime(submitTime)),
        del_state: () => dispatch(del_state())
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Report4)